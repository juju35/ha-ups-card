import assert from "node:assert/strict";
import { test } from "node:test";
import { charging, devices, entities, genericEntities, historyFor, lowBattery, NOW, onBattery, overload, states } from "../scripts/mock-states.mjs";
import { load } from "./load.mjs";

const uc = load();
const DAY = 86400e3;

// Mock states shifted so that NOW is now: the cards read Date.now().
const shift = Date.now() - NOW;
const moved = (st) =>
  Object.fromEntries(
    Object.entries(st).map(([id, s]) => [
      id,
      { ...s, last_changed: new Date(Date.parse(s.last_changed) + shift).toISOString(), last_updated: new Date(Date.parse(s.last_updated) + shift).toISOString() },
    ]),
  );
const withOverrides = (o = {}) => moved({ ...states, ...Object.fromEntries(Object.entries(o).map(([id, v]) => [id, { ...states[id], ...v }])) });

const makeHass = (st = moved(states), extra = {}) => {
  const ws = [];
  return {
    ws,
    entities,
    devices,
    states: st,
    language: "en",
    callService() {},
    callWS: async (msg) => {
      ws.push(msg);
      // The history of the states given (shifted back to the mock clock), an outage going on included.
      const back = Object.fromEntries(Object.entries(st).map(([id, v]) => [id, { ...v, last_changed: new Date(Date.parse(v.last_changed) - shift).toISOString() }]));
      const h = historyFor(msg.entity_ids[0], back)[msg.entity_ids[0]];
      return { [msg.entity_ids[0]]: h.map((p) => ({ ...p, lu: p.lu + shift / 1000 })) };
    },
    ...extra,
  };
};

const newCard = (config = {}, hass = makeHass(), Card = uc.UpsCard) => {
  const card = new Card();
  card.setConfig({ device: "eaton", ...config });
  card.hass = hass;
  return card;
};
const html = (card) => card.shadowRoot.innerHTML;
const click = (card, dataset, extra = []) => {
  const el = { dataset };
  card._onClick({ composedPath: () => [el, ...extra], stopPropagation() {} });
};
const flush = () => new Promise((r) => setTimeout(r, 0));

test("NUT statuses, their readable form, apcupsd statuses and plain words are understood", () => {
  const cases = {
    OL: "online",
    "OL CHRG": "charging",
    "OB DISCHRG": "on_battery",
    "OB DISCHRG LB": "low_battery",
    "OL OVER": "overload",
    "OL BYPASS": "bypass",
    "OL CAL": "calibrating",
    "OL TEST": "test",
    "FSD OB LB": "shutdown",
    OFF: "offline",
    "Online, Battery Charging": "charging",
    "On Battery, Battery Discharging": "on_battery",
    "Online, Overloaded": "overload",
    ONLINE: "online",
    ONBATT: "on_battery",
    "ONBATT LOWBATT": "low_battery",
    COMMLOST: "offline",
    "SHUTTING DOWN": "shutdown",
    "ONLINE REPLACEBATT": "online",
    "on battery": "on_battery",
    charging: "charging",
    discharging: "unknown",
    "": "unknown",
  };
  for (const [raw, key] of Object.entries(cases)) assert.equal(uc.parseStatus(raw).key, key, raw);
  // A calibration or a battery test on battery is not an outage; NUT OFF is the output off, even on the mains.
  const more = {
    "OB DISCHRG CAL": "calibrating",
    "OB TEST": "test",
    "OL OFF": "offline",
    "OB DISCHRG OVER": "overload",
    "Online, Battery Needs Replacement": "online",
    "On Battery, Battery Discharging, Low Battery, Forced Shutdown": "shutdown",
    "Online, Battery Testing": "test",
    "ONBATT LOWBATT SHUTTING DOWN": "shutdown",
    "ONLINE NOBATT": "online",
  };
  for (const [raw, key] of Object.entries(more)) assert.equal(uc.parseStatus(raw).key, key, raw);
  assert.ok(uc.parseStatus("OL OFF").flags.has("off"));
  assert.ok(!uc.parseStatus("COMMLOST").flags.has("off"));
  assert.ok(uc.parseStatus("OL ALARM").flags.has("alarm"));
  assert.ok(uc.parseStatus("ONLINE NOBATT").flags.has("nobatt"));
  assert.ok(uc.parseStatus("OB DISCHRG OVER").onBattery);
  assert.ok(uc.parseStatus("OL RB").flags.has("replace"));
  assert.ok(uc.parseStatus("ONLINE REPLACEBATT").flags.has("replace"));
  assert.ok(uc.parseStatus("OL TRIM").flags.has("trim"));
  assert.equal(uc.parseStatus("OL BOOST").key, "online");
  for (const k of uc.STATES) assert.ok(uc.STATE_CLASS[k], k);
});

test("the UPS devices of NUT and apcupsd are found through the registries, other devices are skipped", () => {
  const list = uc.resolve(makeHass());
  assert.deepEqual(
    JSON.parse(JSON.stringify(list.map((d) => [d.name, d.source]))),
    [
      ["Office UPS", "nut"],
      ["Rack UPS", "apcupsd"],
    ],
  );
  const [nut, apc] = list;
  assert.equal(nut.entities.status, "sensor.onduleur_bureau_etat_brut");
  assert.equal(nut.entities.status_display, "sensor.onduleur_bureau_etat");
  assert.equal(nut.entities.runtime, "sensor.onduleur_bureau_autonomie");
  // ups.power has no translation_key: found by its device class.
  assert.equal(nut.entities.apparent_power, "sensor.onduleur_bureau_puissance_apparente");
  // apcupsd: the battery charge has no translation_key either, and online_status is the binary sensor, not the flag sensor.
  assert.equal(apc.entities.battery, "sensor.onduleur_baie_batterie");
  assert.equal(apc.entities.online, "binary_sensor.onduleur_baie_en_ligne");
  assert.equal(apc.entities.input_voltage, "sensor.onduleur_baie_tension_ligne");
  assert.equal(uc.findDevice(makeHass(), { device: "Rack UPS" }).dev.id, "apc");
  assert.equal(uc.findDevice(makeHass(), {}).dev.id, "eaton");
  assert.equal(uc.findDevice(makeHass(), { device: "nope" }).error, "unknown_device");
});

test("durations, values and battery dates are read whatever their unit and format", () => {
  assert.equal(uc.seconds({ state: "41.5", attributes: { unit_of_measurement: "min" } }), 2490);
  assert.equal(uc.seconds({ state: "1980", attributes: { unit_of_measurement: "s" } }), 1980);
  assert.equal(uc.seconds({ state: "unavailable", attributes: {} }), null);
  assert.equal(uc.fmtDuration(42, "en"), "42 sec");
  assert.equal(uc.fmtDuration(252, "en"), "4 min, 12 sec".replace(",", ""));
  assert.equal(uc.fmtDuration(1980, "en"), "33 min");
  assert.equal(uc.fmtDuration(4320, "en"), "1 hr 12 min");
  assert.equal(uc.fmtValue(23.4, "%", "en"), "23 %");
  assert.equal(uc.fmtValue(231.4, "V", "en"), "231 V");
  assert.equal(uc.fmtValue(13.62, "V", "en"), "13.6 V");
  assert.equal(uc.fmtValue(118.4, "W", "en"), "118 W");
  const d = (y, m, day) => Date.UTC(y, m - 1, day);
  assert.equal(uc.parseDate("2024/03/14"), d(2024, 3, 14));
  assert.equal(uc.parseDate("2021-09-02"), d(2021, 9, 2));
  assert.equal(uc.parseDate("09/02/21"), d(2021, 9, 2));
  assert.equal(uc.parseDate("09/02/2021"), d(2021, 9, 2));
  assert.equal(uc.parseDate("02.09.2021"), d(2021, 9, 2));
  assert.equal(uc.parseDate("2021-02-30"), null);
  assert.equal(uc.parseDate("soon"), null);
});

test("outages are the stretches on battery of the status history, newest first, the one going on included", () => {
  const battery = (s) => (s === "?" ? null : s.startsWith("OB"));
  const pts = [
    { state: "OL", t: 0 },
    { state: "OB", t: 10e3 },
    { state: "?", t: 15e3 },
    { state: "OL", t: 40e3 },
    { state: "OB", t: 100e3 },
    { state: "OB LB", t: 120e3 },
  ];
  assert.deepEqual(JSON.parse(JSON.stringify(uc.outagesOf(pts, battery, 160e3))), [
    { start: 100e3, end: null, duration: 60 },
    { start: 10e3, end: 40e3, duration: 30 },
  ]);
  assert.equal(uc.outagesOf(pts, battery, 160e3, 31).length, 1, "short outages left out");
});

test("the outage history reads every status on battery, overload and forced shutdown included, and nothing else", () => {
  const b = uc.statusOnBattery;
  for (const s of ["OB DISCHRG", "OB DISCHRG LB", "FSD OB LB", "OB OVER", "ONBATT", "ONBATT LOWBATT SHUTTING DOWN", "On Battery, Battery Discharging"]) assert.equal(b(s), true, s);
  for (const s of ["OL", "OL CHRG", "OL OVER", "OL BYPASS", "ONLINE", "OB CAL", "OB TEST", "OL CAL", "charging"]) assert.equal(b(s), false, s);
  for (const s of ["COMMLOST", "unavailable", "unknown", "", "OFF", "SHUTTING DOWN"]) assert.equal(b(s), null, s);
  // A forced shutdown and a lost communication in the middle of an outage do not split it.
  const pts = ["OL", "OB DISCHRG", "OB DISCHRG LB", "FSD OB LB", "COMMLOST", "OL CHRG"].map((state, i) => ({ state, t: i * 60e3 }));
  assert.deepEqual(JSON.parse(JSON.stringify(uc.outagesOf(pts, b, 600e3))), [{ start: 60e3, end: 300e3, duration: 240 }]);
});

test("the full card shows the state, battery, runtime, load, sections and the outage history", async () => {
  const hass = makeHass();
  const card = newCard({}, hass);
  assert.match(html(card), /On mains/);
  assert.match(html(card), /class="ups s-online ok"/);
  assert.match(html(card), />100<small>%<\/small>/);
  assert.match(html(card), /33 min left/);
  assert.match(html(card), /Load <b>23 %<\/b> · <b>118 W<\/b>/);
  assert.match(html(card), /EATON 5E 850i/);
  assert.match(html(card), /Loading history…/);
  await flush();
  assert.equal(hass.ws.length, 1);
  assert.equal(hass.ws[0].type, "history/history_during_period");
  assert.deepEqual([...hass.ws[0].entity_ids], ["sensor.onduleur_bureau_etat_brut"]);
  assert.match(html(card), /<span class="count">\(4\)<\/span>/);
  assert.match(html(card), /48 min/, "time on battery");
  assert.match(html(card), /3 min 12 sec/);
  // A state update of an unrelated entity does not fetch the history again.
  card.hass = { ...hass, states: { ...hass.states, "light.x": { state: "on", attributes: {} } } };
  await flush();
  assert.equal(hass.ws.length, 1);
});

test("apcupsd: charging while not full after the mains came back, estimated power, transfers and replacement due", async () => {
  const st = moved(states);
  st["sensor.onduleur_baie_batterie"] = { ...st["sensor.onduleur_baie_batterie"], state: "88" };
  // Back from battery 3 days ago: a battery that settled at 88 % is not charging any more.
  const settled = newCard({ device: "apc" }, makeHass(st));
  await flush();
  assert.match(html(settled), /On mains/);
  st["sensor.onduleur_baie_retour_secteur"] = { ...st["sensor.onduleur_baie_retour_secteur"], state: new Date(Date.now() - 30 * 60e3).toISOString() };
  const card = newCard({ device: "apc" }, makeHass(st));
  await flush();
  const h = html(card);
  assert.match(h, /Charging/);
  assert.match(h, /≈ 167 W/, "31 % of 540 W");
  assert.match(h, /Transfers/);
  assert.match(h, /Low line voltage/);
  assert.match(h, /42 min left/, "41.5 minutes");
  // Installed 2021-09-02, 4 years of life by default: overdue.
  assert.match(h, /Battery replacement due Sep 2, 2025/);
  const later = newCard({ device: "apc", battery_life: 10 }, makeHass(st));
  assert.doesNotMatch(html(later), /replacement due/);
});

test("on battery: orange state, alert with the time on battery and the runtime, ongoing outage", async () => {
  const card = newCard({}, makeHass(withOverrides(onBattery)));
  await flush();
  const h = html(card);
  assert.match(h, /class="chip clickable warn"/);
  assert.match(h, /On battery for 4 min · 25 min left/);
  assert.match(h, /class="ups s-on_battery warn"/);
  assert.match(h, /ongoing/);
  assert.match(h, /class="spark"/);
});

test("on battery: the time on battery counts from the start of the outage, not from the last change of the status text", async () => {
  const st = withOverrides(onBattery);
  const hass = makeHass(st);
  const card = newCard({}, hass);
  await flush();
  // The low battery flag comes 3 minutes later: same outage, still "for 4 min" (the history keeps its start).
  const s = "sensor.onduleur_bureau_etat_brut";
  card.hass = { ...hass, states: { ...hass.states, [s]: { ...hass.states[s], state: "OB DISCHRG LB", last_changed: new Date(Date.now() - 60e3).toISOString() } } };
  assert.match(html(card), /On battery for 4 min/);
  // On battery and overloaded: both alerts.
  const over = html(newCard({}, makeHass(withOverrides({ ...onBattery, [s]: { state: "OB DISCHRG OVER" } }))));
  assert.match(over, /Overload: reduce the connected load/);
  assert.match(over, /On battery for/);
  // A calibration on battery is not an outage.
  const cal = html(newCard({}, makeHass(withOverrides({ ...onBattery, [s]: { state: "OB DISCHRG CAL" } }))));
  assert.match(cal, /Calibrating/);
  assert.doesNotMatch(cal, /On battery for/);
});

test("NUT OFF, ALARM and apcupsd NOBATT get their own alerts", () => {
  const s = "sensor.onduleur_bureau_etat_brut";
  assert.match(html(newCard({}, makeHass(withOverrides({ [s]: { state: "OL OFF" } })))), /UPS output off/);
  assert.doesNotMatch(html(newCard({}, makeHass(withOverrides({ [s]: { state: "OL OFF" } })))), /No communication/);
  assert.match(html(newCard({}, makeHass(withOverrides({ [s]: { state: "OL ALARM" } })))), /The UPS reports an alarm/);
  assert.match(html(newCard({ device: "apc" }, makeHass(withOverrides({ "sensor.onduleur_baie_etat": { state: "ONLINE NOBATT" } })))), /No battery detected/);
});

test("the apparent power is estimated from the load and the VA rating when the UPS reports no power", () => {
  const st = moved(states);
  for (const id of ["sensor.onduleur_bureau_puissance", "sensor.onduleur_bureau_puissance_nominale", "sensor.onduleur_bureau_puissance_apparente"]) delete st[id];
  st["sensor.onduleur_bureau_va_nominale"] = { entity_id: "sensor.onduleur_bureau_va_nominale", state: "850", attributes: { unit_of_measurement: "VA" }, last_changed: st["sensor.onduleur_bureau_charge"].last_changed };
  const hass = makeHass(st, { entities: { ...entities, "sensor.onduleur_bureau_va_nominale": { entity_id: "sensor.onduleur_bureau_va_nominale", device_id: "eaton", platform: "nut", translation_key: "ups_power_nominal" } } });
  const h = html(newCard({}, hass));
  assert.match(h, /Load <b>23 %<\/b> · <b>≈ 196 VA<\/b>/, "23 % of 850 VA");
  assert.match(h, /≈ 196 VA <small>\/ 850 VA<\/small>/);
});

test("low battery, overload and charging get their own state, colors and alerts", () => {
  const low = html(newCard({}, makeHass(withOverrides(lowBattery))));
  assert.match(low, /Low battery/);
  assert.match(low, /Battery low: shutdown imminent/);
  assert.match(low, /s-low_battery crit/);
  const over = html(newCard({}, makeHass(withOverrides(overload))));
  assert.match(over, /Overload: reduce the connected load/);
  assert.match(over, /s-overload crit/);
  assert.doesNotMatch(over, /High load/, "the overload alert is enough");
  const chg = html(newCard({}, makeHass(withOverrides(charging))));
  assert.match(chg, /s-charging active/);
  assert.match(chg, /class="bar on fill"|class="bar fill on"|bar on fill/);
  // On battery with a runtime under the low_runtime option: low battery too.
  const st = withOverrides(onBattery);
  assert.match(html(newCard({ low_runtime: 30 }, makeHass(st))), /Battery low: shutdown imminent/);
});

test("an unavailable status reads offline, and show_alerts: false hides the alerts", () => {
  const st = moved(states);
  st["sensor.onduleur_bureau_etat_brut"] = { ...st["sensor.onduleur_bureau_etat_brut"], state: "unavailable" };
  st["sensor.onduleur_bureau_etat"] = { ...st["sensor.onduleur_bureau_etat"], state: "unavailable" };
  assert.match(html(newCard({}, makeHass(st))), /No communication with the UPS/);
  assert.doesNotMatch(html(newCard({ show_alerts: false }, makeHass(st))), /class="alerts"/);
});

test("generic sensors make a UPS of their own, and the mains binary sensor tells the state without a status", () => {
  const st = moved(states);
  const card = newCard({ device: undefined, title: "Garage UPS", entities: genericEntities }, makeHass(st));
  const h = html(card);
  assert.match(h, /Garage UPS/);
  assert.match(h, /Charging/, "76 % on the mains");
  assert.match(h, /25 min left/);
  assert.doesNotMatch(h, /class="logo"/, "no integration logo");
  st["binary_sensor.secteur"] = { entity_id: "binary_sensor.secteur", state: "off", attributes: {}, last_changed: new Date(Date.now() - 120e3).toISOString() };
  const bs = newCard({ device: undefined, entities: { online: "binary_sensor.secteur", battery: genericEntities.battery } }, makeHass(st));
  assert.match(html(bs), /On battery for 2 min/);
  // Entities on top of an integration device replace its own.
  const over = newCard({ entities: { load: genericEntities.load } }, makeHass(st));
  assert.match(html(over), /Load <b>12 %<\/b>/);
});

test("no UPS at all, and a bad entities option, give a clear message", () => {
  const hass = { ...makeHass(), entities: {}, devices: {} };
  assert.match(html(newCard({ device: undefined }, hass)), /No UPS found/);
  assert.throws(() => new uc.UpsCard().setConfig({ entities: ["sensor.x"] }), /entities must be a map/);
});

test("sections fold and unfold, a click elsewhere brings the defaults back", () => {
  const card = newCard({ collapsed: ["battery"] });
  card.connectedCallback();
  assert.match(html(card), /data-section="battery" aria-expanded="false"/);
  assert.doesNotMatch(html(card), /Battery voltage/);
  click(card, { action: "toggle_section", section: "battery" });
  assert.match(html(card), /Battery voltage/);
  card._outside.tap({ composedPath: () => [{ tagName: "HA-MORE-INFO-DIALOG" }] });
  assert.match(html(card), /Battery voltage/, "a click in a dialog keeps it");
  card._outside.tap({ composedPath: () => [{ tagName: "DIV" }] });
  assert.doesNotMatch(html(card), /Battery voltage/);
  card.disconnectedCallback();
});

test("a click on a value opens its more-info dialog", () => {
  const card = newCard();
  click(card, { entity: "sensor.onduleur_bureau_autonomie" });
  assert.equal(card.events.at(-1).type, "hass-more-info");
  assert.equal(card.events.at(-1).detail.entityId, "sensor.onduleur_bureau_autonomie");
});

test("the mini card is compact, its detail button switches to the full card and a click elsewhere back", async () => {
  const hass = makeHass();
  const card = newCard({}, hass, uc.UpsMiniCard);
  card.connectedCallback();
  assert.match(html(card), /class="zoom"/);
  assert.doesNotMatch(html(card), /class="section-title/);
  await flush();
  assert.equal(hass.ws.length, 0, "no history for the compact view");
  click(card, { action: "zoom" });
  assert.match(html(card), /class="section-title/);
  assert.deepEqual({ ...card.getGridOptions() }, { columns: 12, min_columns: 6, rows: "auto" });
  await flush();
  assert.equal(hass.ws.length, 1);
  card._unzoom.tap({ composedPath: () => [{ tagName: "DIV" }] });
  assert.doesNotMatch(html(card), /class="section-title/);
  assert.doesNotMatch(html(newCard({ zoom: false }, hass, uc.UpsMiniCard)), /class="zoom"/);
  card.disconnectedCallback();
});

test("every clickable element can be reached and used from the keyboard", () => {
  const card = newCard({}, makeHass(withOverrides(onBattery)));
  const tags = html(card).match(/<[a-z-]+\b[^>]*\bdata-(?:entity|action)="[^"]*"[^>]*>/g) || [];
  assert.ok(tags.length > 10);
  for (const tag of tags) {
    if (tag.startsWith("<button")) continue;
    assert.match(tag, /\brole="button"/, tag);
    assert.match(tag, /\btabindex="0"/, tag);
  }
});

test("the editors keep the YAML minimal and list the UPS devices", () => {
  assert.deepEqual(JSON.parse(JSON.stringify(uc.cleanConfig({ type: "custom:ups-card", device: "eaton", show_title: true, history_days: 30, entities: { status: "" }, title: "" }, { show_title: true, history_days: 30 }))), {
    type: "custom:ups-card",
    device: "eaton",
  });
  const ed = new uc.UpsCardEditor();
  ed.setConfig({ type: "custom:ups-card" });
  ed.hass = makeHass();
  const schema = ed._form.schema;
  const device = schema.find((s) => s.name === "device");
  assert.deepEqual(
    [...device.selector.select.options.map((o) => o.value)],
    ["", "eaton", "apc"],
  );
  assert.equal(ed._form.data.device, "eaton");
  assert.ok(schema.some((s) => s.name === "entities" && s.type === "expandable"));
  assert.ok(schema.some((s) => s.name === "collapsed"));
  const mini = new uc.UpsMiniCardEditor();
  mini.setConfig({ type: "custom:ups-mini-card" });
  mini.hass = makeHass();
  assert.ok(mini._form.schema.find((s) => s.type === "grid").schema.some((s) => s.name === "zoom"));
  assert.equal(ed._form.computeLabel({ name: "status" }), "Status");
  assert.equal(uc.UpsCard.getStubConfig(makeHass()).device, "eaton");
});

test("every language has every English text, and the card follows the language option", () => {
  const en = Object.keys(uc.STRINGS.en).sort();
  assert.equal(Object.keys(uc.STRINGS).length, 22);
  for (const [l, table] of Object.entries(uc.STRINGS)) assert.deepEqual([...Object.keys(table).sort()], [...en], l);
  assert.match(html(newCard({ language: "fr" })), /Sur secteur/);
  assert.equal(uc.lang({ language: "pt-BR" }, {}), "pt");
  assert.equal(uc.intlLocale({ language: "pt" }, {}), "pt-PT");
  assert.equal(uc.lang({ language: "sr-Latn" }, {}), "sr-Latn");
});

test("the picture draws the battery gauge from the charge and animates only the active states", () => {
  const bars = (svg) => (svg.match(/class="bar on/g) || []).length;
  assert.equal(bars(uc.upsSvg("online", 100)), 4);
  assert.equal(bars(uc.upsSvg("online", 30)), 2);
  assert.equal(bars(uc.upsSvg("online", null)), 0);
  assert.match(uc.upsSvg("online", 100), /flow run/);
  assert.doesNotMatch(uc.upsSvg("offline", 100), /flow run|blink/);
  assert.match(uc.upsSvg("on_battery", 80), /led blink/);
  assert.match(uc.upsSvg("on_battery", 80), /class="wave"/);
  assert.doesNotMatch(uc.upsSvg("on_battery", 80), /flow run in/, "no flow from the wall");
});

test("battery_replaced overrides the UPS battery date", () => {
  const ten = new Date(Date.now() - 10 * DAY).toISOString().slice(0, 10);
  const h = html(newCard({ battery_replaced: ten }));
  const year = new Date(Date.now() - 10 * DAY).getUTCFullYear();
  assert.match(h, new RegExp(`Battery installed</span></div><div class="v">[A-Z][a-z]{2} \\d{1,2}, ${year}`));
});

test("folding: a press in the card does not fold; leaving the page brings the defaults and the compact view back", () => {
  const card = newCard({ collapsed: ["battery"] });
  card.connectedCallback();
  click(card, { action: "toggle_section", section: "battery" });
  card._outside.tap({ composedPath: () => [card] });
  assert.match(html(card), /Battery voltage/, "a slider pressed in the card and released outside does not fold it");
  card.disconnectedCallback();
  card.connectedCallback();
  assert.doesNotMatch(html(card), /Battery voltage/);
  card.disconnectedCallback();
  const mini = newCard({}, makeHass(), uc.UpsMiniCard);
  mini.connectedCallback();
  click(mini, { action: "zoom" });
  assert.match(html(mini), /class="section-title/);
  mini.disconnectedCallback();
  mini.connectedCallback();
  assert.doesNotMatch(html(mini), /class="section-title/);
  mini.disconnectedCallback();
});
