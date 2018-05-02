"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Douglas = function () {
  function Douglas(points) {
    _classCallCheck(this, Douglas);

    this.D = 500;
    this.points = [];

    this.points = points;
  }

  _createClass(Douglas, [{
    key: "compress",
    value: function compress(from, to) {
      var a = from.y - to.y;
      var b = from.x - to.x;
      var c = (from.y - to.y) * from.x - (from.x - to.x) * from.y;
      var shouldSwitch = false;
      var middle = null;
      var distances = [];
      var start = 1;
      var end = this.points.length - 1;
      var dmax = 0;
      var max = 0;

      if (end === start + 1) {
        return;
      }
      console.log(from, to);

      for (var i = start; i < end; i++) {
        var distance = Math.floor(Math.abs(a * this.points[i].x + b * this.points[i].y + c) / Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)));
        distances.push(distance);
      }
      console.log(distances);
      for (var j = 1; j < distances.length; j++) {
        if (distances[j] > dmax) {
          dmax = distances[j];
        }
      }
      console.log(dmax);
      if (dmax > this.D) {
        shouldSwitch = true;
      } else {
        shouldSwitch = false;
      }

      if (!shouldSwitch) {
        for (var _i = start + 1; _i < end; _i++) {
          this.points.splice(_i, 1);
        }
      } else {
        for (var _i2 = start + 1; _i2 < end; _i2++) {
          var _distance = Math.floor(Math.abs(a * this.points[_i2].x) + b * this.points[_i2].y + c) / Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

          if (_distance === dmax) {
            middle = this.points[_i2];
          }
        }

        if (middle) {
          this.compress(from, middle);
          this.compress(middle, to);
        }
      }
      console.log(this.points);
    }
  }]);

  return Douglas;
}();

var Pen = function () {
  function Pen() {
    _classCallCheck(this, Pen);

    this.list = [];
  }

  _createClass(Pen, [{
    key: "add",
    value: function add(point) {
      this.list.push(point);
    }
  }, {
    key: "setContextOptions",
    value: function setContextOptions(ctx) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      ctx.shadowOffsetX = options.shadowOffsetX;
      ctx.shadowOffsetY = options.shadowOffsetY;
      ctx.shadowBlur = options.shadowBlur;
      ctx.strokeStyle = options.strokeStyle;
      ctx.globalAlpha = options.opacity / 100;
      ctx.lineWidth = options.lineWidth || 2;

      return true;
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      var start = this.list[0];
      var len = this.list.length;
      ctx.save();
      this.setContextOptions(ctx);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      for (var i = 1; i < len; i++) {
        var point = this.list[i];
        ctx.lineTo(point.x, point.y);
      }

      ctx.stroke();
      ctx.restore();
    }
  }, {
    key: "reformat",
    value: function reformat(ctx) {
      var start = this.list[0];
      var end = this.list[this.list.length - 1];
      var douglas = new Douglas(this.list);
      douglas.compress(start, end);
      ctx.save();

      this.setContextOptions(ctx);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      for (var i = 1; i < douglas.points.length; i++) {
        var point = douglas.points[i];
        ctx.lineTo(point.x, point.y);
      }

      ctx.stroke();
      ctx.restore();
    }
  }]);

  return Pen;
}();