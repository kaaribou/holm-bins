"""« Sortie » : la poubelle est sortie pour la prochaine collecte. Se remet à zéro tout seul après la collecte.
Peut être allumé depuis la carte, la notification (« C'est fait »), une automatisation ou une détection caméra."""
from __future__ import annotations

from homeassistant.components.switch import SwitchEntity

from .entity import BinEntity


async def async_setup_entry(hass, entry, async_add_entities):
    m = entry.runtime_data
    async_add_entities([OutSwitch(entry, m, b) for b in m.bins])


class OutSwitch(BinEntity, SwitchEntity):
    def __init__(self, entry, m, b):
        self._domain = "switch"
        self._suffix = "sortie"
        super().__init__(entry, m, b, "out")

    @property
    def is_on(self):
        return bool(self.data.get("out"))

    @property
    def icon(self):
        return "mdi:delete-circle" if self.is_on else "mdi:delete-circle-outline"

    async def async_turn_on(self, **kwargs):
        self.manager.set_out(self.bin_id, True)

    async def async_turn_off(self, **kwargs):
        self.manager.set_out(self.bin_id, False)
