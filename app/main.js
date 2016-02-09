import cssLoader from 'modules/defer-css';
cssLoader();

import PIXI from 'modules/pixi';
const r = PIXI.autoDetectRenderer(800, 600);
const code = document.querySelector('#code');
document.body.insertBefore(r.view, code);

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
var state = {
  x: 0,
  y: 0,
};
const stage = new PIXI.Container();
stage.scale = {x: 3, y: 3};
PIXI.loader
  .add('assets/sprites/link.json', resource => {
    const frames = Object.keys(resource.textures)
      .filter(key => key.startsWith('link_0_'))
      .filter(key => !key.endsWith('0'))
      .reduce((frames, key) => frames.concat(resource.textures[key]), []);
    const movie = new PIXI.extras.MovieClip(frames);
    movie.animationSpeed = 0.2;
    movie.x = 50;
    movie.y = 50;
    movie.play()
    stage.addChild(movie);
  })
  .load();
animate();

function animate(timestamp) {
  if(typeof script !== 'undefined' && script.tick) {
    state = script.tick(state, timestamp);
  }
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
