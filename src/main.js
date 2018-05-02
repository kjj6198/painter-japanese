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
      pen.add({
        x: e.pageX - e.target.offsetLeft,
        y: e.pageY - e.target.offsetTop
      });
      pen.draw(ctx);
    }
  });
}

const recognition: HTMLElement = document.getElementById('recognition');

const sendImage = () => {
  const imageData: ImageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  fetch('http://localhost:3000', {
    method: 'POST',
    body: ctx.canvas.toDataURL(),
  }).then(console.log);
  

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

recognition.addEventListener('click', sendImage);
window.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    sendImage(); 
  }
})