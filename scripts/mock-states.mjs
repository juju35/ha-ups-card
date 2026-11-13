// Mock Home Assistant registries and states shaped like the Network UPS Tools integration (an Eaton 5E), the APC
// UPS Daemon integration (a Back-UPS) and a few generic sensors, used to render the screenshots and by the tests.
// Entity ids are in French on purpose (the cards never rely on them); the names shown are in English.
// Every time is relative to NOW, which the screenshot script freezes the page clock at: the captures never change
// from one day to the next.
export const NOW = Date.UTC(2026, 10, 10, 9, 30, 0);
export const states = {};
export const entities = {};
export const devices = {};

const iso = (ms) => new Date(ms).toISOString();
const MIN = 60e3;
const DAY = 86400e3;

const device = (id, name, manufacturer, model, domain) => (devices[id] = { id, name, manufacturer, model, identifiers: [[domain, id]], name_by_user: null });
const entity = (entity_id, device_id, platform, translation_key, state, attributes = {}, changed = NOW - 2 * DAY) => {
  entities[entity_id] = { entity_id, device_id, platform, translation_key: translation_key || null };
  states[entity_id] = { entity_id, state: String(state), attributes, last_changed: iso(changed), last_updated: iso(changed) };
};

// Network UPS Tools: Eaton 5E 850i
device("eaton", "Office UPS", "EATON", "5E 850i", "nut");
const nut = (id, tk, state, attributes) => entity(`sensor.onduleur_bureau_${id}`, "eaton", "nut", tk, state, attributes);
nut("etat_brut", "ups_status", "OL");
nut("etat", "ups_status_display", "Online");
nut("batterie", "battery_charge", 100, { unit_of_measurement: "%", device_class: "battery" });
nut("autonomie", "battery_runtime", 1980, { unit_of_measurement: "s", device_class: "duration" });
nut("charge", "ups_load", 23, { unit_of_measurement: "%" });
nut("tension_entree", "input_voltage", 231.4, { unit_of_measurement: "V", device_class: "voltage" });
nut("tension_sortie", "output_voltage", 230.1, { unit_of_measurement: "V", device_class: "voltage" });
nut("puissance", "ups_realpower", 118, { unit_of_measurement: "W", device_class: "power" });
nut("puissance_nominale", "ups_realpower_nominal", 480, { unit_of_measurement: "W", device_class: "power" });
nut("puissance_apparente", null, 142, { unit_of_measurement: "VA", device_class: "apparent_power" });
nut("tension_batterie", "battery_voltage", 13.6, { unit_of_measurement: "V", device_class: "voltage" });
nut("frequence", "input_frequency", 50, { unit_of_measurement: "Hz", device_class: "frequency" });
nut("date_batterie", "battery_date", "2024/03/14");
nut("autotest", "ups_test_result", "Done and passed");
nut("seuil_batterie", "battery_charge_low", 20, { unit_of_measurement: "%" });
nut("pilote", "ups_firmware", "02.08.0010");

// APC UPS Daemon: Back-UPS RS 900G
device("apc", "Rack UPS", "APC", "Back-UPS RS 900G", "apcupsd");
const apc = (id, tk, state, attributes, domain = "sensor") => entity(`${domain}.onduleur_baie_${id}`, "apc", "apcupsd", tk, state, attributes);
apc("etat", "status", "ONLINE");
apc("en_ligne", "online_status", "on", {}, "binary_sensor");
apc("drapeau", "online_status", "0x05000008");
apc("batterie", null, 100, { unit_of_measurement: "%", device_class: "battery" });
apc("autonomie", "time_left", 41.5, { unit_of_measurement: "min", device_class: "duration" });
apc("charge", "load_capacity", 31, { unit_of_measurement: "%" });
apc("tension_ligne", "line_voltage", 229, { unit_of_measurement: "V", device_class: "voltage" });
apc("tension_sortie", "output_voltage", 229, { unit_of_measurement: "V", device_class: "voltage" });
apc("puissance_nominale", "nominal_output_power", 540, { unit_of_measurement: "W", device_class: "power" });
apc("temperature", "internal_temperature", 29.5, { unit_of_measurement: "°C", device_class: "temperature" });
apc("tension_batterie", "battery_voltage", 27.2, { unit_of_measurement: "V", device_class: "voltage" });
apc("frequence", "line_frequency", 50, { unit_of_measurement: "Hz", device_class: "frequency" });
apc("date_batterie", "battery_replacement_date", "2021-09-02");
apc("autotest", "self_test_result", "OK");
apc("basculements", "transfer_count", 3);
apc("dernier_basculement", "last_transfer", "Low line voltage");
apc("temps_sur_batterie", "time_on_battery", 0, { unit_of_measurement: "s", device_class: "duration" });
// End of the last outage below (3 days ago, 95 s long).
apc("retour_secteur", "transfer_from_battery", iso(NOW - 3 * DAY - 5 * 60 * MIN + 95e3), { device_class: "timestamp" });

// A device of another integration, skipped by the cards.
device("plug", "Desk plug", "Shelly", "Plug S", "shelly");
entity("sensor.prise_bureau_puissance", "plug", "shelly", "power", 42, { unit_of_measurement: "W", device_class: "power" });

// Generic sensors (template, Modbus, SNMP…) of a UPS no integration knows.
const gen = (id, state, attributes) => {
  states[`sensor.onduleur_garage_${id}`] = { entity_id: `sensor.onduleur_garage_${id}`, state: String(state), attributes, last_changed: iso(NOW - DAY), last_updated: iso(NOW - DAY) };
};
gen("etat", "online", {});
// Back on the mains 40 minutes ago, after the outage below: the battery not full reads "Charging".
states["sensor.onduleur_garage_etat"].last_changed = states["sensor.onduleur_garage_etat"].last_updated = iso(NOW - 40 * MIN);
gen("batterie", 76, { unit_of_measurement: "%", device_class: "battery" });
gen("autonomie", 25, { unit_of_measurement: "min", device_class: "duration" });
gen("charge", 12, { unit_of_measurement: "%" });
gen("puissance", 64, { unit_of_measurement: "W", device_class: "power" });
export const genericEntities = {
  status: "sensor.onduleur_garage_etat",
  battery: "sensor.onduleur_garage_batterie",
  runtime: "sensor.onduleur_garage_autonomie",
  load: "sensor.onduleur_garage_charge",
  power: "sensor.onduleur_garage_puissance",
};

// Past outages of the last 30 days, per status entity: [start, duration in seconds, on-battery state, back state].
const OUTAGES = {
  "sensor.onduleur_bureau_etat_brut": [
    [NOW - 1 * DAY - 14 * 60 * MIN, 192, "OB DISCHRG", "OL CHRG"],
    [NOW - 8 * DAY - 2 * 60 * MIN, 42, "OB DISCHRG", "OL"],
    [NOW - 16 * DAY + 11 * 60 * MIN, 2280, "OB DISCHRG", "OL CHRG"],
    [NOW - 21 * DAY + 4 * 60 * MIN, 365, "OB DISCHRG", "OL CHRG"],
  ],
  "sensor.onduleur_garage_etat": [[NOW - 50 * MIN, 600, "on battery", "online"]],
  "sensor.onduleur_baie_etat": [
    [NOW - 3 * DAY - 5 * 60 * MIN, 95, "ONBATT", "ONLINE"],
    [NOW - 12 * DAY + 3 * 60 * MIN, 610, "ONBATT", "ONLINE"],
  ],
};

// The answer of history/history_during_period (minimal response: { s, lu } in seconds) for an entity, from its past
// outages and its current state: an outage going on shows as one.
export const historyFor = (id, st = states, start = NOW - 30 * DAY) => {
  const cur = st[id];
  const list = [{ s: (OUTAGES[id]?.[0]?.[3] ?? cur?.state ?? "unknown").split(" ")[0], lu: start / 1000 }];
  for (const [t, dur, on, off] of [...(OUTAGES[id] || [])].reverse()) {
    list.push({ s: on, lu: t / 1000 }, { s: off, lu: (t + dur * 1000) / 1000 });
  }
  if (cur && Date.parse(cur.last_changed) > (list.at(-1)?.lu ?? 0) * 1000) list.push({ s: cur.state, lu: Date.parse(cur.last_changed) / 1000 });
  return { [id]: list };
};

// State overrides of the animated states, on the NUT UPS.
const S = "sensor.onduleur_bureau_";
const at = (state, changed) => ({ state, last_changed: iso(changed), last_updated: iso(changed) });
export const charging = {
  [`${S}etat_brut`]: at("OL CHRG", NOW - 25 * MIN),
  [`${S}etat`]: at("Online, Battery Charging", NOW - 25 * MIN),
  [`${S}batterie`]: at("64", NOW - MIN),
  [`${S}autonomie`]: at("1210", NOW - MIN),
};
export const onBattery = {
  [`${S}etat_brut`]: at("OB DISCHRG", NOW - 4 * MIN),
  [`${S}etat`]: at("On Battery, Battery Discharging", NOW - 4 * MIN),
  [`${S}batterie`]: at("82", NOW - MIN),
  [`${S}autonomie`]: at("1500", NOW - MIN),
  [`${S}tension_entree`]: at("0", NOW - 4 * MIN),
};
export const lowBattery = {
  [`${S}etat_brut`]: at("OB DISCHRG LB", NOW - 27 * MIN),
  [`${S}etat`]: at("On Battery, Battery Discharging, Low Battery", NOW - 27 * MIN),
  [`${S}batterie`]: at("18", NOW - MIN),
  [`${S}autonomie`]: at("240", NOW - MIN),
  [`${S}tension_entree`]: at("0", NOW - 27 * MIN),
};
export const overload = {
  [`${S}etat_brut`]: at("OL OVER", NOW - 2 * MIN),
  [`${S}etat`]: at("Online, Overloaded", NOW - 2 * MIN),
  [`${S}charge`]: at("104", NOW - MIN),
  [`${S}puissance`]: at("498", NOW - MIN),
  [`${S}autonomie`]: at("410", NOW - MIN),
};
