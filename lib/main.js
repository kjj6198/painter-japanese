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

recognition.addEventListener('click', function () {
  var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  console.log(imageData);
  var blob = new Blob(imageData.data);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3000');
  xhr.send(blob);
  xhr.addEventListener('readystatechange', console.log);

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
});