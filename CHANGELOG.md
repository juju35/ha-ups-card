# Changelog

## 1.0.0 - 2026-11-13

### Features
- **UPS Card** (`custom:ups-card`): state of the UPS (on mains, charging, on battery, low battery, overload, bypass, calibration, battery test, forced shutdown, offline) as a colored chip and header icon, with a drawn UPS animated by its state; battery charge, runtime left, load and power; power section (input and output voltage, real power against the nominal power, load, apparent power, frequency, temperature); battery section (charge, runtime, battery voltage and temperature, installation date, replacement date, self-test result); outage history read from the Home Assistant history (count, time on battery, longest outage and the latest outages, one going on included), plus the transfers counted by apcupsd and the reason of the last one.
- Alerts: on battery (for how long, runtime left), low battery, overload, high load, battery to replace (UPS flag or replacement date reached), no communication, UPS output off, no battery, UPS alarm, forced shutdown.
- **UPS Mini Card** (`custom:ups-mini-card`): state, battery, runtime, load and the main alert, with a detail button that switches to the full card and back.
- Sources: **Network UPS Tools** (`nut`) and **APC UPS Daemon** (`apcupsd`) found through the Home Assistant registries, whatever the entity ids or language; **generic sensors** with the `entities` option, which also replaces any entity of an integration.
- Visual editor for both cards, collapsible sections, Sections view sizes, light and dark themes, `prefers-reduced-motion`, 22 languages (English in the bundle, the others loaded on demand).
