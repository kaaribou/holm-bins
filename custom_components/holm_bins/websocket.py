"""API de la carte : lecture des poubelles et réglages, aperçu des dates, enregistrement (administrateurs), sortie."""
from __future__ import annotations

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN, SOURCES, STYLES


def _entry(hass: HomeAssistant):
    entries = [e for e in hass.config_entries.async_entries(DOMAIN) if getattr(e, "runtime_data", None)]
    return entries[0] if entries else None


@callback
def async_register(hass: HomeAssistant) -> None:
    for cmd in (ws_get, ws_save, ws_preview, ws_out, ws_test, ws_check):
        websocket_api.async_register_command(hass, cmd)


def _not_loaded(connection, msg):
    connection.send_error(msg["id"], "not_loaded", "HOLM Poubelles n'est pas configuré")


@websocket_api.websocket_command({vol.Required("type"): "holm_bins/get"})
@callback
def ws_get(hass, connection, msg):
    entry = _entry(hass)
    if not entry:
        return _not_loaded(connection, msg)
    m = entry.runtime_data
    notify = sorted(hass.services.async_services().get("notify", {}).keys())
    connection.send_result(msg["id"], {
        "bins": m.bins, "settings": m.settings, "admin": connection.user.is_admin,
        "notify_services": [s for s in notify if s not in ("send_message", "persistent_notification")],
        "styles": list(STYLES), "sources": list(SOURCES), "last_check": m.last_check,
    })


_BIN = vol.Schema({vol.Optional("id"): str, vol.Required("name"): str}, extra=vol.ALLOW_EXTRA)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "holm_bins/save", vol.Required("bins"): [_BIN], vol.Optional("settings"): dict})
@websocket_api.async_response
async def ws_save(hass, connection, msg):
    entry = _entry(hass)
    if not entry:
        return _not_loaded(connection, msg)
    m = entry.runtime_data
    await m.async_replace(msg["bins"], msg.get("settings"))
    connection.send_result(msg["id"], {"ok": True, "bins": m.bins})
    # rechargement : crée / retire les entités des poubelles ajoutées ou supprimées, renomme les appareils, relit les calendriers
    hass.async_create_task(hass.config_entries.async_reload(entry.entry_id))


@websocket_api.websocket_command({vol.Required("type"): "holm_bins/preview", vol.Required("bin"): dict, vol.Optional("count", default=6): int})
@websocket_api.async_response
async def ws_preview(hass, connection, msg):
    entry = _entry(hass)
    if not entry:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], {"dates": await entry.runtime_data.async_preview(msg["bin"], min(24, msg["count"]))})


@websocket_api.websocket_command({vol.Required("type"): "holm_bins/out", vol.Required("bin"): str, vol.Required("out"): bool})
@callback
def ws_out(hass, connection, msg):
    entry = _entry(hass)
    if not entry:
        return _not_loaded(connection, msg)
    entry.runtime_data.set_out(msg["bin"], msg["out"])
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "holm_bins/test"})
@websocket_api.async_response
async def ws_test(hass, connection, msg):
    entry = _entry(hass)
    if not entry:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], {"sent": await entry.runtime_data.async_test_notification()})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "holm_bins/check"})
@websocket_api.async_response
async def ws_check(hass, connection, msg):
    """Vérification par caméra à la demande (test : ne marque rien comme sorti et n'envoie pas d'alerte)."""
    entry = _entry(hass)
    if not entry:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], await entry.runtime_data.async_camera_check(force=True))
