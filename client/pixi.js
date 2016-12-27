import 'pixi.js';

const requestAnimationFrame = window.requestAnimationFrame;// eslint-disable-line

//reexport global PIXI to help control its usage inside app with linters
export default window.PIXI;  // eslint-disable-line

export {requestAnimationFrame};