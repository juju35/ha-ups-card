// ---------------------------------------------------------------------------
// Visual editors (ha-form)
// ---------------------------------------------------------------------------
import { DEFAULTS, DEFAULT_COLLAPSED, ENTITY_KEYS, SECTIONS } from "./sources.js";
import { lang, t } from "./helpers.js";
import { listDevices } from "./registry-based-resolution.js";
import { sameDeps } from "./styles.js";
import { UpsCard } from "./cards.js";

export const LANGUAGES = [
  ["en", "English"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["es", "Español"],
  ["it", "Italiano"],
  ["nl", "Nederlands"],
  ["pt", "Português (Portugal)"],
  ["pl", "Polski"],
  ["sr", "Српски"],
  ["sr-Latn", "Srpski (latinica)"],
  ["ro", "Română"],
  ["da", "Dansk"],
  ["sv", "Svenska"],
  ["bg", "Български"],
  ["ru", "Русский"],
  ["uk", "Українська"],
  ["hu", "Magyar"],
  ["sk", "Slovenčina"],
  ["cs", "Čeština"],
  ["sl", "Slovenščina"],
  ["lv", "Latviešu"],
  ["el", "Ελληνικά"],
];

export class UpsEditorBase extends HTMLElement {
  // [name, default]
  static get toggles() {
    return [
      ["show_title", true],
      ["show_subtitle", true],
      ["show_alerts", true],
      ["illustration", true],
    ];
  }

  static extraFields() {
    return [];
  }

  static get defaults() {
    return { illustration_theme: "auto" };
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _schema() {
    const tr = (k) => t(this._hass, this._config, k);
    return [
      { name: "device", selector: { select: { mode: "dropdown", options: [{ value: "", label: tr("device_none") }, ...listDevices(this._hass)] } } },
      { name: "title", selector: { text: {} } },
      { type: "grid", name: "", schema: this.constructor.toggles.map(([name]) => ({ name, selector: { boolean: {} } })) },
      {
        name: "illustration_theme",
        selector: { select: { mode: "dropdown", options: ["auto", "day", "night"].map((value) => ({ value, label: tr(`theme_${value}`) })) } },
      },
      ...this.constructor.extraFields(tr),
      {
        type: "expandable",
        name: "entities",
        title: tr("entities"),
        icon: "mdi:format-list-bulleted",
        schema: ENTITY_KEYS.map(([name, domain]) => ({ name, selector: { entity: { domain } } })),
      },
      {
        name: "language",
        selector: { select: { mode: "dropdown", options: [{ value: "", label: tr("lang_auto") }, ...LANGUAGES.map(([value, label]) => ({ value, label }))] } },
      },
    ];
  }

  _label(name) {
    const k = ENTITY_KEYS.some(([n]) => n === name) ? `e_${name}` : name;
    return t(this._hass, this._config, k);
  }

  _render() {
    if (!this._hass || !this._config) return;
    const toggles = this.constructor.toggles;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => this._label(s.name);
      this._form.computeHelper = (s) => (s.name === "zoom" ? t(this._hass, this._config, "zoom_helper") : s.name === "device" ? t(this._hass, this._config, "device_helper") : undefined);
      this._form.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        this._config = cleanConfig(ev.detail.value, { ...Object.fromEntries(toggles), ...this.constructor.defaults });
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    const data = { ...this.constructor.defaults, ...this._config, entities: { ...this._config.entities } };
    for (const [name, def] of toggles) if (data[name] === undefined) data[name] = def;
    if (data.device === undefined && !Object.keys(data.entities).length) data.device = UpsCard.getStubConfig(this._hass).device ?? "";
    this._form.hass = this._hass;
    const h = this._hass;
    const dataDeps = [this._config, h.entities, h.devices];
    if (!sameDeps(this._dataDeps, dataDeps)) {
      this._dataDeps = dataDeps;
      this._form.data = data;
    }
    const deps = [lang(h, this._config), h.entities, h.devices];
    if (!sameDeps(this._schemaDeps, deps)) {
      this._schemaDeps = deps;
      this._form.schema = this._schema();
    }
  }
}

// Keeps the YAML minimal: drops empty values and options left at their default.
export const cleanConfig = (value, defaults) => {
  const config = { ...value };
  for (let [k, v] of Object.entries(config)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      v = config[k] = { ...v };
      for (const [sk, sv] of Object.entries(v)) if (sv === "" || sv === undefined || sv === null) delete v[sk];
      if (!Object.keys(v).length) delete config[k];
    } else if (v === "" || v === undefined || v === null || (k in defaults && JSON.stringify(v) === JSON.stringify(defaults[k]))) delete config[k];
  }
  return config;
};

export class UpsCardEditor extends UpsEditorBase {
  static get toggles() {
    return [...UpsEditorBase.toggles, ["show_power", true], ["show_battery", true], ["show_outages", true]];
  }

  static get defaults() {
    return { ...UpsEditorBase.defaults, collapsed: DEFAULT_COLLAPSED, ...DEFAULTS };
  }

  static extraFields(tr) {
    const number = (name, min, max, unit) => ({ name, selector: { number: { min, max, mode: "box", ...(unit ? { unit_of_measurement: unit } : {}) } } });
    return [
      {
        name: "collapsed",
        selector: { select: { multiple: true, mode: "list", options: SECTIONS.map((value) => ({ value, label: tr(`section_${value}`) })) } },
      },
      number("history_days", 1, 365, tr("unit_days")),
      number("max_outages", 1, 50),
      number("low_runtime", 1, 240, "min"),
      number("battery_life", 1, 15, tr("unit_years")),
      { name: "battery_replaced", selector: { date: {} } },
    ];
  }
}

// The options of the full card, which its detailed view shows, and the zoom button.
export class UpsMiniCardEditor extends UpsCardEditor {
  static get toggles() {
    return [...UpsCardEditor.toggles, ["zoom", true]];
  }
}
