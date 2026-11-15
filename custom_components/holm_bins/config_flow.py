"""Installation : une seule entrée ; reprise facultative de calendriers existants (une poubelle par calendrier).
Tout le reste (poubelles, récurrences, rappels, animations) se règle ensuite depuis la carte."""
from __future__ import annotations

import voluptuous as vol

from homeassistant.config_entries import ConfigFlow
from homeassistant.helpers import selector

from .const import CONF_DETECT, CONF_IMPORT, DOMAIN, NAME

KEYWORDS = ("poubelle", "dechet", "ordure", "collecte", "recyclage", "trash", "bin", "waste", "garbage", "muell", "abfall", "basura", "rifiuti", "afval")


class HolmBinsConfigFlow(ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        if user_input is not None:
            return self.async_create_entry(title=NAME, data={CONF_IMPORT: user_input.get(CONF_IMPORT) or [],
                                                             CONF_DETECT: user_input.get(CONF_DETECT, True)})
        found = [e for e in self.hass.states.async_entity_ids("calendar") if any(k in e for k in KEYWORDS)]
        schema = vol.Schema({
            vol.Optional(CONF_IMPORT, default=found): selector.EntitySelector(selector.EntitySelectorConfig(domain="calendar", multiple=True)),
            vol.Optional(CONF_DETECT, default=True): selector.BooleanSelector(),
        })
        return self.async_show_form(step_id="user", data_schema=schema, description_placeholders={"count": str(len(found))})
