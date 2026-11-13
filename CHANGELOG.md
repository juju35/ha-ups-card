# Changelog

## 1.0.2 - 2026-11-14

### Fixes
- Mini card visual editor: it now offers the full card's options that its detailed view uses (`show_power`, `show_battery`, `show_outages`, `collapsed`, `history_days`, `max_outages`, `battery_life`, `battery_replaced`), which could only be set in YAML.

## 1.0.1 - 2026-11-13

### Fixes
- Folding back on a tap elsewhere now works on iOS (Safari and the companion app): a tap on something that is not clickable sent no click to the page, so the detailed view of the mini card and the unfolded sections stayed open. The press and the release are caught instead; a slider dragged out of the card and a scroll do not fold anything.
- Leaving the card (another dashboard view, a conditional card hidden) brings it back in its default state.
- Clicks lost under an update: Home Assistant updates the card several times a second, and an update that rewrote the card between the press and the release replaced the element pressed, so that the click landed on the card itself and did nothing. The card is no longer rewritten while a press is in progress; the pending update is drawn at the click, or right after the release.
- Focus ring after a mouse click: the focus was put back on the clicked element after each update, which drew the focus ring. It is now kept across updates only for the keyboard (and in a text field).

## 1.0.0 - 2026-11-13

### Features
- **UPS Card** (`custom:ups-card`): state of the UPS (on mains, charging, on battery, low battery, overload, bypass, calibration, battery test, forced shutdown, offline) as a colored chip and header icon, with a drawn UPS animated by its state; battery charge, runtime left, load and power; power section (input and output voltage, real power against the nominal power, load, apparent power, frequency, temperature); battery section (charge, runtime, battery voltage and temperature, installation date, replacement date, self-test result); outage history read from the Home Assistant history (count, time on battery, longest outage and the latest outages, one going on included), plus the transfers counted by apcupsd and the reason of the last one.
- Alerts: on battery (for how long, runtime left), low battery, overload, high load, battery to replace (UPS flag or replacement date reached), no communication, UPS output off, no battery, UPS alarm, forced shutdown.
- **UPS Mini Card** (`custom:ups-mini-card`): state, battery, runtime, load and the main alert, with a detail button that switches to the full card and back.
- Sources: **Network UPS Tools** (`nut`) and **APC UPS Daemon** (`apcupsd`) found through the Home Assistant registries, whatever the entity ids or language; **generic sensors** with the `entities` option, which also replaces any entity of an integration.
- Visual editor for both cards, collapsible sections, Sections view sizes, light and dark themes, `prefers-reduced-motion`, 22 languages (English in the bundle, the others loaded on demand).
