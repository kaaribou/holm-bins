"""HOLM Poubelles : dates de collecte, rappels « à sortir » et sorties confirmées, avec sa carte."""
from __future__ import annotations

import hashlib
import logging
import os

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED, Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er

from .const import CARD_NAME, CARD_URL, DOMAIN, STATIC_PATH, VERSION
from .manager import BinsManager
from .websocket import async_register

_LOGGER = logging.getLogger(__name__)
PLATFORMS = [Platform.SENSOR, Platform.BINARY_SENSOR, Platform.SWITCH]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    data = hass.data.setdefault(DOMAIN, {})
    if not data.get("ws"):
        async_register(hass)
        data["ws"] = True
    await _async_setup_card(hass)
    manager = BinsManager(hass, entry)
    await manager.async_load()
    _cleanup(hass, entry, {b["id"] for b in manager.bins})
    await manager.async_refresh()
    manager.start()
    entry.runtime_data = manager
    entry.async_on_unload(manager.stop)
    if not hass.is_running:   # les calendriers ne sont pas forcément prêts au démarrage : on relit une fois HA lancé
        async def _started(_event):
            await manager.async_refresh()
        entry.async_on_unload(hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _started))
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


def _cleanup(hass: HomeAssistant, entry: ConfigEntry, ids: set[str]) -> None:
    """Retire les appareils et entités des poubelles supprimées depuis la carte."""
    keep = {f"{entry.entry_id}_{i}" for i in ids}
    dev_reg = dr.async_get(hass)
    for device in dr.async_entries_for_config_entry(dev_reg, entry.entry_id):
        if not any(idf[0] == DOMAIN and idf[1] in keep for idf in device.identifiers):
            dev_reg.async_remove_device(device.id)
    ent_reg = er.async_get(hass)
    for e in er.async_entries_for_config_entry(ent_reg, entry.entry_id):
        if not any(e.unique_id.startswith(k + "_") for k in keep):
            ent_reg.async_remove(e.entity_id)


async def _async_setup_card(hass: HomeAssistant) -> None:
    """Sert la carte HOLM Poubelles et la déclare une seule fois dans les ressources du tableau de bord."""
    data = hass.data.setdefault(DOMAIN, {})
    if data.get("card"):
        return
    data["card"] = True
    try:
        www = os.path.join(os.path.dirname(__file__), "www")
        await hass.http.async_register_static_paths([StaticPathConfig(STATIC_PATH, www, False)])
        digest = await hass.async_add_executor_job(_file_hash, os.path.join(www, CARD_NAME))
        url = f"{CARD_URL}?v={VERSION}-{digest}"
        if not await _register_resource(hass, url):
            add_extra_js_url(hass, url)
    except Exception as err:  # noqa: BLE001 — la carte est un bonus, l'intégration doit démarrer
        _LOGGER.warning("Carte HOLM Poubelles non déclarée : %s", err)


async def _register_resource(hass: HomeAssistant, url: str) -> bool:
    try:
        lovelace = hass.data.get("lovelace")
        resources = getattr(lovelace, "resources", None) or (lovelace.get("resources") if isinstance(lovelace, dict) else None)
        if resources is None or not hasattr(resources, "async_create_item"):
            return False
        if not getattr(resources, "loaded", True):
            await resources.async_load()
            resources.loaded = True
        items = list(resources.async_items())
        mine = [r for r in items if str(r.get("url", "")).split("?")[0] == CARD_URL]
        if not mine:
            await resources.async_create_item({"res_type": "module", "url": url})
        elif mine[0].get("url") != url:
            await resources.async_update_item(mine[0]["id"], {"res_type": "module", "url": url})
        return True
    except Exception as err:  # noqa: BLE001
        _LOGGER.debug("Ressource Lovelace non enregistrée (%s), chargement par extra_js_url", err)
        return False


def _file_hash(path: str) -> str:
    try:
        with open(path, "rb") as f:
            return hashlib.sha1(f.read()).hexdigest()[:8]
    except OSError:
        return "0"


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
