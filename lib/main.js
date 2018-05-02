'use strict';

var pressed = false;

var canvas = document.getElementById('canvas');
var respect = canvas.clientWidth / canvas.clientHeight;
canvas.width = 150;
canvas.height = canvas.width / respect;
var pen = null;
var ctx = canvas.getContext('2d');
if (canvas) {
  canvas.addEventListener('mousedown', function (e) {
    pressed = true;
    pen = new Pen();
    pen.add({
      x: e.pageX - e.target.offsetLeft,
      y: e.pageY - e.target.offsetTop
    });
  });
  document.addEventListener('mouseup', function () {
    pressed = false;

    pen.reformat(ctx);
    localStorage.setItem('points', JSON.stringify(pen.list));
  });
  canvas.addEventListener('mousemove', function (e) {
    if (pressed) {
      pen.add({
        x: e.pageX - e.target.offsetLeft,
        y: e.pageY - e.target.offsetTop
      });
      pen.draw(ctx);
    }
  });
}

var recognition = document.getElementById('recognition');

var sendImage = function sendImage() {
  var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  fetch('http://localhost:3000', {
    method: 'POST',
    body: ctx.canvas.toDataURL()
  }).then(console.log);

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

recognition.addEventListener('click', sendImage);
window.addEventListener('keyup', function (e) {
  if (e.keyCode === 13) {
    sendImage();
  }
});