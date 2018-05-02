// @flow

let pressed = false;

const canvas : HTMLElement | null = document.getElementById('canvas');
const respect = canvas.clientWidth / canvas.clientHeight;
canvas.width = 150;
canvas.height = canvas.width / respect;
let pen = null;
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
    
    pen.reformat(ctx);
    localStorage.setItem('points', JSON.stringify(pen.list));
  });
  canvas.addEventListener('mousemove',  (e: MouseEvent) => {
    if (pressed) {
      pen.add({
        x: e.pageX - e.target.offsetLeft,
        y: e.pageY - e.target.offsetTop
      });
      pen.draw(ctx);
    }
  });
}

const recognition: HTMLElement = document.getElementById('recognition');

recognition.addEventListener('click', () => {
  const imageData: ImageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  console.log(imageData);
  const blob = new Blob(imageData.data);
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3000', true);
  xhr.send(blob);
  xhr.addEventListener('readystatechange', console.log);

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
});