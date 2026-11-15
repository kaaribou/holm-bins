"""« À sortir » : allumé la veille à partir de l'heure du rappel et le jour de collecte, tant que la poubelle n'est pas sortie."""
from __future__ import annotations

from homeassistant.components.binary_sensor import BinarySensorEntity

from .entity import BinEntity


async def async_setup_entry(hass, entry, async_add_entities):
    m = entry.runtime_data
    async_add_entities([DueSensor(entry, m, b) for b in m.bins])


class DueSensor(BinEntity, BinarySensorEntity):
    _attr_icon = "mdi:delete-alert"

    def __init__(self, entry, m, b):
        self._domain = "binary_sensor"
        self._suffix = "a_sortir"
        super().__init__(entry, m, b, "due")

    @property
    def is_on(self):
        return bool(self.data.get("due"))
