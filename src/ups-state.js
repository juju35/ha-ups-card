// ---------------------------------------------------------------------------
// UPS state
// ---------------------------------------------------------------------------

// The UPS state, from a NUT status ("OL CHRG", "OB DISCHRG LB"), its readable form ("Online, Battery Charging"), an
// apcupsd status ("ONLINE", "ONBATT LOWBATT", "COMMLOST") or the words of another sensor ("on battery", "charging").
// Returns { key, flags, onBattery, online, deliberate }: key one of STATES, flags among replace, trim, boost, alarm,
// low, off (NUT OFF: the output is off), nobatt; onBattery / online as the status says them, whatever the key (an
// overload or a forced shutdown on battery is still on battery); deliberate for a calibration or a battery test, which
// run on battery on purpose.
export const STATES = ["online", "charging", "on_battery", "low_battery", "overload", "bypass", "calibrating", "test", "shutdown", "offline", "unknown"];
export const parseStatus = (raw) => {
  const s = ` ${String(raw ?? "").toUpperCase().replace(/[_,;]+/g, " ").replace(/\s+/g, " ").trim()} `;
  const has = (re) => re.test(s);
  const flags = new Set();
  if (has(/ RB | REPLACEBATT | REPLACE/)) flags.add("replace");
  if (has(/ TRIM| TRIMMING/)) flags.add("trim");
  if (has(/ BOOST/)) flags.add("boost");
  if (has(/ ALARM /)) flags.add("alarm");
  if (has(/ NOBATT | NO BATTERY /)) flags.add("nobatt");
  // NUT OFF (readable form "Offline"): the UPS does not feed its outlets, which is not a lost communication.
  if (has(/ OFF /)) flags.add("off");
  const onBattery = has(/ OB | ONBATT | ON BATTERY /);
  const online = has(/ OL | ONLINE | ON LINE | ON MAINS | MAINS /);
  const low = has(/ LB | LOWBATT | LOW BATTERY /);
  if (low) flags.add("low");
  const calibrating = has(/ CAL | CALIBRATION | CALIBRATING /);
  const testing = has(/ TEST | TESTING /);
  let key = "unknown";
  if (has(/ FSD | SHUTTING DOWN | FORCED SHUTDOWN | SHUTDOWN /)) key = "shutdown";
  else if (has(/ OVER | OVERLOAD/)) key = "overload";
  else if (flags.has("off") || (has(/ OFFLINE | COMMLOST | NOCOMM | UNAVAILABLE /) && !online && !onBattery)) key = "offline";
  // A runtime calibration or a battery test runs on battery on purpose (NUT "OB CAL", "OB TEST"): not an outage.
  else if (calibrating) key = "calibrating";
  else if (testing) key = "test";
  else if (onBattery) key = low ? "low_battery" : "on_battery";
  else if (has(/ BYPASS /)) key = "bypass";
  else if (has(/ CHRG | CHARGING /)) key = "charging";
  else if (online || has(/ TRIM| BOOST/)) key = "online";
  return { key, flags, onBattery, online, deliberate: calibrating || testing };
};

// How a status reads for the outage history: true on battery (an overload or a forced shutdown on battery included,
// a calibration or a battery test left out), false on the mains, null when it tells nothing (no communication,
// unknown words): the outage then goes on until a status says the mains is back.
export const statusOnBattery = (raw) => {
  if (["unavailable", "unknown", ""].includes(raw)) return null;
  const p = parseStatus(raw);
  if (p.onBattery || isOnBattery(p.key)) return !p.deliberate;
  if (p.online) return false;
  return p.key === "unknown" || p.key === "offline" || p.key === "shutdown" ? null : false;
};

// State → color class of the dot, chip, header icon and picture.
export const STATE_CLASS = {
  online: "ok",
  charging: "active",
  on_battery: "warn",
  low_battery: "crit",
  overload: "crit",
  bypass: "warn",
  calibrating: "active",
  test: "active",
  shutdown: "crit",
  offline: "crit",
  unknown: "idle",
};
// Every state has its color class.
for (const k of STATES) STATE_CLASS[k] ??= "idle";
export const isOnBattery = (key) => key === "on_battery" || key === "low_battery";

// Outages from a status history: points [{ state, t }] in time order (t in ms), `battery(state)` telling the ones on
// battery. Returns [{ start, end, duration }] newest first, `end` null for one still going on at `now`. Outages
// shorter than `minSeconds` are left out (a self-test switching to battery for a few seconds, say).
export const outagesOf = (points, battery, now, minSeconds = 0) => {
  const out = [];
  let start = null;
  for (const p of points) {
    if (!Number.isFinite(p.t)) continue;
    const b = battery(p.state);
    if (b === null) continue;
    if (b && start === null) start = p.t;
    else if (!b && start !== null) {
      out.push({ start, end: p.t, duration: (p.t - start) / 1000 });
      start = null;
    }
  }
  if (start !== null) out.push({ start, end: null, duration: (now - start) / 1000 });
  return out.filter((o) => o.end === null || o.duration >= minSeconds).reverse();
};
