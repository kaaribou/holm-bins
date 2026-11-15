"""Cœur de HOLM Poubelles : poubelles enregistrées, prochaines collectes, état « à sortir », sorties confirmées et rappels."""
from __future__ import annotations

import copy
import logging
import re
import unicodedata
from datetime import date, datetime, timedelta
from typing import Callable

from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.event import async_track_state_change_event, async_track_time_change
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (ACTION_DONE, DEFAULT_BIN, DEFAULT_SETTINGS, EVENT_DUE, EVENT_NOTIFY_ACTION, NOTIF, SRC_CALENDAR, SRC_RULE,
                    ST_EVE, ST_LATER, ST_NONE, ST_OUT, ST_SOON, ST_TODAY, STORE_KEY, STORE_VERSION, WEEKDAYS)
from .recurrence import HORIZON, compute, detect_rule, parse_date

_LOGGER = logging.getLogger(__name__)


def slugify(text: str) -> str:
    t = unicodedata.normalize("NFKD", str(text or "")).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "_", t).strip("_") or "poubelle"


def _hm(v: str | None) -> tuple[int, int] | None:
    m = re.match(r"^\s*(\d{1,2}):(\d{2})", str(v or ""))
    return (int(m.group(1)) % 24, int(m.group(2)) % 60) if m else None


def clean_bin(raw: dict, existing_ids: set[str]) -> dict:
    """Normalise une poubelle reçue de la carte ou de l'import (valeurs par défaut, types)."""
    b = copy.deepcopy(DEFAULT_BIN)
    for k, v in (raw or {}).items():
        if k in DEFAULT_BIN or k in ("id", "order"):
            b[k] = v
    rule = {**DEFAULT_BIN["rule"], **(raw.get("rule") or {})}
    rule["weekdays"] = sorted({int(x) % 7 for x in (rule.get("weekdays") or [0])})
    rule["interval"] = max(1, min(8, int(rule.get("interval") or 1)))
    rule["nth"] = int(rule.get("nth") or 1)
    rule["weekday"] = int(rule.get("weekday") or 0) % 7
    b["rule"] = rule
    b["months"] = sorted({int(m) for m in b.get("months") or [] if 1 <= int(m) <= 12})
    b["extra"] = sorted({d.isoformat() for d in (parse_date(x) for x in b.get("extra") or []) if d})
    b["skip"] = sorted({d.isoformat() for d in (parse_date(x) for x in b.get("skip") or []) if d})
    b["name"] = str(b.get("name") or "Poubelle").strip()[:40]
    if not re.match(r"^#[0-9a-fA-F]{6}$", str(b.get("color") or "")):
        b["color"] = DEFAULT_BIN["color"]
    bid = b.get("id")
    if not bid or not re.match(r"^[a-z0-9_]+$", str(bid)):
        base = slugify(b["name"])
        bid, n = base, 2
        while bid in existing_ids:
            bid, n = f"{base}_{n}", n + 1
    b["id"] = bid
    return b


class BinsManager:
    def __init__(self, hass: HomeAssistant, entry) -> None:
        self.hass = hass
        self.entry = entry
        self._store = Store(hass, STORE_VERSION, STORE_KEY)
        self.bins: list[dict] = []
        self.settings: dict = dict(DEFAULT_SETTINGS)
        self.out: dict[str, str] = {}            # id -> date de collecte pour laquelle la poubelle est sortie
        self.dates: dict[str, list[date]] = {}   # id -> prochaines dates
        self.info: dict[str, dict] = {}          # id -> état calculé
        self._cal: dict[str, list[date]] = {}    # calendrier -> dates
        self._sent: set[str] = set()
        self._listeners: list[Callable] = []
        self._unsubs: list[Callable] = []
        self._day: date | None = None

    # ---------- chargement / enregistrement ----------
    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
        self.settings = {**DEFAULT_SETTINGS, **(data.get("settings") or {})}
        self.out = dict(data.get("out") or {})
        ids: set[str] = set()
        for raw in data.get("bins") or []:
            b = clean_bin(raw, ids)
            ids.add(b["id"])
            self.bins.append(b)
        if not data and self.entry.data.get("import_calendars"):
            await self._import(self.entry.data["import_calendars"], self.entry.data.get("detect_rules", True))
            await self.async_save()

    async def async_save(self) -> None:
        await self._store.async_save({"bins": self.bins, "settings": self.settings, "out": self.out})

    async def _import(self, calendars: list[str], detect: bool) -> None:
        """Première installation : une poubelle par calendrier choisi, convertie en récurrence si elle est régulière."""
        palette = {"gris": "#78828c", "grise": "#78828c", "noir": "#37474f", "jaune": "#f5c518", "vert": "#43a047", "verte": "#43a047",
                   "bleu": "#1e88e5", "bleue": "#1e88e5", "marron": "#8d6e63", "brun": "#8d6e63", "orange": "#fb8c00", "rouge": "#e53935"}
        styles = {"jaune": "bac_jaune", "verre": "verre", "compost": "compost", "bio": "compost", "carton": "carton", "papier": "carton"}
        ids = {b["id"] for b in self.bins}
        today = dt_util.now().date()
        for cal in calendars:
            st = self.hass.states.get(cal)
            name = (st and st.attributes.get("friendly_name")) or cal.split(".", 1)[1].replace("_", " ").title()
            words = slugify(name).split("_")
            color = next((palette[w] for w in words if w in palette), "#607d8b")
            style = next((styles[w] for w in words if w in styles), "bac")
            raw = {"name": name, "color": color, "style": style, "source": SRC_CALENDAR, "calendar": cal, "order": len(self.bins)}
            if detect:
                dates = await self._fetch_calendar(cal, today - timedelta(days=60), today + timedelta(days=120))
                rule = detect_rule(dates)
                if rule:
                    raw.update({"source": SRC_RULE, "rule": rule})
            b = clean_bin(raw, ids)
            ids.add(b["id"])
            self.bins.append(b)

    async def async_replace(self, bins: list[dict], settings: dict | None) -> None:
        ids: set[str] = set()
        out = []
        for i, raw in enumerate(bins):
            b = clean_bin({**raw, "order": i}, ids)
            ids.add(b["id"])
            out.append(b)
        self.bins = out
        if settings is not None:
            s = {**DEFAULT_SETTINGS, **{k: v for k, v in settings.items() if k in DEFAULT_SETTINGS}}
            s["targets"] = [str(t).removeprefix("notify.") for t in s.get("targets") or []]
            self.settings = s
        self.out = {k: v for k, v in self.out.items() if k in ids}
        await self.async_save()

    # ---------- démarrage ----------
    def start(self) -> None:
        self._unsubs.append(async_track_time_change(self.hass, self._tick, second=5))
        self._unsubs.append(self.hass.bus.async_listen(EVENT_NOTIFY_ACTION, self._on_action))
        cals = sorted({b["calendar"] for b in self.bins if b["source"] == SRC_CALENDAR and b.get("calendar")})
        if cals:
            self._unsubs.append(async_track_state_change_event(self.hass, cals, self._on_calendar))

    def stop(self) -> None:
        for u in self._unsubs:
            u()
        self._unsubs.clear()

    def add_listener(self, cb: Callable) -> Callable:
        self._listeners.append(cb)
        return lambda: self._listeners.remove(cb) if cb in self._listeners else None

    def _notify_listeners(self) -> None:
        for cb in list(self._listeners):
            cb()

    # ---------- calendriers ----------
    async def _fetch_calendar(self, cal: str, start: date, end: date) -> list[date]:
        try:
            resp = await self.hass.services.async_call(
                "calendar", "get_events",
                {"entity_id": cal, "start_date_time": f"{start.isoformat()} 00:00:00", "end_date_time": f"{end.isoformat()} 00:00:00"},
                blocking=True, return_response=True)
        except Exception as err:  # noqa: BLE001 — calendrier absent ou indisponible
            _LOGGER.warning("Calendrier %s illisible : %s", cal, err)
            return []
        events = (resp or {}).get(cal, {}).get("events", [])
        return sorted({d for d in (parse_date(e.get("start")) for e in events) if d})

    async def async_refresh(self) -> None:
        """Relit les calendriers puis recalcule toutes les dates."""
        today = dt_util.now().date()
        cals = {b["calendar"] for b in self.bins if b["source"] == SRC_CALENDAR and b.get("calendar")}
        for cal in cals:
            self._cal[cal] = await self._fetch_calendar(cal, today - timedelta(days=1), today + timedelta(days=HORIZON))
        self._compute_dates(today)
        self._update(dt_util.now())

    @callback
    def _on_calendar(self, _event: Event) -> None:
        self.hass.async_create_task(self.async_refresh())

    def _compute_dates(self, today: date) -> None:
        self._day = today
        for b in self.bins:
            self.dates[b["id"]] = compute(b, today, self._cal.get(b.get("calendar")))

    def preview(self, raw: dict, count: int = 6) -> list[str]:
        today = dt_util.now().date()
        b = clean_bin(raw, set())
        return [d.isoformat() for d in compute(b, today, self._cal.get(b.get("calendar")))[:count]]

    async def async_preview(self, raw: dict, count: int = 6) -> list[str]:
        cal = raw.get("calendar")
        if raw.get("source") == SRC_CALENDAR and cal and cal not in self._cal:
            today = dt_util.now().date()
            self._cal[cal] = await self._fetch_calendar(cal, today - timedelta(days=1), today + timedelta(days=HORIZON))
        return self.preview(raw, count)

    # ---------- états ----------
    def _end_passed(self, now: datetime) -> bool:
        end = _hm(self.settings.get("end")) or (12, 0)
        return (now.hour, now.minute) >= end

    def _update(self, now: datetime) -> None:
        today = now.date()
        eve_t = _hm(self.settings.get("time")) or (19, 0)
        info: dict[str, dict] = {}
        for b in self.bins:
            ds = [d for d in self.dates.get(b["id"], []) if d >= today]
            if ds and ds[0] == today and self._end_passed(now):
                ds = ds[1:]   # collecte du jour passée : on regarde la suivante
            nxt = ds[0] if ds else None
            days = (nxt - today).days if nxt else None
            out_for = self.out.get(b["id"])
            is_out = bool(nxt and out_for == nxt.isoformat())
            if out_for and not is_out:
                self.out.pop(b["id"], None)      # sortie d'une collecte passée : oubliée
            if days is None:
                st = ST_NONE
            elif is_out:
                st = ST_OUT
            elif days == 0:
                st = ST_TODAY
            elif days == 1:
                st = ST_EVE
            elif days == 2:
                st = ST_SOON
            else:
                st = ST_LATER
            due = (not is_out) and days is not None and (days == 0 or (days == 1 and (now.hour, now.minute) >= eve_t))
            info[b["id"]] = {"next": nxt, "days": days, "state": st, "out": is_out, "due": due, "dates": ds[:6]}
        changed = info != self.info
        self.info = info
        if changed:
            self._notify_listeners()

    @callback
    def _tick(self, now: datetime) -> None:
        now = dt_util.as_local(now)
        if self._day != now.date() or (now.minute == 0 and self._cal):   # nouveau jour, ou relecture horaire des calendriers
            self.hass.async_create_task(self._refresh_then_tick(now))
            return
        self._check(now)

    async def _refresh_then_tick(self, now: datetime) -> None:
        await self.async_refresh()
        self._check(now)

    def _check(self, now: datetime) -> None:
        self._update(now)
        hm = f"{now.hour:02d}:{now.minute:02d}"
        s = self.settings
        if hm == (s.get("time") or "")[:5]:
            self._send("eve", now)
        if s.get("reminder") and hm == s["reminder"][:5]:
            self._send("reminder", now)
        if s.get("morning") and hm == s["morning"][:5]:
            self._send("today", now)

    # ---------- sorties ----------
    def set_out(self, bin_id: str, value: bool) -> None:
        i = self.info.get(bin_id) or {}
        if value and i.get("next"):
            self.out[bin_id] = i["next"].isoformat()
        else:
            self.out.pop(bin_id, None)
        self.hass.async_create_task(self.async_save())
        self._update(dt_util.now())
        if value and not any(x["due"] for x in self.info.values()):
            self._clear_notifications()

    @callback
    def _on_action(self, event: Event) -> None:
        action = str(event.data.get("action") or "")
        if not action.startswith(ACTION_DONE):
            return
        ids = [x for x in action.split("|", 1)[1].split(",") if x] if "|" in action else [k for k, v in self.info.items() if v["due"]]
        for bid in ids:
            if bid in self.info:
                self.set_out(bid, True)

    # ---------- notifications ----------
    def _lang(self) -> str:
        lang = (self.hass.config.language or "en").split("-")[0]
        return lang if lang in NOTIF else "en"

    def _join(self, names: list[str], lang: str) -> str:
        return names[0] if len(names) == 1 else f"{', '.join(names[:-1])} {NOTIF[lang]['and']} {names[-1]}"

    def _send(self, kind: str, now: datetime) -> None:
        want = 1 if kind in ("eve", "reminder") else 0
        bins = [b for b in self.bins if b.get("notify") and (i := self.info.get(b["id"])) and i["days"] == want and not i["out"]]
        key = f"{now.date()}|{kind}"
        if not bins or key in self._sent:
            return
        self._sent.add(key)
        lang = self._lang()
        t = NOTIF[lang]
        names = self._join([b["name"] for b in bins], lang)
        nxt = self.info[bins[0]["id"]]["next"]
        when = f"{WEEKDAYS[lang][nxt.weekday()]} {nxt.strftime('%d/%m')}"
        if kind == "eve":
            self.hass.bus.async_fire(EVENT_DUE, {"bins": [b["id"] for b in bins], "names": [b["name"] for b in bins], "date": nxt.isoformat()})
        title = t["reminder_title"] if kind == "reminder" else t["title"]
        msg = t["reminder" if kind == "reminder" else ("eve" if kind == "eve" else "today")].format(bins=names, date=when)
        data = {"title": title, "message": msg,
                "data": {"tag": "holm_bins", "ttl": 0, "priority": "high", "notification_icon": "mdi:delete-empty",
                         "actions": [{"action": f"{ACTION_DONE}|{','.join(b['id'] for b in bins)}", "title": t["done"]}]}}
        for target in self.settings.get("targets") or []:
            if self.hass.services.has_service("notify", target):
                self.hass.async_create_task(self.hass.services.async_call("notify", target, data))
            else:
                _LOGGER.warning("Service notify.%s introuvable", target)

    def _clear_notifications(self) -> None:
        for target in self.settings.get("targets") or []:
            if target.startswith("mobile_app_") and self.hass.services.has_service("notify", target):
                self.hass.async_create_task(self.hass.services.async_call(
                    "notify", target, {"message": "clear_notification", "data": {"tag": "holm_bins"}}))

    async def async_test_notification(self) -> int:
        lang = self._lang()
        data = {"title": NOTIF[lang]["title"], "message": "HOLM Poubelles ✓", "data": {"tag": "holm_bins_test"}}
        n = 0
        for target in self.settings.get("targets") or []:
            if self.hass.services.has_service("notify", target):
                await self.hass.services.async_call("notify", target, data)
                n += 1
        return n

    # ---------- lecture ----------
    def bin(self, bin_id: str) -> dict | None:
        return next((b for b in self.bins if b["id"] == bin_id), None)
