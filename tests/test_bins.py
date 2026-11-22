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


async def test_camera_check(hass, freezer):
    from homeassistant.core import SupportsResponse
    calls = {"snap": [], "ai": []}

    async def snap(call):
        calls["snap"].append(call.data)

    async def gen(call):
        calls["ai"].append(call.data)
        return {"conversation_id": "x", "data": {"poubelle_jaune": True, "poubelle_verte": False}}
    hass.services.async_register("camera", "snapshot", snap)
    hass.services.async_register("ai_task", "generate_data", gen, supports_response=SupportsResponse.ONLY)
    notif = async_mock_service(hass, "notify", "mobile_app_test")
    entry = await _setup(hass, freezer, datetime(2026, 11, 17, 19, 30, tzinfo=TZ))
    m = entry.runtime_data
    await m.async_replace([
        {"name": "Poubelle Jaune", "rule": {"type": "weekly", "weekdays": [2]}, "notify": False},
        {"name": "Poubelle Verte", "rule": {"type": "weekly", "weekdays": [2]}, "notify": False, "image": "/local/v.png"},
    ], {"targets": ["mobile_app_test"], "camera": "camera.porte", "camera_time": "20:00", "camera_alert": True})
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    m = hass.config_entries.async_get_entry(entry.entry_id).runtime_data
    assert hass.states.get("sensor.poubelle_verte_prochaine_collecte").attributes["image"] == "/local/v.png"
    events = []
    hass.bus.async_listen("holm_bins_verification", lambda e: events.append(e.data))
    freezer.move_to(datetime(2026, 11, 17, 20, 0, 5, tzinfo=TZ))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert calls["snap"] and calls["ai"], calls
    assert set(calls["ai"][0]["structure"]) == {"poubelle_jaune", "poubelle_verte"}
    assert hass.states.get("switch.poubelle_jaune_sortie").state == "on"
    assert hass.states.get("switch.poubelle_verte_sortie").state == "off"
    alerts = [c for c in notif if "Poubelle Verte" in c.data.get("message", "")]
    assert alerts and alerts[0].data["data"]["image"].startswith("/local/holm_bins/"), [c.data for c in notif]
    assert events and events[0]["missing"] == ["poubelle_verte"]
    # test manuel : rien n'est marqué, pas d'alerte
    n = len(notif)
    r = await m.async_camera_check(force=True)
    assert r["missing"] == ["poubelle_verte"] and len(notif) == n


async def test_shared_calendar_keyword(hass, freezer):
    """#4 : un seul calendrier pour plusieurs poubelles, chacune filtrée par un mot-clé du nom de l'événement."""
    from datetime import date, timedelta
    await hass.config.async_set_time_zone("Europe/Paris")
    freezer.move_to(datetime(2026, 11, 15, 12, 0, tzinfo=TZ))
    cal = MockConfigEntry(domain="local_calendar", data={"calendar_name": "Collectes"}, options={})
    cal.add_to_hass(hass)
    assert await hass.config_entries.async_setup(cal.entry_id)
    await hass.async_block_till_done()
    cal_id = next(e for e in hass.states.async_entity_ids("calendar"))
    for d, s in ((date(2026, 11, 17), "Ordures ménagères"), (date(2026, 11, 19), "Tri sélectif"), (date(2026, 11, 24), "Ordures ménagères"),
                 (date(2026, 11, 26), "TRI sélectif"), (date(2026, 11, 20), "Visite Patrimoine")):
        await hass.services.async_call("calendar", "create_event", {"entity_id": cal_id, "summary": s, "start_date": d.isoformat(), "end_date": (d + timedelta(days=1)).isoformat()}, blocking=True)
    entry = MockConfigEntry(domain=DOMAIN, data={"import_calendars": []})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    m = entry.runtime_data
    await m.async_replace([
        {"name": "Ordures", "source": "calendar", "calendar": cal_id, "keyword": "ordures"},
        {"name": "Tri", "source": "calendar", "calendar": cal_id, "keyword": "tri, recyclage"},
        {"name": "Tout", "source": "calendar", "calendar": cal_id},
    ], None)
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    m = hass.config_entries.async_get_entry(entry.entry_id).runtime_data
    assert [d.isoformat() for d in m.dates["ordures"][:2]] == ["2026-11-17", "2026-11-24"]
    assert [d.isoformat() for d in m.dates["tri"][:2]] == ["2026-11-19", "2026-11-26"]   # « Patrimoine » ne compte pas pour « tri »
    assert len(m.dates["tout"]) == 5
    assert "Tri sélectif" in m.calendar_names(cal_id)
    assert await m.async_preview({"name": "x", "source": "calendar", "calendar": cal_id, "keyword": "Ordures"}) == ["2026-11-17", "2026-11-24"]


async def test_custom_notification_text(hass, freezer):
    """#3 : texte de notification personnalisé, modèle Home Assistant (variables et input_text)."""
    notif = async_mock_service(hass, "notify", "mobile_app_test")
    hass.states.async_set("input_text.msg_poubelles", "Sortez {} !")
    entry = await _setup(hass, freezer, datetime(2026, 11, 17, 18, 58, tzinfo=TZ))
    m = entry.runtime_data
    await m.async_replace([{"name": "Jaune", "rule": {"type": "weekly", "weekdays": [2]}}],
                          {"targets": ["mobile_app_test"], "time": "19:00", "reminder": "21:30",
                           "text_eve": "{{ states('input_text.msg_poubelles') | replace('{}', poubelles) }} ({{ date }})",
                           "text_reminder": "{{ oops(",
                           "title_notif": "🗑️ Maison · {{ poubelles }}", "title_reminder": "  "})
    await m.async_apply()
    freezer.move_to(datetime(2026, 11, 17, 19, 0, 5, tzinfo=TZ))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert notif[-1].data["message"] == "Sortez Jaune ! (mercredi 18/11)", notif[-1].data
    assert notif[-1].data["title"] == "🗑️ Maison · Jaune"   # #7 : titre personnalisé
    freezer.move_to(datetime(2026, 11, 17, 21, 30, 5, tzinfo=TZ))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert notif[-1].data["message"] == "Pas encore sortie : Jaune.", notif[-1].data   # modèle invalide : texte par défaut
    assert notif[-1].data["title"] == "⏰ Rappel poubelles"   # titre vide : titre par défaut
    assert await m.async_test_notification() == 1
    assert notif[-1].data["message"].startswith("Sortez Jaune !")
    assert notif[-1].data["title"] == "🗑️ Maison · Jaune"


async def test_ws_save_then_test(hass, freezer, hass_ws_client):
    """#5 : « Envoyer une notification de test » enregistre puis teste, sans tomber sur l'intégration en cours de rechargement."""
    notif = async_mock_service(hass, "notify", "mobile_app_test")
    entry = await _setup(hass, freezer, datetime.now(TZ))   # heure réelle : le jeton d'accès de test doit rester valide
    ws = await hass_ws_client(hass)
    bins = [{"name": "Jaune", "rule": {"type": "weekly", "weekdays": [2]}}]
    await ws.send_json({"id": 1, "type": "holm_bins/save", "bins": bins, "settings": {"targets": ["mobile_app_test"]}})
    r = await ws.receive_json()
    assert r["success"] and r["result"]["reloaded"] is True   # poubelle ajoutée : rechargement, terminé avant la réponse
    await ws.send_json({"id": 2, "type": "holm_bins/test"})
    r = await ws.receive_json()
    assert r["success"] and r["result"]["sent"] == 1, r
    saved = r and hass.config_entries.async_get_entry(entry.entry_id).runtime_data.bins
    # simple réglage (couleur, heure) : pas de rechargement, appliqué sur place
    await ws.send_json({"id": 3, "type": "holm_bins/save", "bins": [{**saved[0], "color": "#43a047"}], "settings": {"targets": ["mobile_app_test"], "time": "18:00"}})
    r = await ws.receive_json()
    assert r["success"] and r["result"]["reloaded"] is False
    await ws.send_json({"id": 4, "type": "holm_bins/test"})
    r = await ws.receive_json()
    assert r["success"] and r["result"]["sent"] == 1
    await hass.async_block_till_done()
    assert hass.states.get("sensor.jaune_prochaine_collecte").attributes["couleur"] == "#43a047"
    assert len(notif) == 2
