// ---------------------------------------------------------------------------
// Illustrated header ("banner"): the UPS in its technical room
// ---------------------------------------------------------------------------
import { upsSvg } from "./drawn-ups.js";

// Night picture: forced by illustration_theme, else Home Assistant's dark theme alone (a light theme keeps the day
// picture after sunset).
export const isNight = (hass, config) => {
  if (config.illustration_theme === "night") return true;
  if (config.illustration_theme === "day") return false;
  return !!hass?.themes?.darkMode;
};

// The banner picture, 200 × 80 drawn at the right of the banner (preserveAspectRatio xMaxYMax): a technical room
// wall with its cable tray and a small network box, then the card's own UPS (upsSvg, its state and animations),
// drawn big, standing on the 10 px ground strip under the banner. `uid` keeps each card's gradient apart.
export const UPS_SCALE = 0.86;
export const upsScene = (uid, key, pct) => {
  const ty = 80 - 94 * UPS_SCALE;
  const tx = 197 - 121 * UPS_SCALE;
  const ups = upsSvg(key, pct).replace("<svg ", '<svg width="124" height="100" ');
  return `<svg class="scene" viewBox="0 0 200 80" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
    <defs><radialGradient id="uc-shadow-${uid}"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
    <g class="uc-wall">${[20, 40, 60].map((y) => `<line x1="0" y1="${y}" x2="200" y2="${y}"/>`).join("")}</g>
    <path class="uc-tray" d="M0 8H200"/>
    <path class="uc-wire" d="M10 8V40"/>
    <rect class="uc-box" x="18" y="20" width="22" height="16" rx="2"/>
    <circle class="uc-led" cx="24" cy="28" r="1.4"/><circle class="uc-led late" cx="29" cy="28" r="1.4"/>
    <ellipse cx="${(tx + 62 * UPS_SCALE).toFixed(1)}" cy="79.5" rx="34" ry="2.6" fill="url(#uc-shadow-${uid})"/>
    <g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${UPS_SCALE})">${ups}</g>
  </svg>`;
};

export const BANNER_STYLE = `
  .banner { position: relative; overflow: hidden; height: 90px; --g: 10px; --sw: min(200px, 54cqw);
            background: #e7eaee; --sky-text: #0d2a45; --sky-muted: #3b5b78; }
  .banner.night { background: #232a36; --sky-text: #fff; --sky-muted: rgba(255,255,255,.78); }
  .banner .scene { position: absolute; right: 0; bottom: var(--g); height: calc(100% - var(--g)); width: var(--sw); overflow: visible; }
  /* The scene's left end (tray, wall box) fades under the text. */
  .banner .scene { -webkit-mask-image: linear-gradient(90deg, rgba(0,0,0,.35) 0, rgba(0,0,0,.35) 12%, #000 42%); mask-image: linear-gradient(90deg, rgba(0,0,0,.35) 0, rgba(0,0,0,.35) 12%, #000 42%); }
  .banner .ground { position: absolute; left: 0; right: 0; bottom: 0; height: var(--g); background: #9aa1a9; box-shadow: inset 0 2px 0 #b5bbc2; }
  .banner.night .ground { background: #2c323b; box-shadow: inset 0 2px 0 #39414c; }
  .uc-wall line { stroke: #d6dbe1; stroke-width: .8; } .night .uc-wall line { stroke: #2e3746; }
  .uc-tray { stroke: #c4cbd3; stroke-width: 3; } .night .uc-tray { stroke: #3a4456; }
  .uc-wire { fill: none; stroke: #2f80ed; stroke-width: 1.6; stroke-dasharray: 3 4; animation: uc-wire 1s linear infinite; }
  .uc-box { fill: #fff; stroke: #c4cbd3; } .night .uc-box { fill: #2e3746; stroke: #455066; }
  .uc-led { fill: #43c463; animation: uc-led 1.2s steps(2) infinite; } .uc-led.late { animation-delay: .4s; }
  @keyframes uc-wire { to { stroke-dashoffset: -14; } }
  @keyframes uc-led { 50% { opacity: .2; } }
  .banner .ups { overflow: visible; }
  .night .ups .case { stroke: #55606e; } .night .ups .edge { fill: #4b5460; }
  /* Title and state on the wall at the left, the scene at the right. */
  .banner .head { position: absolute; z-index: 1; left: 0; top: 0; bottom: var(--g); right: calc(var(--sw) - 60px); display: flex; align-items: center;
                  gap: 10px; padding: 8px 8px 8px 14px; color: var(--sky-text); min-width: 0; }
  .banner .titles { flex: 1 1 auto; min-width: 0; }
  .banner .name { font-size: 16px; font-weight: 500; }
  .banner .sub { font-size: 13px; color: var(--sky-muted); }
  /* The round badge: the MDI UPS icon in the state color, the integration's logo at its bottom right. */
  .banner .type-icon { background: rgba(255,255,255,.62); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--uc-tint) 28%, transparent); }
  .banner .type-icon .icon.type { fill: color-mix(in srgb, var(--uc-tint) 82%, #0d2a45); }
  .banner.night .type-icon { background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.14); }
  .banner.night .type-icon .icon.type { fill: color-mix(in srgb, var(--uc-tint) 75%, #fff); }
  .banner .type-icon .logo { padding: 2px; box-sizing: border-box; box-shadow: 0 0 0 1px rgba(13,42,69,.16), 0 1px 3px rgba(13,42,69,.18); }
  /* The mini card's detail button: a frosted round button in the banner's top-right corner. */
  .banner .zoom { all: unset; position: absolute; z-index: 2; top: 5px; right: 5px; margin: 0; cursor: pointer; width: 24px; height: 24px;
                  border-radius: 50%; display: grid; place-items: center; box-sizing: border-box; color: #33506b; background: rgba(255,255,255,.55);
                  box-shadow: inset 0 0 0 1px rgba(255,255,255,.7); -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); }
  .banner .zoom .icon { width: 16px; height: 16px; }
  .banner .zoom:hover { background: rgba(255,255,255,.75); color: #33506b; }
  .banner.night .zoom { color: #ffffff; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }
  .banner.night .zoom:hover { background: rgba(255,255,255,.22); color: #ffffff; }
  .banner .zoom:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 2px; }
  .banner .head .titles { flex: 1 1 0; min-width: 0; align-self: stretch; display: flex; flex-direction: column; justify-content: center; }
  .tstack { display: flex; flex-direction: column; gap: 1px; align-items: flex-start; min-width: 0; width: 100%; }
  .tstack > * { max-width: 100%; }
  /* The status pill on the banner: the status colour on frosted glass. */
  .banner .chip { display: inline-flex; align-items: center; gap: 4px; flex: 0 0 auto; margin: 0; max-width: 51%; padding: 1px 8px; border-radius: 12px;
                  font-size: 11px; font-weight: 500; line-height: 16px; white-space: nowrap; overflow: hidden; box-sizing: border-box;
                  background: color-mix(in srgb, var(--c, var(--uc-accent)) 18%, rgba(255,255,255,.78)); color: color-mix(in srgb, var(--c, var(--uc-accent)) 45%, #0d2a45); }
  .banner.night .chip { background: color-mix(in srgb, var(--c, var(--uc-accent)) 30%, rgba(8,18,38,.55)); color: color-mix(in srgb, var(--c, var(--uc-accent)) 35%, #ffffff); }
  .banner .chip .dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--c, var(--uc-accent)); }
  .banner .chip .chip-text { display: inline; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  /* The mini card: the scene steps aside for the detail button in the top-right corner (5 + 24 px), its cable tray
     ending 7 px left of it, at full size. Narrow card: no room for the scene beside the text, the wall alone stays. */
  .banner:has(> .zoom) .scene { right: 36px; }
  .banner:has(> .zoom) .head { right: calc(var(--sw) - 24px); }
  @container uc-card (max-width: 280px) { .banner .scene { display: none; } .banner .head, .banner:has(> .zoom) .head { right: 30px; } }
`;
