import cssLoader from 'modules/defer-css';
cssLoader();

import PIXI from 'modules/pixi';
const r = PIXI.autoDetectRenderer(800, 600, {backgroundColor: 0xFF0000});
const code = document.querySelector('#code');
document.body.insertBefore(r.view, code);

var state = {
  x: 0,
  y: 0,
};
const stage = new PIXI.Container();
const g = new PIXI.Graphics();
stage.addChild(g);

var script;
animate();

function animate(timestamp) {
  if(script && script.tick) {
    state = script.tick(state, timestamp);
  }
  g.clear();
  g.lineStyle(1, 0x0000FF, 1.0);
  g.beginFill(0x0000FF, 1.0);
  g.drawRect(state.x, state.y, 50, 50);
  g.endFill(0x0000FF, 1.0);

  r.render(stage);
  requestAnimationFrame(animate);
}

import * as babel from 'modules/babel';
code.addEventListener('change', () => {
  const result = babel.transform(code.value, {
    presets: ['es2015']
  });

  try {
    const newScript = eval(result.code + ';Script;');
    script = new newScript();
  } catch(e) {
    console.error(e);
  }
});
