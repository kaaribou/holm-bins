"""Capteurs par poubelle : prochaine collecte (date) et nombre de jours restants.
Le capteur « prochaine collecte » porte aussi tout ce dont la carte a besoin (couleur, style, animations…)."""
from __future__ import annotations

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.const import UnitOfTime

from .entity import BinEntity

ICONS = {"bac": "mdi:delete", "bac_jaune": "mdi:recycle", "verre": "mdi:bottle-wine", "sac": "mdi:sack", "compost": "mdi:leaf", "carton": "mdi:package-variant"}


async def async_setup_entry(hass, entry, async_add_entities):
    m = entry.runtime_data
    ents = []
    for b in m.bins:
        ents += [NextSensor(entry, m, b), DaysSensor(entry, m, b)]
    async_add_entities(ents)


class NextSensor(BinEntity, SensorEntity):
    _attr_device_class = SensorDeviceClass.DATE

    def __init__(self, entry, m, b):
        self._suffix = "prochaine_collecte"
        super().__init__(entry, m, b, "next")

    @property
    def native_value(self):
        return self.data.get("next")

    @property
    def icon(self):
        return self.cfg.get("icon") or ICONS.get(self.cfg.get("style"), "mdi:delete")

    @property
    def extra_state_attributes(self):
        c, d = self.cfg, self.data
        return {
            "holm_bins": self.bin_id,
            "nom": c.get("name"),
            "jours": d.get("days"),
            "etat": d.get("state"),
            "sortie": d.get("out"),
            "a_sortir": d.get("due"),
            "prochaines_dates": [x.isoformat() for x in d.get("dates") or []],
            "couleur": c.get("color"),
            "style": c.get("style"),
            "icone": c.get("icon") or None,
            "image": c.get("image") or None,
            "notification": c.get("notify"),
            "animation_veille": c.get("anim_eve") or None,
            "animation_jour": c.get("anim_today") or None,
            "animation_sortie": c.get("anim_out") or None,
            "source": c.get("source"),
            "ordre": c.get("order", 0),
        }


class DaysSensor(BinEntity, SensorEntity):
    _attr_native_unit_of_measurement = UnitOfTime.DAYS
    _attr_icon = "mdi:calendar-clock"

    def __init__(self, entry, m, b):
        self._suffix = "jours"
        super().__init__(entry, m, b, "days")

    @property
    def native_value(self):
        return self.data.get("days")
