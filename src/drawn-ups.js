// ---------------------------------------------------------------------------
// Drawn UPS
// ---------------------------------------------------------------------------
import { STATE_CLASS, isOnBattery } from "./ups-state.js";

// A tower UPS on its wall plug feeding a computer. The cables carry moving dashes while power flows (green on the
// mains, blue while charging, orange on battery, red when low or overloaded), the screen's battery gauge fills while
// charging and drains on battery, the power LED blinks when something is wrong. Still otherwise, and with reduced motion.
export const upsSvg = (key, pct) => {
  const cls = STATE_CLASS[key] || "idle";
  const bars = pct === null || pct === undefined ? 0 : Math.max(pct > 0 ? 1 : 0, Math.min(4, Math.ceil(pct / 25)));
  const battery = isOnBattery(key);
  const dead = key === "offline" || key === "shutdown";
  const flowIn = !battery && !dead && key !== "unknown";
  const flowOut = !dead && key !== "unknown";
  const bar = (i) => {
    const on = i < bars;
    // The bar being charged blinks while charging, the last one left while on battery.
    const anim = key === "charging" && i === Math.min(bars, 3) ? " fill" : battery && i === bars - 1 ? " drain" : "";
    return `<rect class="bar${on || anim === " fill" ? " on" : ""}${anim}" x="${51.5 + i * 4.3}" y="29.5" width="3.3" height="7" rx=".6"/>`;
  };
  const cableIn = battery
    ? `<path class="cable" d="M17 70H25"/><path class="cable" d="M31 70H38"/><path class="spark" d="M26 66l2 3-2 1 3 4"/>`
    : `<path class="cable" d="M17 70H38"/>${flowIn ? `<path class="flow run in" d="M17 70H38"/>` : ""}`;
  return `<svg class="ups s-${key} ${cls}" viewBox="0 0 124 100" role="img" aria-hidden="true">
    <g class="plug"><rect x="3" y="62" width="14" height="16" rx="3"/><rect x="6" y="57" width="2.5" height="6" rx="1"/><rect x="11.5" y="57" width="2.5" height="6" rx="1"/></g>
    ${cableIn}
    <path class="cable" d="M86 70H98"/>${flowOut ? `<path class="flow run out" d="M86 70H98"/>` : ""}
    <g class="load${dead ? " off" : ""}"><rect class="screen" x="97" y="52" width="24" height="17" rx="2"/><rect class="foot" x="106" y="69" width="6" height="5"/><rect class="foot" x="102" y="74" width="14" height="2.5" rx="1"/></g>
    <g class="body">
      <rect class="case" x="38" y="12" width="48" height="82" rx="7"/>
      <rect class="edge" x="38" y="12" width="48" height="6" rx="3"/>
      <rect class="lcd" x="46" y="22" width="32" height="20" rx="2.5"/>
      <rect class="gauge" x="49.5" y="27.5" width="19" height="11" rx="1.5"/><rect class="nub" x="68.5" y="31" width="2.5" height="4" rx=".8"/>
      ${[0, 1, 2, 3].map(bar).join("")}
      <path class="vent" d="M48 52h28M48 57h28M48 62h28"/>
      ${battery ? `<circle class="wave" cx="62" cy="80" r="9"/><circle class="wave late" cx="62" cy="80" r="9"/>` : ""}
      <circle class="btn-ring" cx="62" cy="80" r="6.5"/>
      <circle class="led${["on_battery", "low_battery", "overload", "bypass", "shutdown"].includes(key) ? " blink" : ""}" cx="62" cy="80" r="3.2"/>
    </g>
  </svg>`;
};

export const PICTURE_STYLE = `
  .ups { width: 100%; height: 100%; overflow: visible; --flow: var(--c, var(--uc-ok)); }
  .ups .plug rect { fill: #8b929c; }
  .ups .cable { fill: none; stroke: #8b929c; stroke-width: 3; stroke-linecap: round; }
  .ups .flow { fill: none; stroke: var(--flow); stroke-width: 3; stroke-linecap: round; stroke-dasharray: 3 7; }
  .ups .spark { fill: none; stroke: var(--uc-warn); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
  .ups .load .screen { fill: color-mix(in srgb, var(--flow) 22%, #39414c); stroke: #59626e; stroke-width: 1.5; }
  .ups .load.off .screen { fill: #2b3038; }
  .ups .load .foot { fill: #6b7380; }
  .ups .case { fill: #2f353d; stroke: #1d2228; stroke-width: 1.2; }
  .ups .edge { fill: #434b55; }
  .ups .lcd { fill: color-mix(in srgb, var(--flow) 30%, #10161c); }
  .ups.s-offline .lcd, .ups.s-shutdown .lcd { fill: #161b20; }
  .ups .gauge { fill: none; stroke: #e8edf2; stroke-width: 1.2; }
  .ups .nub { fill: #e8edf2; }
  .ups .bar { fill: #e8edf2; opacity: .14; }
  .ups .bar.on { opacity: .95; }
  .ups .vent { fill: none; stroke: #20252b; stroke-width: 2; stroke-linecap: round; }
  .ups .btn-ring { fill: #232930; stroke: #4a525d; stroke-width: 1.2; }
  .ups .led { fill: var(--flow); }
  .ups.s-offline .led, .ups.s-unknown .led { fill: #4a525d; }
  @keyframes ups-flow { to { stroke-dashoffset: -10; } }
  @keyframes ups-blink { 0%, 100% { opacity: 1; } 50% { opacity: .2; } }
  @keyframes ups-fill { 0%, 100% { opacity: .14; } 50% { opacity: .95; } }
  @keyframes ups-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-1.2px); } 75% { transform: translateX(1.2px); } }
  @keyframes ups-spark { 0%, 100% { opacity: 0; } 40%, 60% { opacity: 1; } }
  @keyframes ups-wave { from { transform: scale(.6); opacity: .9; } to { transform: scale(1.6); opacity: 0; } }
  .ups .wave { fill: none; stroke: var(--flow); stroke-width: 1.5; transform-box: fill-box; transform-origin: center; animation: ups-wave 1.5s ease-out infinite; }
  .ups .wave.late { animation-delay: -.75s; }
  .ups .flow.run { animation: ups-flow .5s linear infinite; }
  .ups.s-on_battery .flow.run, .ups.s-low_battery .flow.run { animation-duration: 1s; }
  .ups .led.blink { animation: ups-blink 1s ease-in-out infinite; }
  .ups.s-low_battery .led.blink, .ups.s-overload .led.blink { animation-duration: .5s; }
  .ups .bar.fill { animation: ups-fill 1.5s ease-in-out infinite; }
  .ups .bar.drain { animation: ups-blink 1.5s ease-in-out infinite; }
  .ups.s-low_battery .bar.drain { fill: var(--uc-crit); animation-duration: .75s; }
  .ups .spark { animation: ups-spark 1.5s ease-in-out infinite; }
  .ups.s-overload .body { animation: ups-shake .25s linear infinite; transform-box: fill-box; }
`;
