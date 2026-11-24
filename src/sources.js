// ---------------------------------------------------------------------------
// Sources: the integrations the card reads, and how their entities map onto the card's keys
// ---------------------------------------------------------------------------
import { IMG_APC, IMG_NUT } from "./core.js";

// translation_key → card key. Entities without a translation_key are matched by their device class (`dc:`), binary
// sensors first by `bs:<translation_key>` (apcupsd has a sensor and a binary sensor named online_status).
export const SOURCES = {
  nut: {
    name: "Network UPS Tools",
    logo: IMG_NUT,
    site: "https://networkupstools.org/",
    keys: {
      ups_status: "status",
      ups_status_display: "status_display",
      battery_charge: "battery",
      battery_runtime: "runtime",
      ups_load: "load",
      input_voltage: "input_voltage",
      output_voltage: "output_voltage",
      ups_realpower: "power",
      ups_realpower_nominal: "power_nominal",
      ups_power_nominal: "apparent_power_nominal",
      ups_temperature: "temperature",
      battery_temperature: "battery_temperature",
      battery_voltage: "battery_voltage",
      input_frequency: "frequency",
      battery_date: "battery_date",
      battery_mfr_date: "battery_mfr_date",
      ups_test_result: "self_test",
      battery_charge_low: "battery_low",
      "dc:apparent_power": "apparent_power",
    },
  },
  apcupsd: {
    name: "APC UPS Daemon",
    logo: IMG_APC,
    site: "http://www.apcupsd.org/",
    keys: {
      status: "status",
      "bs:online_status": "online",
      "dc:battery": "battery",
      time_left: "runtime",
      load_capacity: "load",
      line_voltage: "input_voltage",
      output_voltage: "output_voltage",
      nominal_output_power: "power_nominal",
      nominal_apparent_power: "apparent_power_nominal",
      internal_temperature: "temperature",
      battery_voltage: "battery_voltage",
      line_frequency: "frequency",
      battery_replacement_date: "battery_date",
      manufacture_date: "battery_mfr_date",
      self_test_result: "self_test",
      last_transfer: "last_transfer",
      transfer_count: "transfers",
      time_on_battery: "time_on_battery",
      transfer_from_battery: "back_on_mains",
      total_time_on_battery: "total_time_on_battery",
      low_battery_signal: "battery_low",
    },
  },
};

// Keys that can be set by hand (generic sensors, or to replace what an integration gives), in the editor's order.
export const ENTITY_KEYS = [
  ["status", ["sensor"]],
  ["online", ["binary_sensor"]],
  ["battery", ["sensor"]],
  ["runtime", ["sensor"]],
  ["load", ["sensor"]],
  ["input_voltage", ["sensor"]],
  ["output_voltage", ["sensor"]],
  ["power", ["sensor"]],
  ["temperature", ["sensor"]],
  ["battery_voltage", ["sensor"]],
  ["frequency", ["sensor"]],
  ["battery_date", ["sensor", "input_datetime"]],
];

export const SECTIONS = ["power", "battery", "outages"];
export const DEFAULT_COLLAPSED = [];
export const DEFAULTS = { history_days: 30, max_outages: 5, battery_life: 4, low_runtime: 10 };
