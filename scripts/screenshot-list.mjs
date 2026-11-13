// The README screenshots (PNG) and animations (GIF) rendered by scripts/screenshots.mjs.
// Every capture has a twin in the other theme ("-dark" for a light capture, "-light" for a dark one)
// that shows exactly the same state: only the theme differs (checked by test/screenshots.test.mjs).
import { charging, genericEntities, lowBattery, onBattery, overload } from "./mock-states.mjs";

const pair = (file, type, width, config = {}, extra = {}, first = "light") => {
  const second = first === "light" ? "dark" : "light";
  return [
    { file, type, theme: first, width, config, ...extra },
    { file: `${file}-${second}`, type, theme: second, width, config, ...extra },
  ];
};

export const shots = [
  ...pair("card", "ups-card", 460, { device: "Office UPS" }),
  ...pair("mini-card", "ups-mini-card", 380, { device: "Office UPS" }),
  ...pair("card-apc", "ups-card", 460, { device: "Rack UPS" }, {}, "dark"),
  ...pair("mini-card-apc", "ups-mini-card", 380, { device: "Rack UPS" }, {}, "dark"),
  ...pair("card-generic", "ups-card", 460, { title: "Garage UPS", entities: genericEntities, battery_replaced: "2025-06-01" }),
  ...pair("card-on-battery", "ups-card", 460, { device: "Office UPS", collapsed: ["power", "battery"] }, { overrides: onBattery }, "dark"),
  ...pair("mini-card-zoom", "ups-mini-card", 460, { device: "Office UPS" }, { clicks: [".zoom"] }),
  // Narrow cards: the full card at 6 of 12 columns of a phone's Sections view (~170 px wide cards are mini cards).
  ...pair("card-narrow", "ups-card", 238, { device: "Office UPS", collapsed: ["outages"] }),
  ...pair("mini-card-narrow", "ups-mini-card", 170, { device: "Office UPS" }),
];

// One looping GIF per distinct animated state the picture plays (each one its own keyframes):
//   online       — power flowing from the wall plug through the UPS to the computer (green dashes)
//   charging     — the same in blue, the next gauge bar filling on the screen
//   on-battery   — plug cut off with a spark, slower orange flow, last gauge bar draining, LED blinking with waves
//   low-battery  — red, faster blinking, the last bar flashing red
//   overload     — the UPS shaking, red flow and LED
// Only the hero and the alerts are shown (the sections are hidden) to keep the files small.
const HERO = { device: "Office UPS", show_power: false, show_battery: false, show_outages: false };
export const gifs = [
  ...pair("online", "ups-card", 460, HERO),
  ...pair("charging", "ups-card", 460, HERO, { overrides: charging }),
  ...pair("on-battery", "ups-card", 460, HERO, { overrides: onBattery }, "dark"),
  ...pair("low-battery", "ups-card", 460, HERO, { overrides: lowBattery }, "dark"),
  ...pair("overload", "ups-card", 460, HERO, { overrides: overload }),
];
