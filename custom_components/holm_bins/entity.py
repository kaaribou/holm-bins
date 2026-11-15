"""Base commune : une poubelle = un appareil, avec des identifiants d'entité fixes (sensor.<poubelle>_prochaine_collecte…)."""
from __future__ import annotations

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import Entity

from .const import DOMAIN, NAME, VERSION


class BinEntity(Entity):
    _attr_should_poll = False
    _attr_has_entity_name = True
    _domain = "sensor"
    _suffix = ""

    def __init__(self, entry, manager, bin_cfg: dict, key: str) -> None:
        self.manager = manager
        self.bin_id = bin_cfg["id"]
        self._attr_unique_id = f"{entry.entry_id}_{self.bin_id}_{key}"
        self._attr_translation_key = key
        self.entity_id = f"{self._domain}.{self.bin_id}_{self._suffix or key}"
        self._attr_device_info = DeviceInfo(identifiers={(DOMAIN, f"{entry.entry_id}_{self.bin_id}")}, name=bin_cfg["name"],
                                            manufacturer="HOLM", model=NAME, sw_version=VERSION)

    @property
    def cfg(self) -> dict:
        return self.manager.bin(self.bin_id) or {}

    @property
    def data(self) -> dict:
        return self.manager.info.get(self.bin_id) or {}

    @property
    def available(self) -> bool:
        return self.bin_id in self.manager.info

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(self.manager.add_listener(self.async_write_ha_state))
