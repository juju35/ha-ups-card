// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------
import { ICONS } from "./icons.js";
import { DEFAULTS, DEFAULT_COLLAPSED, SOURCES } from "./sources.js";
import { addYears, clampInt, esc, fmtDate, fmtDateTime, fmtDuration, fmtNum, fmtValue, intlLocale, num, parseDate, seconds, svgIcon, t, valid } from "./helpers.js";
import { STATE_CLASS, isOnBattery, outagesOf, parseStatus, statusOnBattery } from "./ups-state.js";
import { findDevice, resolve } from "./registry-based-resolution.js";
import { PICTURE_STYLE, upsSvg } from "./drawn-ups.js";
import { BANNER_STYLE, isNight, upsScene } from "./illustrated-header.js";
import { BASE_STYLE, CHARGING_WINDOW_MS, FOCUS_SELECTOR, FULL_STYLE, HISTORY_REFRESH_MS, MINI_STYLE, focusKey, holdUnderPress, keepsFocus, morph, sameDeps, watchOutside } from "./styles.js";

export let _ucUid = 0;

export class UpsBase extends HTMLElement {
  constructor() {
    super();
    this._uid = ++_ucUid;
    this.attachShadow({ mode: "open" });
    this._html = "";
    holdUnderPress(this, () => this._update());
    this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
    // Enter / Space on an element with the button role acts as a click, as on a <button>.
    this.shadowRoot.addEventListener("keydown", (ev) => {
      if ((ev.key !== "Enter" && ev.key !== " ") || ev.target?.getAttribute?.("role") !== "button") return;
      ev.preventDefault();
      ev.target.click();
    });
  }

  // Home Assistant pushes a new hass on every state change of the whole instance: the card is only rebuilt when
  // something it shows changed (see _deps).
  set hass(hass) {
    this._hass = hass;
    const deps = this._deps();
    if (deps && sameDeps(this._lastDeps, deps)) return;
    this._lastDeps = deps;
    this._update();
  }

  get hass() {
    return this._hass;
  }

  // What a render reads from hass: registries, language, the states of the UPS entities and the relative times
  // (minute tick). null (no UPS found): always render.
  _deps() {
    const h = this._hass;
    if (!h || !this._config) return null;
    const { dev } = findDevice(h, this._config);
    if (!dev) return null;
    const ids = Object.values(dev.entities);
    return [h.entities, h.devices, h.language, h.locale, h.formatEntityState, h.themes?.darkMode, this._history, this._minute, ...ids.map((id) => h.states[id])];
  }

  connectedCallback() {
    // A click elsewhere on the page folds the sections back to their defaults.
    this._outside ??= watchOutside(this, () => {
      if (!this._toggled?.size) return;
      this._toggled = new Map();
      this._update();
    });
    this._outside.on();
    // A new width (or the web font loaded): the status pill is fitted again, in the next frame.
    if (typeof ResizeObserver === "function") {
      this._resize ??= new ResizeObserver((entries) => {
        const w = Math.round(entries.at(-1).contentRect.width);
        if (w === this._fitWidth) return;
        this._fitWidth = w;
        cancelAnimationFrame(this._fitFrame);
        this._fitFrame = requestAnimationFrame(() => this._fitPill());
      });
      this._resize.observe(this);
    }
    document.fonts?.ready?.then(() => this._fitPill());
    // Back on the page after leaving it: rendered again in its default state.
    if (this._hass && this._config) this._update();
    // "On battery for 4 minutes" moves on its own: re-checked every minute while the card is on the page.
    clearInterval(this._tick);
    this._tick = setInterval(() => {
      this._minute = Math.floor(Date.now() / 60000);
      if (this._hass) this.hass = this._hass;
    }, 60000);
  }

  disconnectedCallback() {
    clearInterval(this._tick);
    this._tick = null;
    this._outside?.off();
    this._resize?.disconnect();
    if (typeof cancelAnimationFrame === "function") cancelAnimationFrame(this._fitFrame);
    this._fitWidth = null;
    this._dropPress();
    // Left (another dashboard view, a conditional card hidden): back to the defaults, so that the card does not
    // come back unfolded.
    this._toggled = new Map();
  }

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Invalid configuration");
    if (config.entities !== undefined && (typeof config.entities !== "object" || Array.isArray(config.entities))) {
      throw new Error("entities must be a map of keys to entity ids");
    }
    this._config = { ...config };
    this.toggleAttribute?.("hide-title", config.show_title === false);
    this.toggleAttribute?.("hide-subtitle", config.show_subtitle === false);
    this._html = "";
    this._lastDeps = null;
    this._history = null;
    this._update();
  }

  // The status pill goes right after the title only when the whole title and the pill's whole label fit on that row;
  // otherwise it takes a line of its own under the subtitle (.titles.below, the subtitle cut to one line). In the
  // banner (where that line may run over the picture), when the titles still run below the top of the ground strip or
  // out of the banner, and in the classic header when the label does not fit even alone, the pill keeps its dot alone,
  // beside the title (.titles.dotonly). Measured in fractional pixels.
  _fitPill() {
    // A <ha-card> just created has not laid out its own shadow DOM yet: measured then, everything is 0 px wide and
    // the pill lands on the wrong line. Fitted once it has rendered.
    const haCard = this.shadowRoot?.querySelector?.("ha-card");
    if (haCard && haCard.hasUpdated === false) {
      this._pillWait ??= (haCard.updateComplete?.then ? haCard.updateComplete : new Promise((r) => requestAnimationFrame(r))).then(() => {
        this._pillWait = null;
        this._fitPill();
      });
      return;
    }
    for (const t of this.shadowRoot?.querySelectorAll?.(".titles") || []) {
      const row = t.querySelector(".trow");
      const chips = row ? [...row.querySelectorAll(":scope > .chip")] : [];
      if (!chips.length || !row.getBoundingClientRect) continue;
      t.classList.remove("below", "dotonly");
      const name = row.querySelector(":scope > .name");
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      const widths = chips.map((c) => c.getBoundingClientRect().width);
      let need = -gap;
      if (name && getComputedStyle(name).display !== "none") {
        name.style.flex = "none";
        need = name.getBoundingClientRect().width;
        name.style.flex = "";
      }
      for (const w of widths) need += gap + w;
      const room = row.getBoundingClientRect().width + 0.01;
      if (need <= room) continue;
      t.classList.add("below");
      const banner = t.closest(".banner");
      const cut = !banner && widths.some((w) => w > room);
      let out = false;
      if (banner) {
        const b = banner.getBoundingClientRect();
        const floor = b.bottom - (banner.querySelector(".ground")?.getBoundingClientRect().height ?? 10) + 0.5;
        out = [...t.querySelectorAll(".name, .sub, .chip")].some((e) => {
          const r = e.getBoundingClientRect();
          return r.height && (r.bottom > floor || r.top < b.top - 0.5 || r.right > b.right + 0.5);
        });
      }
      if (cut || out) t.classList.replace("below", "dotonly");
    }
  }

  _t(key, vars) {
    return t(this._hass, this._config, key, vars);
  }

  _locale() {
    return intlLocale(this._hass, this._config);
  }

  _s(id) {
    return id ? this._hass.states[id] : undefined;
  }

  _opt(name) {
    const c = this._config;
    const limits = { history_days: [1, 365], max_outages: [1, 50], battery_life: [1, 15], low_runtime: [1, 240] };
    const [min, max] = limits[name];
    return clampInt(c[name], min, max, DEFAULTS[name]);
  }

  _update() {
    if (!this._hass || !this._config) return;
    // Held under a press (see holdUnderPress), drawn after its click.
    if (this._pressing) {
      this._dirty = true;
      return;
    }
    this._dirty = false;
    const html = this._render();
    if (html !== this._html) {
      const kept = this._focusedSpot();
      this._html = html;
      morph(this.shadowRoot, html);
      this._fitPill();
      if (kept) this._restoreFocus(kept);
    }
    this._syncHistory();
  }

  // The focused element of the card, as what identifies it in the next render.
  _focusedSpot() {
    const el = this.shadowRoot.activeElement;
    if (!el?.dataset || !keepsFocus(this, el)) return null;
    const key = focusKey(el);
    if (!key) return null;
    const index = this._focusables(key).indexOf(el);
    return index < 0 ? null : { key, index };
  }

  _focusables(key) {
    return [...this.shadowRoot.querySelectorAll(FOCUS_SELECTOR)].filter((n) => focusKey(n) === key);
  }

  _restoreFocus({ key, index }) {
    this._focusables(key)[index]?.focus({ preventScroll: true });
  }

  _onClick(ev) {
    const path = ev.composedPath();
    const el = path.find((n) => n.dataset && (n.dataset.entity || n.dataset.action));
    if (!el) return;
    ev.stopPropagation();
    const { action, entity } = el.dataset;
    if (action === "zoom") return this._toggleZoom(ev);
    if (action === "toggle_section") {
      const key = el.dataset.section;
      this._toggled = new Map(this._toggled).set(key, !this._isCollapsed(key));
      return this._update();
    }
    if (entity) this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: entity }, bubbles: true, composed: true }));
  }

  _toggleZoom() {}

  _isCollapsed(key) {
    if (this._toggled?.has(key)) return this._toggled.get(key);
    const c = this._config.collapsed ?? DEFAULT_COLLAPSED;
    return (Array.isArray(c) ? c : [c]).includes(key);
  }

  // ---- State -------------------------------------------------------------

  // { key, flags, entity, since, text }: what the UPS is doing, from its status sensor, else the mains binary sensor.
  _state(dev) {
    const e = dev.entities;
    const status = this._s(e.status) || this._s(e.status_display);
    const online = this._s(e.online);
    let key = "unknown";
    let flags = new Set();
    let onBattery = false;
    let entity = e.status || e.status_display || e.online;
    let since = null;
    if (status) {
      since = Date.parse(status.last_changed);
      if (status.state === "unavailable") key = "offline";
      else ({ key, flags, onBattery } = parseStatus(status.state));
      // NUT gives the raw status and its readable form: the raw one is read first, the readable one when it says more.
      const display = e.status && this._s(e.status_display);
      if (key === "unknown" && valid(display)) ({ key, flags, onBattery } = parseStatus(display.state));
      // A calibration or a battery test runs on battery on purpose: no outage alert.
      if (key === "calibrating" || key === "test") onBattery = false;
    }
    if ((key === "unknown" || !status) && valid(online)) {
      key = online.state === "on" ? "online" : "on_battery";
      entity = e.online;
      since = Date.parse(online.last_changed);
    }
    const pct = num(this._s(e.battery));
    // apcupsd and generic sensors do not tell charging: a battery not full on the mains is charging only for a while
    // after the mains came back (a battery that settles at 97 % would read "Charging" forever otherwise).
    if (key === "online" && dev.source !== "nut" && pct !== null && pct < 99.5) {
      const back = this._backOnMains(dev, since);
      if (back !== null && Date.now() - back < CHARGING_WINDOW_MS) key = "charging";
    }
    // On battery, under the UPS's own low threshold (or 20 %) or the low runtime option: low battery.
    if (key === "on_battery") {
      const low = num(this._s(e.battery_low)) ?? 20;
      const rt = seconds(this._s(e.runtime));
      if ((pct !== null && pct <= low) || (rt !== null && rt <= this._opt("low_runtime") * 60) || flags.has("low")) key = "low_battery";
    }
    onBattery = onBattery || isOnBattery(key);
    // The start of the outage: apcupsd counts the time on battery itself, else the outage going on in the history;
    // the last change of the status text comes last ("OB DISCHRG" turning "OB DISCHRG LB" is the same outage).
    if (onBattery) {
      const tob = seconds(this._s(e.time_on_battery));
      const ongoing = this._history?.outages?.[0];
      if (tob) since = Date.now() - tob * 1000;
      else if (ongoing && ongoing.end === null) since = ongoing.start;
    }
    return { key, flags, onBattery, entity, since: Number.isFinite(since) ? since : null, text: this._t(`state_${key}`) };
  }

  // When the mains last came back (ms) or null: apcupsd's time of the last transfer from battery, else the end of the
  // latest outage of the history once loaded, else the last change of the status.
  _backOnMains(dev, statusChanged) {
    const back = this._s(dev.entities.back_on_mains);
    const t = valid(back) ? Date.parse(back.state) : Number.NaN;
    if (Number.isFinite(t)) return t;
    const outages = this._history?.outages;
    if (outages) return outages[0]?.end ?? null;
    return Number.isFinite(statusChanged) ? statusChanged : null;
  }

  _battery(dev) {
    const s = this._s(dev.entities.battery);
    const v = num(s);
    const low = num(this._s(dev.entities.battery_low)) ?? 20;
    return { id: dev.entities.battery, v, cls: v === null ? "idle" : v <= low ? "crit" : v <= 50 ? "warn" : "ok" };
  }

  _runtime(dev) {
    const s = this._s(dev.entities.runtime);
    const v = seconds(s);
    const low = this._opt("low_runtime") * 60;
    return { id: dev.entities.runtime, v, cls: v === null ? "idle" : v <= low ? "crit" : v <= 2 * low ? "warn" : "ok" };
  }

  _load(dev) {
    const v = num(this._s(dev.entities.load));
    return { id: dev.entities.load, v, cls: v === null ? "idle" : v >= 90 ? "crit" : v >= 75 ? "warn" : "ok" };
  }

  // Real power: the UPS's sensor, else the load times the nominal power (apcupsd, NUT without ups.realpower), marked "≈".
  _power(dev) {
    const e = dev.entities;
    const s = this._s(e.power);
    const v = num(s);
    if (v !== null) return { id: e.power, v, unit: s.attributes?.unit_of_measurement || "W", estimated: false };
    const load = num(this._s(e.load));
    const nominal = num(this._s(e.power_nominal));
    if (load !== null && nominal !== null) return { id: e.load, v: (load / 100) * nominal, unit: "W", estimated: true };
    return null;
  }

  // Apparent power: NUT's ups.power, else the load times the nominal apparent power (NUT ups.power.nominal, apcupsd
  // NOMAPNT), marked "≈" — many UPS only give a rating in VA.
  _apparent(dev) {
    const e = dev.entities;
    const s = this._s(e.apparent_power);
    const v = num(s);
    if (v !== null) return { id: e.apparent_power, v, unit: s.attributes?.unit_of_measurement || "VA", estimated: false };
    const load = num(this._s(e.load));
    const nominal = num(this._s(e.apparent_power_nominal));
    if (load !== null && nominal !== null) return { id: e.load, v: (load / 100) * nominal, unit: "VA", estimated: true };
    return null;
  }

  // { replaced, due, cls, id }: the date the battery was put in (option, the UPS's battery date, else its
  // manufacturing date) and when it should be replaced (`battery_life` years later).
  _batteryDate(dev) {
    const c = this._config;
    const e = dev.entities;
    let replaced = parseDate(c.battery_replaced);
    let id = null;
    if (replaced === null) {
      for (const k of ["battery_date", "battery_mfr_date"]) {
        const s = this._s(e[k]);
        const d = valid(s) ? parseDate(s.state) : null;
        if (d !== null) {
          replaced = d;
          id = e[k];
          break;
        }
      }
    }
    if (replaced === null) return null;
    const due = addYears(replaced, this._opt("battery_life"));
    const left = due - Date.now();
    return { replaced, due, id, cls: left <= 0 ? "crit" : left <= 90 * 86400e3 ? "warn" : "ok" };
  }

  // Alerts, worst first: [{ cls, text, entity }].
  _alerts(dev, st) {
    if (this._config.show_alerts === false) return [];
    const out = [];
    const L = this._locale();
    const rt = this._runtime(dev);
    if (st.key === "offline") out.push({ cls: "crit", text: this._t(st.flags.has("off") ? "alert_output_off" : "alert_offline"), entity: st.entity });
    if (st.key === "shutdown") out.push({ cls: "crit", text: this._t("alert_shutdown"), entity: st.entity });
    if (st.key === "overload") out.push({ cls: "crit", text: this._t("alert_overload"), entity: dev.entities.load || st.entity });
    if (st.flags.has("nobatt")) out.push({ cls: "crit", text: this._t("alert_no_battery"), entity: st.entity });
    if (st.onBattery) {
      const parts = [st.since ? this._t("alert_on_battery_for", { time: fmtDuration((Date.now() - st.since) / 1000, L) }) : this._t("alert_on_battery")];
      if (rt.v !== null) parts.push(this._t("runtime_left", { time: fmtDuration(rt.v, L) }));
      out.push({ cls: st.key === "low_battery" ? "crit" : "warn", text: parts.join(" · "), entity: st.entity });
      if (st.key === "low_battery") out.push({ cls: "crit", text: this._t("alert_low_battery"), entity: dev.entities.battery || st.entity });
    }
    if (st.flags.has("replace")) out.push({ cls: "crit", text: this._t("alert_replace"), entity: st.entity });
    else {
      const bd = this._batteryDate(dev);
      if (bd && bd.cls !== "ok") out.push({ cls: "warn", text: this._t("alert_replace_due", { date: fmtDate(bd.due, L) }), entity: bd.id || undefined });
    }
    if (st.flags.has("alarm")) out.push({ cls: "warn", text: this._t("alert_alarm"), entity: st.entity });
    const load = this._load(dev);
    if (st.key !== "overload" && load.v !== null && load.v >= 90) out.push({ cls: "warn", text: this._t("alert_high_load", { pct: `${Math.round(load.v)} %` }), entity: load.id });
    return out;
  }

  // ---- Outage history ----------------------------------------------------

  // Entity whose history tells the outages, and how one of its states reads (true: on battery, null: unknown).
  _historySource(dev) {
    const e = dev.entities;
    if (e.status || e.status_display) return { id: e.status || e.status_display, battery: statusOnBattery };
    if (e.online) return { id: e.online, battery: (s) => (s === "on" ? false : s === "off" ? true : null) };
    return null;
  }

  _wantsHistory() {
    return this._config.show_outages !== false;
  }

  // Loads the status history of the last `history_days` days (once, again when the status changes or every 15 minutes).
  _syncHistory() {
    if (!this._wantsHistory() || !this._dev || typeof this._hass?.callWS !== "function") return;
    const src = this._historySource(this._dev);
    if (!src) return;
    const days = this._opt("history_days");
    const st = this._s(src.id);
    const key = `${src.id}|${days}|${st?.last_changed ?? ""}`;
    const h = this._history;
    if (h && h.key === key && (h.loading || Date.now() - h.at < HISTORY_REFRESH_MS)) return;
    if (h?.loading && h.key === key) return;
    const end = Date.now();
    const start = end - days * 86400e3;
    const ticket = { key, loading: true, at: end, outages: h?.outages ?? null, error: false };
    this._history = ticket;
    Promise.resolve(
      this._hass.callWS({
        type: "history/history_during_period",
        start_time: new Date(start).toISOString(),
        end_time: new Date(end).toISOString(),
        entity_ids: [src.id],
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      }),
    )
      .then((res) => {
        if (this._history !== ticket) return;
        const list = Array.isArray(res?.[src.id]) ? res[src.id] : [];
        // Compressed states ({ s, lu } in seconds) or full ones ({ state, last_changed }).
        const points = list.map((p) => ({ state: p.s ?? p.state, t: p.lu !== undefined ? p.lu * 1000 : Date.parse(p.last_changed ?? p.last_updated) }));
        this._history = { key, loading: false, at: Date.now(), outages: outagesOf(points, src.battery, Date.now(), 0), error: false };
        this._update();
      })
      .catch(() => {
        if (this._history !== ticket) return;
        this._history = { key, loading: false, at: Date.now(), outages: null, error: true };
        this._update();
      });
  }

  // ---- Parts -------------------------------------------------------------

  _logo(dev, cls, path = ICONS.ups) {
    const src = SOURCES[dev.source];
    const badge = src ? `<img class="logo" src="${src.logo}" alt="${esc(src.name)}">` : "";
    const icon = svgIcon(path, "type");
    return src
      ? `<a class="type-icon ${cls}" href="${src.site}" target="_blank" rel="noopener noreferrer" title="${esc(src.name)}">${icon}${badge}</a>`
      : `<span class="type-icon ${cls}">${icon}</span>`;
  }

  _subtitle(dev) {
    return [dev.manufacturer, dev.model].filter(Boolean).join(" ");
  }

  _illustrated() {
    return this._config.illustration !== false;
  }

  _header(dev, st, sub) {
    if (this._illustrated()) return this._banner(dev, st);
    const cls = STATE_CLASS[st.key];
    const chip = st.entity
      ? `<span class="chip clickable ${cls}" role="button" tabindex="0" data-entity="${esc(st.entity)}" title="${esc(st.text)}" aria-label="${esc(st.text)}"><span class="dot"></span><span class="chip-text">${esc(st.text)}</span></span>`
      : "";
    return `
      <div class="header">
        ${this._logo(dev, cls)}
        <div class="titles">
          <div class="trow"><div class="name">${esc(this._config.title || dev.name)}</div>${chip}</div>
          ${sub ? `<div class="sub" title="${esc(sub)}">${esc(sub)}</div>` : ""}
        </div>
        ${this._zoomButton()}
      </div>`;
  }

  // The illustrated header: the icon, the name and the state on the wall, the UPS drawn big at the right (its
  // state and animations), day or night. The manufacturer and model are also in the name's tooltip.
  _banner(dev, st) {
    const cls = STATE_CLASS[st.key];
    const b = this._battery(dev);
    const rt = this._runtime(dev);
    const L = this._locale();
    const model = this._subtitle(dev);
    // The state in the status pill (it opens its entity). The subtitle: where the body shows the charge and the
    // runtime (full card, expanded mini card), the manufacturer and model; on the compact mini card, the runtime on
    // battery, else the charge.
    const extra = this._heroInBody() ? model : isOnBattery(st.key) && rt.v !== null ? fmtDuration(rt.v, L) : b.v !== null ? fmtValue(b.v, "%", L) : "";
    const pill = `<span class="chip ${cls}${st.entity ? ` clickable" role="button" tabindex="0" data-entity="${esc(st.entity)}` : ""}" title="${esc(st.text)}" aria-label="${esc(st.text)}"><span class="dot"></span><span class="chip-text">${esc(st.text)}</span></span>`;
    const sub = extra ? `<div class="sub" title="${esc(extra)}">${esc(extra)}</div>` : "";
    const name = this._config.title || dev.name;
    return `
      <div class="banner${isNight(this._hass, this._config) ? " night" : ""}">
        ${upsScene(this._uid, st.key, b.v)}
        <div class="head">
          ${this._logo(dev, cls, ICONS.ups_mdi)}
          <div class="titles"><div class="tstack">
            <div class="trow"><div class="name" title="${esc(model ? `${name} · ${model}` : name)}">${esc(name)}</div>${pill}</div>
            ${sub}
          </div></div>
        </div>
        <div class="ground"></div>
        ${this._zoomButton()}
      </div>`;
  }

  _zoomButton() {
    return "";
  }

  // Whether the body shows the battery charge big: always on the full card, only expanded on the mini card.
  _heroInBody() {
    return true;
  }

  _picture(dev, st) {
    const label = esc(`${dev.name}: ${st.text}`);
    const attrs = st.entity ? ` clickable" role="button" tabindex="0" aria-label="${label}" data-entity="${esc(st.entity)}"` : `" role="img" aria-label="${label}"`;
    return `<div class="picture${attrs}>${upsSvg(st.key, this._battery(dev).v)}</div>`;
  }

  _bannerStyle() {
    return this._illustrated() ? BANNER_STYLE : "";
  }

  // The UPS picture beside the battery, when it is not drawn in the illustrated header.
  _heroPicture(dev, st) {
    return this._illustrated() ? "" : this._picture(dev, st);
  }

  _alertsHtml(alerts) {
    if (!alerts.length) return "";
    return `<div class="alerts" role="alert">${alerts
      .map(
        (a) =>
          `<div class="alert ${a.cls}${a.entity ? ` clickable" role="button" tabindex="0" data-entity="${esc(a.entity)}"` : '"'}>${svgIcon(ICONS.alert)}<span>${esc(a.text)}</span></div>`,
      )
      .join("")}</div>`;
  }

  _line(id, icon, cls, html) {
    return `<div class="line ${cls}${id ? ` clickable" role="button" tabindex="0" data-entity="${esc(id)}"` : '"'}>${svgIcon(icon)}<span>${html}</span></div>`;
  }

  _runtimeLine(dev) {
    const rt = this._runtime(dev);
    if (rt.v === null) return "";
    return this._line(rt.id, ICONS.clock, rt.cls, esc(this._t("runtime_left", { time: fmtDuration(rt.v, this._locale()) })));
  }

  _loadLine(dev) {
    const L = this._locale();
    const load = this._load(dev);
    // Real power, else apparent power.
    const p = this._power(dev) || this._apparent(dev);
    if (load.v === null && !p) return "";
    const parts = [];
    if (load.v !== null) parts.push(`${esc(this._t("load"))} <b>${esc(fmtValue(load.v, "%", L))}</b>`);
    if (p) parts.push(`<b>${p.estimated ? "≈ " : ""}${esc(fmtValue(p.v, p.unit, L))}</b>`);
    return this._line(load.id || p?.id, ICONS.gauge, load.cls, parts.join(" · "));
  }

  _errorCard(key) {
    return `<style>${BASE_STYLE}</style><ha-card><div class="warning">${esc(
      key === "unknown_device" ? `${this._t(key)}: ${this._config.device}` : this._t(key),
    )}</div></ha-card>`;
  }
}

export class UpsCard extends UpsBase {
  static getConfigElement() {
    return document.createElement("ups-card-editor");
  }

  static getStubConfig(hass) {
    const list = hass && resolve(hass);
    return list?.length ? { device: list[0].id } : {};
  }

  getCardSize() {
    return 7;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  _render() {
    const { dev, error } = findDevice(this._hass, this._config);
    if (error) return this._errorCard(error);
    this._dev = dev;
    const c = this._config;
    const st = this._state(dev);
    const parts = [this._hero(dev, st), this._alertsHtml(this._alerts(dev, st))];
    if (c.show_power !== false) parts.push(this._powerSection(dev));
    if (c.show_battery !== false) parts.push(this._batterySection(dev));
    if (c.show_outages !== false) parts.push(this._outagesSection(dev));
    return `<style>${BASE_STYLE}${PICTURE_STYLE}${FULL_STYLE}${this._bannerStyle()}</style>
      <ha-card>
        ${this._header(dev, st, this._subtitle(dev))}
        <div class="content">${parts.filter(Boolean).join("")}</div>
      </ha-card>`;
  }

  _hero(dev, st) {
    const b = this._battery(dev);
    const L = this._locale();
    const batt =
      b.v === null
        ? ""
        : `<div class="meter clickable ${b.cls}" role="button" tabindex="0" data-entity="${esc(b.id)}" aria-label="${esc(`${this._t("battery")} ${Math.round(b.v)} %`)}">
            <div class="batt">${svgIcon(ICONS.battery)}<span class="pct">${fmtNum(Math.round(b.v), 0, L)}<small>%</small></span></div>
            <div class="bar ${b.cls}"><div style="width:${Math.max(0, Math.min(100, b.v))}%"></div></div>
          </div>`;
    return `<div class="hero">
        ${this._heroPicture(dev, st)}
        <div class="info">${batt}${this._runtimeLine(dev)}${this._loadLine(dev)}</div>
      </div>`;
  }

  _sectionTitle(key, icon, label, extra = "") {
    const closed = this._isCollapsed(key);
    return `<div class="section-title toggle" role="button" tabindex="0" data-action="toggle_section" data-section="${key}" aria-expanded="${!closed}">${svgIcon(icon)}<span>${esc(label)}</span>${extra}${svgIcon(ICONS.chevron_down, "chevron")}</div>`;
  }

  _tile(id, icon, label, value, cls = "") {
    const attrs = id ? ` clickable" role="button" tabindex="0" data-entity="${esc(id)}"` : '"';
    return `<div class="tile ${cls}${attrs}><div class="k">${svgIcon(icon)}<span>${esc(label)}</span></div><div class="v">${value}</div></div>`;
  }

  _measure(id, icon, label, digits = 1, cls = "") {
    const s = this._s(id);
    const v = num(s);
    if (v === null) return "";
    return this._tile(id, icon, label, esc(fmtValue(v, s.attributes?.unit_of_measurement, this._locale(), digits)), cls);
  }

  _section(key, icon, label, body, extra = "") {
    if (!body) return "";
    return `<div class="section">${this._sectionTitle(key, icon, label, extra)}${this._isCollapsed(key) ? "" : body}</div>`;
  }

  _powerSection(dev) {
    const e = dev.entities;
    const L = this._locale();
    const load = this._load(dev);
    const p = this._power(dev);
    const ap = this._apparent(dev);
    // "118 W / 480 W": the power against the UPS's rating, "≈" when estimated from the load.
    const powerTile = (q, label, nominalId, unit) => {
      if (!q) return "";
      const nominal = num(this._s(nominalId));
      const of = nominal !== null ? ` <small>/ ${esc(fmtValue(nominal, unit, L))}</small>` : "";
      return this._tile(q.id, ICONS.bolt, label, `${q.estimated ? "≈ " : ""}${esc(fmtValue(q.v, q.unit, L))}${of}`);
    };
    const tiles = [
      this._measure(e.input_voltage, ICONS.plug, this._t("input_voltage")),
      this._measure(e.output_voltage, ICONS.socket, this._t("output_voltage")),
      powerTile(p, this._t("power"), e.power_nominal, "W"),
      load.v !== null ? this._tile(load.id, ICONS.gauge, this._t("load"), esc(fmtValue(load.v, "%", L)), load.cls) : "",
      powerTile(ap, this._t("apparent_power"), e.apparent_power_nominal, "VA"),
      this._measure(e.frequency, ICONS.wave, this._t("frequency")),
      this._measure(e.temperature, ICONS.thermometer, this._t("temperature")),
    ].filter(Boolean);
    return this._section("power", ICONS.bolt, this._t("section_power"), tiles.length ? `<div class="tiles">${tiles.join("")}</div>` : "");
  }

  _batterySection(dev) {
    const e = dev.entities;
    const L = this._locale();
    const b = this._battery(dev);
    const rt = this._runtime(dev);
    const bd = this._batteryDate(dev);
    const test = this._s(e.self_test);
    const tiles = [
      b.v !== null ? this._tile(b.id, ICONS.battery, this._t("charge"), esc(fmtValue(b.v, "%", L)), b.cls) : "",
      rt.v !== null ? this._tile(rt.id, ICONS.clock, this._t("runtime"), esc(fmtDuration(rt.v, L)), rt.cls) : "",
      this._measure(e.battery_voltage, ICONS.bolt, this._t("battery_voltage")),
      this._measure(e.battery_temperature, ICONS.thermometer, this._t("battery_temperature")),
      bd ? this._tile(bd.id, ICONS.calendar, this._t("battery_date"), esc(fmtDate(bd.replaced, L))) : "",
      bd ? this._tile(bd.id, ICONS.calendar, this._t("replace_by"), esc(fmtDate(bd.due, L)), bd.cls) : "",
      valid(test) ? this._tile(e.self_test, ICONS.check, this._t("self_test"), esc(this._fmtState(test))) : "",
    ].filter(Boolean);
    return this._section("battery", ICONS.battery, this._t("section_battery"), tiles.length ? `<div class="tiles">${tiles.join("")}</div>` : "");
  }

  _fmtState(s) {
    if (this._hass.formatEntityState) {
      try {
        return this._hass.formatEntityState(s);
      } catch (_e) {
        /* older Home Assistant */
      }
    }
    return s.state;
  }

  // Outages of the last `history_days` days, read from the status history: count, time on battery, longest, and the
  // latest ones; the transfers counted by apcupsd and the reason of its last one.
  _outagesSection(dev) {
    const src = this._historySource(dev);
    const e = dev.entities;
    if (!src && !e.transfers && !e.last_transfer) return "";
    const L = this._locale();
    const days = this._opt("history_days");
    const h = this._history;
    const outages = h?.outages;
    const tiles = [];
    let body = "";
    if (src) {
      if (outages) {
        const total = outages.reduce((a, o) => a + o.duration, 0);
        const longest = outages.reduce((a, o) => Math.max(a, o.duration), 0);
        tiles.push(
          this._tile(src.id, ICONS.history, this._t("outages_n_days", { days }), esc(fmtNum(outages.length, 0, L))),
          this._tile(src.id, ICONS.clock, this._t("time_on_battery"), esc(outages.length ? fmtDuration(total, L) : "—")),
          this._tile(src.id, ICONS.clock, this._t("longest"), esc(outages.length ? fmtDuration(longest, L) : "—")),
        );
      }
    }
    const transfers = num(this._s(e.transfers));
    if (transfers !== null) tiles.push(this._tile(e.transfers, ICONS.swap, this._t("transfers"), esc(fmtNum(transfers, 0, L))));
    const last = this._s(e.last_transfer);
    if (valid(last)) tiles.push(this._tile(e.last_transfer, ICONS.swap, this._t("last_transfer"), esc(last.state)));
    if (tiles.length) body += `<div class="tiles">${tiles.join("")}</div>`;
    if (src) {
      if (!h || (h.loading && !outages)) body += `<div class="msg">${esc(this._t("history_loading"))}</div>`;
      else if (h.error && !outages) body += `<div class="msg">${esc(this._t("history_error"))}</div>`;
      else if (outages && !outages.length) body += `<div class="msg">${esc(this._t("no_outage", { days }))}</div>`;
      else if (outages) body += this._outageList(src.id, outages.slice(0, this._opt("max_outages")));
    }
    const count = outages ? `<span class="count">(${fmtNum(outages.length, 0, L)})</span>` : "";
    return this._section("outages", ICONS.history, this._t("section_outages"), body, count);
  }

  _outageList(id, outages) {
    const L = this._locale();
    const tz = this._hass.locale?.time_zone === "server" ? this._hass.config?.time_zone : undefined;
    const rows = outages.map((o) => {
      const ongoing = o.end === null;
      const dur = ongoing ? `${fmtDuration(o.duration, L)} · ${this._t("ongoing")}` : fmtDuration(o.duration, L);
      return `<div class="outage clickable${ongoing ? " ongoing warn" : " idle"}" role="button" tabindex="0" data-entity="${esc(id)}">${svgIcon(ICONS.bolt)}<span class="when">${esc(fmtDateTime(o.start, L, tz))}</span><span class="dur">${esc(dur)}</span></div>`;
    });
    return `<div class="outages">${rows.join("")}</div>`;
  }
}

// The mini card is the full card drawn compact: its detail button (top right, `zoom: false` removes it) switches it
// to the full card's content and back, and a click anywhere else on the page brings the compact view back.
export class UpsMiniCard extends UpsCard {
  constructor() {
    super();
    this._unzoom = watchOutside(this, () => {
      if (this._zoomed) this._setZoom(false);
    });
  }

  static getConfigElement() {
    return document.createElement("ups-mini-card-editor");
  }

  connectedCallback() {
    super.connectedCallback();
    this._unzoom.on();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unzoom.off();
    // Back to the compact view once off the screen.
    this._zoomed = false;
  }

  _heroInBody() {
    return !!this._zoomed;
  }

  getCardSize() {
    return this._zoomed ? super.getCardSize() : 3;
  }

  getGridOptions() {
    return { ...(this._zoomed ? super.getGridOptions() : { columns: 6, min_columns: 6 }), rows: "auto" };
  }

  // The outage history is only read for the detailed view.
  _wantsHistory() {
    return !!this._zoomed && super._wantsHistory();
  }

  _zoomButton() {
    if (this._config.zoom === false) return "";
    const z = this._zoomed;
    const label = esc(this._t(z ? "zoom_out" : "zoom_in"));
    return `<button class="zoom" data-action="zoom" title="${label}" aria-label="${label}" aria-pressed="${!!z}">${svgIcon(z ? ICONS.collapse : ICONS.expand)}</button>`;
  }

  _setZoom(on) {
    this._zoomed = on;
    this._update();
    this.dispatchEvent(new CustomEvent("iron-resize", { bubbles: true, composed: true }));
  }

  _toggleZoom(ev) {
    this._setZoom(!this._zoomed);
    if (ev?.detail === 0) this.shadowRoot.querySelector(".zoom")?.focus({ preventScroll: true });
  }

  _render() {
    if (this._zoomed) return super._render();
    const { dev, error } = findDevice(this._hass, this._config);
    if (error) return this._errorCard(error);
    this._dev = dev;
    const st = this._state(dev);
    const b = this._battery(dev);
    const L = this._locale();
    const batt =
      b.v === null
        ? ""
        : `<div class="batt clickable ${b.cls}" role="button" tabindex="0" data-entity="${esc(b.id)}" aria-label="${esc(`${this._t("battery")} ${Math.round(b.v)} %`)}">${svgIcon(ICONS.battery)}<div class="bar ${b.cls}"><div style="width:${Math.max(0, Math.min(100, b.v))}%"></div></div><span class="v">${esc(fmtValue(b.v, "%", L))}</span></div>`;
    const alert = this._alerts(dev, st)[0];
    return `<style>${BASE_STYLE}${PICTURE_STYLE}${FULL_STYLE}${MINI_STYLE}${this._bannerStyle()}</style>
      <ha-card>
        ${this._header(dev, st, "")}
        <div class="content">
          <div class="row">
            ${this._heroPicture(dev, st)}
            <div class="info">${batt}${this._runtimeLine(dev)}${this._loadLine(dev)}</div>
          </div>
          ${alert ? this._alertsHtml([alert]) : ""}
        </div>
      </ha-card>`;
  }
}
