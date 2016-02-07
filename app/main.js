import cssLoader from 'modules/defer-css';
cssLoader();

import PIXI from 'modules/pixi';
const r = PIXI.autoDetectRenderer(800, 600, {backgroundColor: 0xFF0000});
document.body.appendChild(r.view);
const c = new PIXI.Container();
requestAnimationFrame(function rAF() {
  r.render(c);
  requestAnimationFrame(rAF);
});
