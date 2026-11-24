// In-place rendering, in a real browser (Chromium through Playwright; CHROMIUM_PATH, or skipped without one): a state
// change patches the shadow DOM instead of replacing it, so the illustration's nodes (and their running animations)
// are kept, while the new values show; the status pill is fitted once <ha-card> has rendered.
import assert from "node:assert/strict";
import { test } from "node:test";
import { devices, entities, NOW, states } from "../scripts/mock-states.mjs";
import { source } from "./source.mjs";


let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {}
const browser = await chromium?.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}).catch(() => null);

// A Lit-like <ha-card>: renders its own shadow DOM a microtask after it is connected (hasUpdated, updateComplete).
const HA_CARD = `customElements.define("ha-card", class extends HTMLElement {
  constructor() { super(); this.hasUpdated = false; this.updateComplete = new Promise((r) => (this._done = r)); }
  connectedCallback() { queueMicrotask(() => { if (this.hasUpdated) return;
    this.attachShadow({ mode: "open" }).innerHTML = "<style>:host{display:block;overflow:hidden}</style><slot></slot>";
    this.hasUpdated = true; this._done(true); }); } });`;

for (const type of ["ups-card", "ups-mini-card"]) {
  test(`${type}: a state change patches the card in place, the banner and its scene are kept`, { skip: !browser && "no Chromium" }, async () => {
    const page = await browser.newPage({ viewport: { width: 800, height: 800 }, timezoneId: "UTC" });
    try {
      await page.clock.setFixedTime(new Date(NOW));
      await page.setContent('<!doctype html><body style="margin:0;font-family:Roboto,Arial,sans-serif"></body>');
      await page.addScriptTag({ content: HA_CARD });
      await page.addScriptTag({ content: source });
      const res = await page.evaluate(
        async ({ type, DATA }) => {
          const hass = (st) => ({ ...DATA, states: st, language: "en", locale: { language: "en" }, themes: {}, callService() {}, callWS: async () => [] });
          const outer = document.body.appendChild(document.createElement("div"));
          outer.style.width = "400px";
          const card = outer.appendChild(document.createElement(type));
          card.setConfig({ type: `custom:${type}`, device: "eaton" });
          card.hass = hass(DATA.states);
          await new Promise((r) => setTimeout(r, 50));
          const root = card.shadowRoot;
          const before = { banner: root.querySelector(".banner"), haCard: root.querySelector("ha-card"), svg: root.querySelector(".banner svg") };
          const pillPlaced = !!root.querySelector(".titles .chip")?.getBoundingClientRect().width;
          const id = "sensor.onduleur_bureau_batterie";
          card.hass = hass({ ...DATA.states, [id]: { ...DATA.states[id], state: "57", last_updated: new Date().toISOString() } });
          await new Promise((r) => setTimeout(r, 50));
          return {
            pillPlaced,
            sameBanner: root.querySelector(".banner") === before.banner,
            sameHaCard: root.querySelector("ha-card") === before.haCard,
            sameSvg: !!before.svg && root.querySelector(".banner svg") === before.svg,
            shows57: root.innerHTML.includes("57"),
            styles: root.querySelectorAll("style").length,
          };
        },
        { type, DATA: { states, entities, devices } },
      );
      assert.equal(res.pillPlaced, true, "pill measured once <ha-card> rendered");
      assert.equal(res.sameHaCard, true, "<ha-card> kept");
      assert.equal(res.sameBanner, true, "banner kept");
      assert.equal(res.sameSvg, true, "scene SVG kept (its animations keep running)");
      assert.equal(res.shows57, true, "new charge shown");
    } finally {
      await page.close();
    }
  });
}

test("the card renders through morph, never by replacing the whole shadow root after the first render", () => {
  assert.match(source, /morph\(this\.shadowRoot, html\)/);
  assert.doesNotMatch(source, /this\.shadowRoot\.innerHTML = html/);
});

test.after(() => browser?.close());
