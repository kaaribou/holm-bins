"""Calcul des dates de collecte : récurrences, jours fériés, mois actifs, dates ajoutées ou annulées.
Fonctions pures (aucune dépendance à Home Assistant) : testables seules."""
from __future__ import annotations

from datetime import date, timedelta

from .const import RULE_MONTHLY, RULE_WEEKLY, SRC_CALENDAR, SRC_DATES, SRC_RULE

HORIZON = 400   # jours explorés vers l'avant


def parse_date(v) -> date | None:
    if isinstance(v, date):
        return v
    try:
        return date.fromisoformat(str(v)[:10])
    except (TypeError, ValueError):
        return None


def easter(y: int) -> date:
    """Dimanche de Pâques (algorithme de Meeus/Jones/Butcher)."""
    a, b, c = y % 19, y // 100, y % 100
    d, e = b // 4, b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i, k = c // 4, c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    month = (h + l - 7 * m + 114) // 31
    day = ((h + l - 7 * m + 114) % 31) + 1
    return date(y, month, day)


def french_holidays(y: int) -> set[date]:
    e = easter(y)
    return {date(y, 1, 1), e + timedelta(days=1), date(y, 5, 1), date(y, 5, 8), e + timedelta(days=39), e + timedelta(days=50),
            date(y, 7, 14), date(y, 8, 15), date(y, 11, 1), date(y, 11, 11), date(y, 12, 25)}


def _rule_match(rule: dict, d: date) -> bool:
    kind = rule.get("type", RULE_WEEKLY)
    if kind == RULE_WEEKLY:
        days = rule.get("weekdays") or [0]
        if d.weekday() not in days:
            return False
        interval = max(1, int(rule.get("interval") or 1))
        if interval == 1:
            return True
        anchor = parse_date(rule.get("anchor")) or date(2026, 1, 5)
        # semaines comptées du lundi de la semaine de référence
        weeks = ((d - timedelta(days=d.weekday())) - (anchor - timedelta(days=anchor.weekday()))).days // 7
        return weeks % interval == 0
    if kind == RULE_MONTHLY:
        if d.weekday() != int(rule.get("weekday") or 0):
            return False
        nth = int(rule.get("nth") or 1)
        if nth == -1:
            return (d + timedelta(days=7)).month != d.month
        return (d.day - 1) // 7 + 1 == nth
    return False


def rule_dates(rule: dict, start: date, days: int = HORIZON) -> list[date]:
    return [d for d in (start + timedelta(days=i) for i in range(days)) if _rule_match(rule, d)]


def compute(bin_cfg: dict, start: date, calendar_dates: list[date] | None = None, days: int = HORIZON) -> list[date]:
    """Prochaines dates de collecte à partir de `start` (inclus)."""
    src = bin_cfg.get("source", SRC_RULE)
    end = start + timedelta(days=days)
    if src == SRC_RULE:
        base = rule_dates(bin_cfg.get("rule") or {}, start - timedelta(days=7), days + 7)
    elif src == SRC_CALENDAR:
        base = list(calendar_dates or [])
    else:
        base = []
    # mois actifs (déchets verts…) — ne s'appliquent qu'aux dates calculées, pas aux dates ajoutées
    months = set(bin_cfg.get("months") or [])
    if months and src != SRC_DATES:
        base = [d for d in base if d.month in months]
    if bin_cfg.get("holidays") and src == SRC_RULE:
        shifted = []
        hol: dict[int, set[date]] = {}
        for d in base:
            n = d
            while n in hol.setdefault(n.year, french_holidays(n.year)):
                n += timedelta(days=1)
            shifted.append(n)
        base = shifted
    skip = {x for x in (parse_date(v) for v in bin_cfg.get("skip") or []) if x}
    extra = {x for x in (parse_date(v) for v in bin_cfg.get("extra") or []) if x}
    out = sorted({d for d in base if d not in skip} | extra)
    return [d for d in out if start <= d < end]


def detect_rule(dates: list[date]) -> dict | None:
    """Reconnaît une récurrence simple (même jour, toutes les N semaines) dans une liste de dates."""
    ds = sorted(set(dates))
    if len(ds) < 3:
        return None
    gaps = {(b - a).days for a, b in zip(ds, ds[1:])}
    if len(gaps) != 1:
        return None
    gap = gaps.pop()
    if gap % 7 or not 7 <= gap <= 28:
        return None
    return {"type": RULE_WEEKLY, "weekdays": [ds[0].weekday()], "interval": gap // 7, "anchor": ds[0].isoformat(), "nth": 1, "weekday": ds[0].weekday()}
