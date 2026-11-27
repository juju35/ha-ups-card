// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

export const BASE_STYLE = `
  :host { --uc-accent: #2e7d32; --uc-ok: var(--success-color, #43a047); --uc-warn: var(--warning-color, #ffa600);
          --uc-crit: var(--error-color, #db4437); --uc-idle: var(--secondary-text-color, #9e9e9e); --uc-active: var(--info-color, #039be5);
          /* Text in a state color is mixed with the text color so that it reads at 4.5:1 at least. */
          --uc-accent-text: color-mix(in srgb, var(--uc-accent) 50%, var(--primary-text-color)); }
  ha-card { overflow: hidden; container: uc-card / inline-size; }
  /* A size container has no width of its own: this zero-height grid gives the card a natural width without a minimum,
     so that it still shrinks to its track in a grid or a flex row. */
  :host { display: block; min-width: 0; --uc-natural-width: 360px; }
  :host::before { content: ""; display: grid; grid-template-columns: minmax(0, var(--uc-natural-width)); height: 0; }
  .icon { width: 18px; height: 18px; fill: currentColor; fill-rule: evenodd; flex: none; }
  .muted { color: var(--secondary-text-color); }
  .clickable { cursor: pointer; }
  [role="button"]:focus-visible { outline: 2px solid var(--primary-color, var(--uc-accent)); outline-offset: 2px; border-radius: 4px; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; animation: none !important; } }
  .ok { --c: var(--uc-ok); } .warn { --c: var(--uc-warn); } .crit { --c: var(--uc-crit); } .idle { --c: var(--uc-idle); } .active { --c: var(--uc-active); }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--c, var(--uc-ok)); flex: none; display: inline-block; }
  .chip { display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; white-space: nowrap;
          background: color-mix(in srgb, var(--c, var(--uc-ok)) 15%, transparent); color: color-mix(in srgb, var(--c, var(--uc-ok)) 50%, var(--primary-text-color));
          flex: 0 1 auto; min-width: 0; max-width: 50%; overflow: hidden; box-sizing: border-box; }
  .chip-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .bar { height: 4px; border-radius: 3px; background: var(--divider-color, rgba(127,127,127,.25)); overflow: hidden; }
  .bar > div { height: 100%; border-radius: 3px; background: var(--c, var(--uc-ok)); transition: width .6s ease; }
  /* Title row: icon, titles, status chip (aligned on the title line) and the mini card's detail button. */
  .header { display: flex; align-items: center; gap: 10px; padding: 12px 12px 0; }
  .titles { flex: 1 1 0; min-width: 0; }
  :host([hide-title]) .titles .name, :host([hide-subtitle]) .titles .sub { display: none; }
  .name { font-size: 16px; font-weight: 500; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .type-icon { position: relative; display: flex; flex: none; width: 40px; height: 40px; border-radius: 50%; align-items: center; justify-content: center;
               --uc-tint: var(--c, var(--uc-accent)); background: color-mix(in srgb, var(--uc-tint) 16%, transparent); transition: background-color .3s ease; }
  .type-icon .icon.type { width: 24px; height: 24px; fill: color-mix(in srgb, var(--uc-tint) 60%, var(--primary-text-color)); transition: fill .3s ease; }
  .type-icon .logo { position: absolute; right: -4px; bottom: -4px; width: 18px; height: 18px; border-radius: 5px; object-fit: contain;
                     background: #fff; box-shadow: 0 0 0 1px var(--divider-color, rgba(0,0,0,.12)), 0 0 0 3px var(--card-background-color, #fff); }
  .warning { padding: 16px; color: color-mix(in srgb, var(--uc-warn) 50%, var(--primary-text-color)); }
  .picture { flex: none; display: flex; align-items: center; justify-content: center; }
  .info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .line { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--secondary-text-color); min-width: 0; }
  .line .icon { width: 16px; height: 16px; color: var(--c, var(--secondary-text-color)); }
  .line span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .line b { font-weight: 500; color: var(--primary-text-color); }
  .alerts { display: flex; flex-direction: column; gap: 6px; }
  .alert { display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 8px 10px; border-radius: 10px;
           background: color-mix(in srgb, var(--c, var(--uc-crit)) 12%, transparent);
           border: 1px solid color-mix(in srgb, var(--c, var(--uc-crit)) 35%, transparent);
           color: color-mix(in srgb, var(--c, var(--uc-crit)) 50%, var(--primary-text-color)); }
  .alert .icon { width: 18px; height: 18px; color: var(--c, var(--uc-crit)); }
  .alert span { min-width: 0; }
  .zoom { all: unset; flex: none; cursor: pointer; width: 24px; height: 24px; margin: -2px -4px 0 0; border-radius: 50%;
          display: grid; place-items: center; color: var(--secondary-text-color);
          background: color-mix(in srgb, var(--uc-idle) 10%, transparent); border: 1px solid color-mix(in srgb, var(--uc-idle) 25%, transparent); }
  .zoom .icon { width: 14px; height: 14px; }
  .zoom:hover { background: color-mix(in srgb, var(--uc-idle) 18%, transparent); color: var(--primary-text-color); }
  .zoom:focus-visible { outline: 2px solid var(--primary-color, var(--uc-accent)); outline-offset: 1px; }
  @container uc-card (max-width: 230px) { .header { gap: 6px; } }
  /* The status pill, in every header: on the title row right after the title only when the whole title and the pill's
     whole label fit there; otherwise on its own line under the subtitle, cut to one line; its dot alone, beside the
     title, when the banner has no room left above its ground strip, or on a card of 200 px or less. Decided by
     measurement (see _fitPill), so that every language and every width gets it right. */
  .titles .trow { display: flex; align-items: center; gap: 8px; min-width: 0; width: 100%; }
  .titles .trow > .name { flex: 0 1 auto; min-width: 0; }
  .titles .trow > .chip { flex: none; max-width: none; margin: 0; align-self: center; }
  .titles.below { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; }
  .titles.below > * { max-width: 100%; }
  .titles.below .trow { display: contents; }
  .titles.below .trow > .name { max-width: 100%; }
  .titles.below .trow > .chip { order: 9; max-width: 100%; margin-top: 2px; align-self: flex-start; }
  /* In the banner, a pill on its own line may run over the picture, up to the banner's edge. */
  .banner .titles.below .trow > .chip { max-width: none; }
  .titles.below :is(.sub) { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .titles.dotonly .trow > .chip { padding: 4px; } .titles.dotonly .trow > .chip .chip-text { display: none; }
  @container uc-card (max-width: 200px) { .titles .trow > .chip { padding: 4px; } .titles .trow > .chip .chip-text { display: none; } }
`;

export const FULL_STYLE = `
  .content { padding: 8px 12px 12px; display: flex; flex-direction: column; gap: 12px; }
  .hero { display: flex; gap: 12px; align-items: center; }
  .picture { width: 112px; height: 90px; }
  .batt { display: flex; align-items: center; gap: 8px; }
  .batt .pct { font-size: 30px; font-weight: 400; line-height: 1; }
  .batt .pct small { font-size: 14px; margin-left: 2px; color: var(--secondary-text-color); }
  .batt .icon { color: var(--c); width: 22px; height: 22px; }
  .meter { display: flex; flex-direction: column; gap: 3px; }
  .section-title { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; text-transform: uppercase;
                   letter-spacing: .04em; color: var(--secondary-text-color); margin-bottom: 6px; }
  .section-title .icon { width: 16px; height: 16px; }
  .section-title span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .section-title .count { margin-left: 4px; text-transform: none; letter-spacing: 0; font-weight: 400; }
  .section-title.toggle { cursor: pointer; user-select: none; }
  .section-title.toggle[aria-expanded="false"] { margin-bottom: 0; }
  .section-title .chevron { margin-left: auto; width: 16px; height: 16px; transition: transform .2s ease; }
  .section-title.toggle[aria-expanded="false"] .chevron { transform: rotate(-90deg); }
  .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(116px, 1fr)); gap: 6px; }
  .tile { display: flex; flex-direction: column; gap: 2px; padding: 6px 10px; border-radius: 10px; min-width: 0;
          background: var(--secondary-background-color, rgba(127,127,127,.08)); }
  .tile .k { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; }
  .tile .k span { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  .tile .k .icon { width: 14px; height: 14px; color: var(--c, var(--secondary-text-color)); }
  .tile .v { font-size: 14px; font-weight: 500; line-height: 1.3; overflow-wrap: anywhere; }
  .tile .v small { font-size: 11px; font-weight: 400; color: var(--secondary-text-color); }
  .tile.warn .v, .tile.crit .v { color: color-mix(in srgb, var(--c) 50%, var(--primary-text-color)); }
  .outages { display: flex; flex-direction: column; gap: 2px; margin-top: 8px; }
  .outage { display: grid; grid-template-columns: 16px minmax(0, 1fr) auto; align-items: center; gap: 8px; font-size: 12px;
            padding: 5px 8px; border-radius: 8px; }
  .outage:nth-child(odd) { background: color-mix(in srgb, var(--secondary-background-color, rgba(127,127,127,.08)) 70%, transparent); }
  .outage .icon { width: 16px; height: 16px; color: var(--c, var(--secondary-text-color)); }
  .outage .when { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .outage .dur { font-weight: 500; white-space: nowrap; }
  .outage.ongoing .dur { color: color-mix(in srgb, var(--uc-warn) 50%, var(--primary-text-color)); }
  .msg { font-size: 12px; color: var(--secondary-text-color); padding: 4px 2px; }
  @container uc-card (max-width: 300px) {
    .picture { width: 80px; height: 66px; }
    .hero { gap: 10px; }
    .tiles { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @container uc-card (max-width: 200px) {
    .picture { display: none; }
    .batt .pct { font-size: 24px; }
    .tiles { grid-template-columns: minmax(0, 1fr); }
  }
`;

export const MINI_STYLE = `
  :host { --uc-natural-width: 300px; }
  .content { padding: 8px 12px 12px; display: flex; flex-direction: column; gap: 8px; }
  .row { display: flex; align-items: center; gap: 12px; }
  .picture { width: 72px; height: 58px; }
  .batt { display: flex; align-items: center; gap: 8px; font-size: 13px; }
  .batt .icon { color: var(--c); width: 16px; height: 16px; }
  .batt .bar { flex: 1; }
  .batt .v { font-weight: 500; min-width: 40px; text-align: right; }
  .alert { padding: 6px 8px; font-size: 12px; }
  @container uc-card (max-width: 220px) {
    .picture { display: none; }
  }
`;

// Element names of Home Assistant dialogs (more-info opened from the card, among others).
export const DIALOG_TAGS = new Set(["HA-MORE-INFO-DIALOG", "HA-DIALOG", "DIALOG"]);
export const isOutside = (card, ev) => {
  const path = ev.composedPath();
  return !path.includes(card) && !path.some((n) => DIALOG_TAGS.has(n.tagName));
};

// "A click elsewhere" is caught on the pointer, not only on the click event: on iOS (Safari and the companion app)
// a tap on something that is not clickable (the background, an empty spot, a card with no action) sends no click to
// the page. It counts when the press and the release are both outside the card (a slider dragged out of the card
// does not fold it), and a scroll does not count (the browser cancels the pointer). Keyboard clicks still go through
// the click event.
export const watchOutside = (card, handler) => {
  let downOutside = false;
  const onDown = (ev) => {
    downOutside = isOutside(card, ev);
  };
  const onUp = (ev) => {
    if (downOutside && isOutside(card, ev)) handler(ev);
    downOutside = false;
  };
  const onClick = (ev) => {
    if (ev.detail === 0 && isOutside(card, ev)) handler(ev);
  };
  return {
    on() {
      document.addEventListener("pointerdown", onDown, true);
      document.addEventListener("pointerup", onUp, true);
      document.addEventListener("click", onClick, true);
    },
    // A tap (press and release at the same spot), for the tests.
    tap(ev) {
      onDown(ev);
      onUp(ev);
    },
    off() {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("click", onClick, true);
    },
  };
};

// No rewrite of the card between a press and its click: Home Assistant updates the card several times a second, and a
// rewrite under the pointer replaces the element pressed, so that the click lands on the card itself and does nothing
// (a button or a row that does not react). While a press is in progress (`_pressing`), a render is left pending
// (`_dirty`): it is done at the click, or right after the release when no click follows (a drag, a scroll).
// `_byPointer` tells a mouse or touch use from the keyboard: after a rewrite, the focus is put back only for the
// keyboard (no focus ring after a click), and always in a text field.
export const holdUnderPress = (card, render) => {
  const root = card.shadowRoot;
  card._onPressEnd = () => {
    window.removeEventListener?.("pointerup", card._onPressEnd, true);
    window.removeEventListener?.("pointercancel", card._onPressEnd, true);
    setTimeout(() => card._endPress(), 0);
  };
  card._endPress = () => {
    card._pressing = false;
    if (!card._dirty) return;
    card._dirty = false;
    render();
  };
  // Left in the middle of a press (see disconnectedCallback).
  card._dropPress = () => {
    card._pressing = false;
    card._dirty = false;
    window.removeEventListener?.("pointerup", card._onPressEnd, true);
    window.removeEventListener?.("pointercancel", card._onPressEnd, true);
  };
  root.addEventListener?.("pointerdown", () => {
    card._byPointer = true;
    card._pressing = true;
    window.addEventListener?.("pointerup", card._onPressEnd, true);
    window.addEventListener?.("pointercancel", card._onPressEnd, true);
  });
  root.addEventListener?.("keydown", () => {
    card._byPointer = false;
  });
  // At the click (capture: before the card acts on it) the press is over, and what the click changes is drawn at once.
  card._pressClick = (ev) => {
    card._pressing = false;
    if (ev.detail === 0) card._byPointer = false;
  };
  root.addEventListener?.("click", card._pressClick, true);
};

// Whether the focus goes back to `el` after a rewrite (see holdUnderPress).
export const keepsFocus = (card, el) => !card._byPointer || typeof el?.selectionStart === "number";

// Elements a click acts on, and how one is told from the others across renders (see _focusedSpot).
export const FOCUS_SELECTOR = "[data-action], [data-entity]";
export const focusKey = (el) => {
  const data = Object.entries({ ...el.dataset });
  return data.length ? `${el.tagName}|${JSON.stringify(data)}` : "";
};

// ---------------------------------------------------------------------------
// Shadow DOM patching: a new render is applied in place (kept nodes keep their running animations, hover and
// focus) instead of replacing the whole shadow root. Nodes carrying a data-key are matched by it, the others by
// position. Repo-local on purpose (the ha-* repos share no code).
// ---------------------------------------------------------------------------

export const patchAttrs = (cur, next) => {
  for (const { name } of [...cur.attributes]) if (!next.hasAttribute(name)) cur.removeAttribute(name);
  for (const { name, value } of next.attributes) if (cur.getAttribute(name) !== value) cur.setAttribute(name, value);
};
export const keyOf = (n) => (n.nodeType === 1 ? n.getAttribute("data-key") : null);
export const sameNode = (a, b) => !!a && a.nodeType === b.nodeType && a.nodeName === b.nodeName;
export const patchChildren = (cur, next) => {
  const old = [...cur.childNodes];
  const fresh = [...next.childNodes];
  const byKey = new Map();
  for (const o of old) {
    const k = keyOf(o);
    if (k !== null && !byKey.has(k)) byKey.set(k, o);
  }
  const used = new Set();
  fresh.forEach((n, i) => {
    const k = keyOf(n);
    let o = k !== null ? byKey.get(k) : old[i];
    if (!sameNode(o, n) || used.has(o) || (k === null && keyOf(o) !== null)) o = null;
    const ref = cur.childNodes[i] ?? null;
    if (!o) {
      cur.insertBefore(n, ref);
      return;
    }
    used.add(o);
    if (o !== ref) cur.insertBefore(o, ref);
    if (n.nodeType === 1) {
      patchAttrs(o, n);
      patchChildren(o, n);
    } else if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue;
  });
  while (cur.childNodes.length > fresh.length) cur.removeChild(cur.lastChild);
};
// The first render (an empty root) is written at once; the next ones are patched in place.
export const morph = (root, html) => {
  if (!root.childNodes?.length) {
    root.innerHTML = html;
    return;
  }
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  patchChildren(root, tpl.content);
};

export const sameDeps = (a, b) => !!a && a.length === b.length && a.every((d, i) => d === b[i]);
export const HISTORY_REFRESH_MS = 15 * 60 * 1000;
// How long after the mains came back a battery not full reads "Charging" when the UPS does not say it.
export const CHARGING_WINDOW_MS = 12 * 3600 * 1000;
