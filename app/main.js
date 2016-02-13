import cssLoader from 'modules/defer-css';
cssLoader();

const focusables = document.body.querySelectorAll('.focusable');
const tabs = 'QWER';
document.body.addEventListener('keypress', ev => {
  const idx = tabs.split('').map(x => 'Key'+x).indexOf(ev.code);
  if(idx === -1) {
    return -1;
  }
  const active = document.body.querySelector('.focusable.active');
  if(active) {
    active.classList.remove('active');
  }
  if(focusables[idx]) {
    focusables[idx].classList.add('active');
  }
});

import PIXI from 'modules/pixi';
const r = PIXI.autoDetectRenderer(512, 512);
const code = document.querySelector('#code');
document.querySelector('#view').appendChild(r.view);

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
var state = {
  x: 0,
  y: 0,
};
const stage = new PIXI.Container();
PIXI.loader
  .add('assets/sprites/link.json', resource => {
    const frames = Object.keys(resource.textures)
      .filter(key => key.startsWith('link_0_'))
      .filter(key => !key.endsWith('0'))
      .reduce((frames, key) => frames.concat(resource.textures[key]), []);
    const movie = new PIXI.extras.MovieClip(frames);
    movie.animationSpeed = 0.2;
    movie.x = 0;
    movie.y = 0;
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
