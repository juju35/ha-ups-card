// ---------------------------------------------------------------------------
// Registry-based resolution
// ---------------------------------------------------------------------------
import { SOURCES } from "./sources.js";
import { t } from "./helpers.js";

export const _cache = new WeakMap();

/**
 * UPS devices of the supported integrations, from hass.entities / hass.devices:
 * [{ id, name, source, manufacturer, model, entities: { key: entity_id } }], in the order of the device names.
 */
export const resolve = (hass) => {
  if (!hass?.entities || !hass.devices) return null;
  const cached = _cache.get(hass.entities);
  // An entity read by its device class (no translation key) whose state had not come yet: resolved again once it has.
  if (cached && cached.devices === hass.devices && !cached.waiting.some((id) => hass.states?.[id])) return cached.list;
  const byDevice = new Map();
  const waiting = [];
  for (const e of Object.values(hass.entities)) {
    const src = SOURCES[e.platform];
    if (!src || !e.device_id || e.hidden) continue;
    const domain = e.entity_id.split(".")[0];
    if (domain !== "sensor" && domain !== "binary_sensor") continue;
    const tk = e.translation_key;
    const st = hass.states?.[e.entity_id];
    const dc = st?.attributes?.device_class;
    if (!tk && !st) waiting.push(e.entity_id);
    const key =
      (domain === "binary_sensor" ? src.keys[`bs:${tk}`] : tk && !src.keys[`bs:${tk}`] ? src.keys[tk] : undefined) ??
      (!tk && dc ? src.keys[`dc:${dc}`] : undefined);
    if (!key) continue;
    const item = byDevice.get(e.device_id) || { source: e.platform, entities: {} };
    item.entities[key] ??= e.entity_id;
    byDevice.set(e.device_id, item);
  }
  const list = [];
  for (const [id, item] of byDevice) {
    const d = hass.devices[id];
    if (!d) continue;
    list.push({ id, name: d.name_by_user || d.name || id, manufacturer: d.manufacturer || "", model: d.model || "", ...item });
  }
  list.sort((a, b) => a.name.localeCompare(b.name));
  _cache.set(hass.entities, { devices: hass.devices, list, waiting });
  return list;
};

export const listDevices = (hass) => (resolve(hass) || []).map((d) => ({ value: d.id, label: `${d.name} (${SOURCES[d.source].name})` }));

// The UPS to show: the integration device given by `device` (id or name) or the first one, with the `entities` of the
// config on top; with entities only and no device, a generic UPS made of them.
export const findDevice = (hass, config) => {
  const own = Object.fromEntries(Object.entries(config?.entities || {}).filter(([, v]) => typeof v === "string" && v));
  const list = resolve(hass);
  const generic = () => ({ id: null, name: config.title || t(hass, config, "generic_name"), source: "generic", manufacturer: "", model: "", entities: own });
  if (!list) return Object.keys(own).length ? { dev: generic() } : { error: "no_registry" };
  if (config?.device) {
    const dev = list.find((d) => d.id === config.device || d.name === config.device);
    if (!dev) return { error: "unknown_device" };
    return { dev: { ...dev, entities: { ...dev.entities, ...own } } };
  }
  if (Object.keys(own).length) return { dev: generic() };
  if (!list.length) return { error: "no_device" };
  return { dev: list[0] };
};
