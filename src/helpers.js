// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
import { STRINGS } from "./i18n/strings.js";

export const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const lang = (hass, config) => {
  const l = config?.language || (hass && (hass.locale?.language || hass.language)) || "en";
  return STRINGS[l] ? l : STRINGS[l.split("-")[0]] ? l.split("-")[0] : "en";
};

// Locale for Intl: the card's language option, else Home Assistant's full locale (keeps its region, e.g. pt-BR,
// de-CH) when its base matches the card language, else that language. A bare "pt" (European Portuguese for Home
// Assistant) becomes "pt-PT", otherwise Intl formats it the Brazilian way.
export const intlLocale = (hass, config) => {
  const l = lang(hass, config);
  const src = config?.language || (hass && (hass.locale?.language || hass.language)) || "";
  const out = src && src.split("-")[0] === l.split("-")[0] ? src : l;
  return out === "pt" ? "pt-PT" : out;
};

export const t = (hass, config, key, vars = {}) =>
  String(STRINGS[lang(hass, config)][key] ?? STRINGS.en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

export const valid = (s) => !!s && !["unknown", "unavailable", ""].includes(s.state);

export const num = (s) => {
  if (!valid(s)) return null;
  const v = parseFloat(s.state);
  return Number.isFinite(v) ? v : null;
};

export const clampInt = (v, min, max, def) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && v !== "" && v !== null ? Math.min(max, Math.max(min, n)) : def;
};

// Duration sensor → seconds, whatever its unit (NUT reports seconds, apcupsd minutes).
export const seconds = (s) => {
  const v = num(s);
  if (v === null) return null;
  const u = String(s.attributes?.unit_of_measurement ?? "s").toLowerCase();
  if (u === "min" || u.startsWith("minute")) return v * 60;
  if (u === "h" || u.startsWith("hour")) return v * 3600;
  if (u === "d" || u.startsWith("day")) return v * 86400;
  if (u === "ms") return v / 1000;
  return v;
};

export const UNIT_FMT = {};
export const fmtUnit = (v, unit, locale) =>
  (UNIT_FMT[`${locale}|${unit}`] ??= new Intl.NumberFormat(locale, { style: "unit", unit, unitDisplay: "short" })).format(v);

// Duration in seconds, with the units of the language: "42 s", "4 min 12 s", "38 min", "1 h 12 min", "14 h", "3 d".
export const fmtDuration = (sec, locale) => {
  if (sec === null || sec === undefined || !Number.isFinite(sec)) return "—";
  const s = Math.max(0, Math.round(sec));
  if (s < 60) return fmtUnit(s, "second", locale);
  if (s < 600) {
    const r = s % 60;
    const m = fmtUnit(Math.floor(s / 60), "minute", locale);
    return r ? `${m} ${fmtUnit(r, "second", locale)}` : m;
  }
  const min = Math.round(s / 60);
  if (min < 60) return fmtUnit(min, "minute", locale);
  if (min < 600) {
    const r = min % 60;
    const h = fmtUnit(Math.floor(min / 60), "hour", locale);
    return r ? `${h} ${fmtUnit(r, "minute", locale)}` : h;
  }
  if (s < 172800) return fmtUnit(Math.round(s / 3600), "hour", locale);
  return fmtUnit(Math.round(s / 86400), "day", locale);
};

export const fmtNum = (v, digits, locale) =>
  v === null || v === undefined ? "—" : Number(v).toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: digits });

// A measurement with its unit: percentages are whole numbers, voltages above 100 V too.
export const fmtValue = (v, unit, locale, digits = 1) => {
  if (v === null || v === undefined) return "—";
  const u = unit === undefined || unit === null ? "" : String(unit);
  const d = u === "%" ? 0 : u === "W" || u === "VA" ? 0 : u === "V" && Math.abs(v) >= 100 ? 0 : digits;
  return `${fmtNum(u === "%" ? Math.round(v) : v, d, locale)}${u ? ` ${u}` : ""}`;
};

// Dates of the battery: "2023-05-12", "2023/05/12", "05/12/23" or "05/12/2023" (month first, as NUT and apcupsd
// write them), "12.05.2023", an ISO timestamp. Midnight UTC of that day, or null.
export const parseDate = (raw) => {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  let y;
  let mo;
  let d;
  if (m) [, y, mo, d] = m;
  else if ((m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/))) [, mo, d, y] = m;
  else if ((m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/))) [, d, mo, y] = m;
  else return null;
  y = Number(y);
  if (y < 100) y += 2000;
  const ms = Date.UTC(y, Number(mo) - 1, Number(d));
  const date = new Date(ms);
  return date.getUTCMonth() === Number(mo) - 1 && date.getUTCDate() === Number(d) ? ms : null;
};

export const addYears = (ms, years) => {
  const d = new Date(ms);
  d.setUTCFullYear(d.getUTCFullYear() + years);
  return d.getTime();
};

export const DATE_FMT = {};
export const fmtDate = (ms, locale) =>
  (DATE_FMT[`${locale}|d`] ??= new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })).format(ms);
// Start of an outage: day, month and time, in Home Assistant's time zone when the profile asks for the server's.
export const fmtDateTime = (ms, locale, timeZone) =>
  (DATE_FMT[`${locale}|${timeZone}`] ??= new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...(timeZone ? { timeZone } : {}),
  })).format(ms);

export const svgIcon = (path, cls = "") => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
