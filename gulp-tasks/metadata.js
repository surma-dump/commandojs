import gulp from 'gulp';
import through from 'through2';
import vinylFile from 'vinyl';

export const sprite = () => () => through.obj(function (file, enc, cb) {
  const [name, frameWidth, frameHeight, numX, numY] = file.stem.split('_');
  const meta = {
    frames: {},
    meta: {
      image: file.path,
      size: {w: frameWidth*numX, h: frameHeight*numY},
      scale: 1
    }
  };

  for(let x = 0; x < numX; x++) {
    for(let y = 0; y < numY; y++) {
      meta.frames[`${name}_${x}_${y}`] = {
        frame: {
          x: x*frameWidth,
          y: y*frameHeight,
          w: frameWidth,
          h: frameHeight
        },
        rotated: false,
        trimmed: false
      };
    }
  }
  this.push(file);
  this.push(new vinylFile({
    base: file.base,
    path: `${file.dirname}/${file.stem}.json`,
    contents: new Buffer(JSON.stringify(meta))
  }));
  cb();
});
