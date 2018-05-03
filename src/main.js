// @flow
import Pen from './Pen';
let pressed = false;

const canvas : HTMLElement | null = document.getElementById('canvas');
const respect = canvas.clientWidth / canvas.clientHeight;
canvas.width = 150;
canvas.height = canvas.width / respect;
let pen: Pen | null = null;
const ctx : CanvasRenderingContext2D = canvas.getContext('2d');
if (canvas) {
  canvas.addEventListener('mousedown', (e: MouseEvent) => {
    pressed = true;
    pen = new Pen();
    pen.add({
      x: e.pageX - e.target.offsetLeft,
      y: e.pageY - e.target.offsetTop
    });
  });
  document.addEventListener('mouseup', () => {
    pressed = false;
    localStorage.setItem('points', JSON.stringify(pen.list));
  });
  canvas.addEventListener('mousemove',  (e: MouseEvent) => {
    if (pressed && pen) {
      setTimeout(() => {
        pen.add({
          x: e.pageX - e.target.offsetLeft,
          y: e.pageY - e.target.offsetTop
        });
        pen.draw(ctx);
      }, 50);
    }
  });
}

const recognition: HTMLElement = document.getElementById('recognition');

const sendImage = () => {
  const imageData: ImageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
}

document.addEventListener('readystatechange', () => {
  fetch('http://localhost:3000/images/a')
  .then((res: Response) => res.arrayBuffer())
  .then((buffer: ArrayBuffer) => {
    const clampedArray: Uint8ClampedArray = new Uint8ClampedArray(buffer);
    const IMAGE_SIZE = 150 * 150 * 4; // width * height * channel
    for (let i = 0; i < clampedArray.length; i += IMAGE_SIZE) {
      const imageData = new ImageData(clampedArray.slice(i, i + IMAGE_SIZE), 150, 150);
      const image = document.createElement('canvas');
      image.width = 150;
      image.height = 150;
      const imageCtx = image.getContext('2d');
      imageCtx.putImageData(imageData, 0, 0);
      result.appendChild(image);
    }
  });
});


recognition.addEventListener('click', sendImage);
window.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
})