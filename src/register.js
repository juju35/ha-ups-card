// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------
import { pickerDefine } from "./card-picker.js";
import { VERSION } from "./core.js";
import { UpsCard, UpsMiniCard } from "./cards.js";
import { UpsCardEditor, UpsMiniCardEditor } from "./visual-editors.js";

export const define = (name, cls) => {
  if (!customElements.get(name)) pickerDefine(name, cls);
};
define("ups-card", UpsCard);
define("ups-mini-card", UpsMiniCard);
define("ups-card-editor", UpsCardEditor);
define("ups-mini-card-editor", UpsMiniCardEditor);

window.customCards = window.customCards || [];
for (const card of [
  {
    type: "ups-card",
    name: "UPS Card",
    description: "UPS from Network UPS Tools, APC UPS Daemon or generic sensors: state, battery, runtime, load, voltages, power, outage history and battery replacement.",
  },
  { type: "ups-mini-card", name: "UPS Mini Card", description: "Compact UPS overview: state, battery, runtime and load, with a detail button." },
]) {
  if (!window.customCards.some((c) => c.type === card.type)) window.customCards.push({ ...card, preview: true, documentationURL: "https://github.com/juju35/ha-ups-card" });
}

console.info(`%c UPS-CARD %c v${VERSION} `, "color: white; background: #2e7d32; font-weight: 700;", "color: #2e7d32; background: white; font-weight: 700;");
