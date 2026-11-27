# Changelog

## 1.1.6 - 2026-11-27

### Fixes
- Idle states use the theme's secondary text colour (`--secondary-text-color`), like every ha-* card.

## 1.1.5 - 2026-11-24

### Maintenance
- The card source is split into ES modules: `src/` (entry `src/index.js`), cut at its sections, with the translations in one file per language (`i18n/<lang>.js`). `scripts/bundle.mjs` concatenates them back, in their original order, into the same single file and per-language files as before; the tests evaluate that bundle.

## 1.1.4 - 2026-11-22

### Performance
- Card picker: the previews are back (`preview: true`), and light. Each card's preview is drawn only once it scrolls into view of Home Assistant's card picker, which otherwise builds the preview of every card at once: until then it holds Home Assistant's state (no render, no history request, no animation). On a dashboard or in the card editor the card is drawn as before.

## 1.1.3 - 2026-11-22

### Performance
- Card picker: the cards no longer ask Home Assistant for a live preview (`preview: false` in `window.customCards`). The picker drew every card at once (history requests, animations), which made the list slow to open; it now shows each card's description instead.

## 1.1.2 - 2026-11-20

### Fixes
- The status pill's pending fit is dropped when the card leaves the page (another view, a conditional card hidden).
- A UPS sensor found by its device class (no translation key) whose state arrives after the registries is now picked up then, not only at the next registry change.

### Performance
- The card is patched in place on every update instead of rewriting its whole shadow DOM: the illustration's animations (power flow, LED, gauge) no longer restart and the hover stays when a value changes; the status pill is fitted once `<ha-card>` has rendered.

## 1.1.1 - 2026-11-18

### Fixes
- Illustrated header: `auto` now follows the Home Assistant theme alone — a light theme keeps the day picture after sunset, a dark theme still shows the night one.

## 1.1.0 - 2026-11-17

### Features
- Illustrated header on both cards (90 px): the name and the state (with the runtime left on battery, else the charge) on a technical room wall, the card's animated UPS drawn big at the right standing on a 10 px concrete floor strip, and a round badge with the UPS icon in the state color (green on mains, blue charging, orange on battery, red when low, overloaded or offline, grey when unknown) carrying the integration's logo. The picture follows the UPS state (power flow, plug cut off with a spark, gauge filling or draining, blinking LED, shaking on overload).
- Night version of the illustration when `sun.sun` is below the horizon or with Home Assistant's dark theme (even while the sun is up), forced with `illustration_theme: day | night`; `illustration: false` brings back the classic header. Both options are in the visual editor of both cards.
- The status pill, in the state color (it opens the state entity), is placed by measurement in every header (illustrated or classic, full and mini card) and every language: on the title row right after the name only when the whole name and its whole label fit there, otherwise on its own line under the subtitle (cut to one line); only its dot when the banner has no room left above its ground strip, and on a card of 200 px or less. The mini card's detail button sits in the banner's top-right corner, in the frosted style of the other cards, the picture stepping aside for it.
- On the mini card, the scene steps a little further left: its cable tray no longer runs into the corner expand / collapse button.
- No repeated charge: where the body shows the battery charge and runtime (full card, expanded mini card), the illustrated header's subtitle tells the manufacturer and model instead of repeating them; the compact mini card keeps the runtime on battery, else the charge.

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
