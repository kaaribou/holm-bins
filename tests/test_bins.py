"""Tests de HOLM Poubelles (pytest-homeassistant-custom-component)."""
from datetime import datetime
from zoneinfo import ZoneInfo

import pytest
from freezegun.api import FrozenDateTimeFactory
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed, async_mock_service

from custom_components.holm_bins.const import DOMAIN

TZ = ZoneInfo("Europe/Paris")


@pytest.fixture(autouse=True)
def auto_enable(enable_custom_integrations):
    yield


async def _setup(hass, freezer, when):
    await hass.config.async_set_time_zone("Europe/Paris")
    hass.config.language = "fr"
    freezer.move_to(when)
    entry = MockConfigEntry(domain=DOMAIN, data={"import_calendars": [], "detect_rules": True})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_flow_and_entities(hass, freezer: FrozenDateTimeFactory):
    notif = async_mock_service(hass, "notify", "mobile_app_test")
    entry = await _setup(hass, freezer, datetime(2026, 11, 17, 18, 58, tzinfo=TZ))   # mardi soir
    m = entry.runtime_data

    async def save(bins, settings=None):
        await m.async_replace(bins, settings)
        await hass.config_entries.async_reload(entry.entry_id)
        await hass.async_block_till_done()
        return hass.config_entries.async_get_entry(entry.entry_id).runtime_data

    m = await save(settings={"targets": ["notify.mobile_app_test"], "time": "19:00", "reminder": "21:30", "morning": "", "end": "12:00"},
                   bins=[
                            {"name": "Poubelle Jaune", "color": "#f5c518", "style": "bac_jaune", "source": "rule", "rule": {"type": "weekly", "weekdays": [2], "interval": 1}},
                            {"name": "Poubelle Grise", "color": "#78828c", "source": "rule", "rule": {"type": "weekly", "weekdays": [2], "interval": 2, "anchor": "2026-09-02"}},
                            {"name": "Verre", "source": "dates", "extra": ["2026-12-01"], "notify": False},
                        ])
    st = hass.states.get("sensor.poubelle_jaune_prochaine_collecte")
    assert st.state == "2026-11-18"
    assert st.attributes["etat"] == "veille" and st.attributes["jours"] == 1
    assert hass.states.get("sensor.poubelle_grise_prochaine_collecte").state == "2026-11-25"
    assert hass.states.get("sensor.poubelle_grise_jours").state == "8"
    assert hass.states.get("sensor.verre_prochaine_collecte").state == "2026-12-01"
    assert hass.states.get("binary_sensor.poubelle_jaune_a_sortir").state == "off"   # avant 19 h
    # 19:00 : notification + à sortir
    freezer.move_to(datetime(2026, 11, 17, 19, 0, 5, tzinfo=TZ))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert hass.states.get("binary_sensor.poubelle_jaune_a_sortir").state == "on"
    assert len(notif) == 1 and "Poubelle Jaune" in notif[0].data["message"], [c.data for c in notif]
    action = notif[0].data["data"]["actions"][0]["action"]
    # bouton « C'est fait »
    hass.bus.async_fire("mobile_app_notification_action", {"action": action})
    await hass.async_block_till_done()
    assert hass.states.get("switch.poubelle_jaune_sortie").state == "on"
    assert hass.states.get("sensor.poubelle_jaune_prochaine_collecte").attributes["etat"] == "sortie"
    assert hass.states.get("binary_sensor.poubelle_jaune_a_sortir").state == "off"
    # relance : rien car sortie
    freezer.move_to(datetime(2026, 11, 17, 21, 30, 5, tzinfo=TZ))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert len([c for c in notif if c.data.get("message") != "clear_notification"]) == 1
    # jour de collecte après 12 h : collecte suivante, sortie remise à zéro
    freezer.move_to(datetime(2026, 11, 18, 12, 1, 5, tzinfo=TZ))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.poubelle_jaune_prochaine_collecte").state == "2026-11-25"
    assert hass.states.get("switch.poubelle_jaune_sortie").state == "off"
    # aperçu
    m = hass.config_entries.async_get_entry(entry.entry_id).runtime_data
    assert (await m.async_preview({"name": "x", "source": "rule", "rule": {"type": "monthly", "nth": 1, "weekday": 0}}))[0] == "2026-12-07"
    # suppression d'une poubelle : entités retirées
    await save(m.bins[:2])
    assert hass.states.get("sensor.verre_prochaine_collecte") is None
    assert hass.states.get("sensor.poubelle_jaune_prochaine_collecte") is not None


async def test_config_flow(hass):
    hass.states.async_set("calendar.poubelle_verte", "off", {"friendly_name": "Poubelle Verte"})
    r = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    assert r["type"] == "form"
    r = await hass.config_entries.flow.async_configure(r["flow_id"], {"import_calendars": [], "detect_rules": True})
    assert r["type"] == "create_entry"
    r = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    assert r["type"] == "abort"


async def test_websocket(hass, hass_ws_client):
    entry = MockConfigEntry(domain=DOMAIN, data={"import_calendars": []})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "holm_bins/save", "bins": [{"name": "Poubelle Bleue", "rule": {"type": "weekly", "weekdays": [0, 3]}}], "settings": {"time": "20:00"}})
    res = await ws.receive_json()
    assert res["success"], res
    await hass.async_block_till_done()
    await ws.send_json({"id": 2, "type": "holm_bins/get"})
    res = (await ws.receive_json())["result"]
    assert res["bins"][0]["id"] == "poubelle_bleue" and res["settings"]["time"] == "20:00"
    assert hass.states.get("sensor.poubelle_bleue_prochaine_collecte") is not None
    await ws.send_json({"id": 3, "type": "holm_bins/preview", "bin": res["bins"][0]})
    assert len((await ws.receive_json())["result"]["dates"]) == 6
    await ws.send_json({"id": 4, "type": "holm_bins/out", "bin": "poubelle_bleue", "out": True})
    assert (await ws.receive_json())["success"]
    await hass.async_block_till_done()
    assert hass.states.get("switch.poubelle_bleue_sortie").state == "on"


async def test_import_calendar(hass, freezer):
    await hass.config.async_set_time_zone("Europe/Paris")
    freezer.move_to(datetime(2026, 11, 15, 12, 0, tzinfo=TZ))
    cal = MockConfigEntry(domain="local_calendar", data={"calendar_name": "Poubelle Grise"}, options={})
    cal.add_to_hass(hass)
    assert await hass.config_entries.async_setup(cal.entry_id)
    await hass.async_block_till_done()
    cal_id = next(e for e in hass.states.async_entity_ids("calendar"))
    from datetime import date, timedelta
    d = date(2026, 9, 2)
    while d < date(2027, 3, 1):
        await hass.services.async_call("calendar", "create_event", {"entity_id": cal_id, "summary": "Ramassage", "start_date": d.isoformat(), "end_date": (d + timedelta(days=1)).isoformat()}, blocking=True)
        d += timedelta(days=14)
    entry = MockConfigEntry(domain=DOMAIN, data={"import_calendars": [cal_id], "detect_rules": True})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    b = entry.runtime_data.bins[0]
    assert b["source"] == "rule" and b["rule"]["interval"] == 2 and b["rule"]["weekdays"] == [2], b
    assert b["color"] == "#78828c"
    assert hass.states.get(f"sensor.{b['id']}_prochaine_collecte").state == "2026-11-25"
