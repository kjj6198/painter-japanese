// @flow

type Point = {
  x: number,
  y: number,
};

interface Drawable {
  draw(ctx: CanvasRenderingContext2D) : void;
}

class Douglas {
  D: number = 500;
  points: Array<Point> = [];

  constructor(points: Array<Point>) {
    this.points = points;
  }
  
  compress(from: Point, to: Point): void {
    const a = from.y - to.y;
    const b = from.x - to.x;
    const c = (from.y - to.y) * from.x - (from.x - to.x) * from.y;
    let shouldSwitch: boolean = false;
    let middle: ?Point = null;
    const distances: Array<number> = [];
    const start = 1;
    const end = this.points.length - 1;
    let dmax = 0;
    let max = 0;
    
    if (end === start + 1) {
      return;
    }
    console.log(from, to);

    for (let i = start; i < end; i++) {      
      const distance = Math.floor(Math.abs(a * (this.points[i].x) + b * (this.points[i].y) + c) / Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)));
      distances.push(distance);
    }
    console.log(distances);
    for (let j = 1; j < distances.length; j++) {
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
      for (let i = start + 1; i < end; i++) {
        this.points.splice(i, 1);
      }
    } else {
      for (let i = start + 1; i < end; i++) {
        const distance = Math.floor(Math.abs(a * this.points[i].x) + b * (this.points[i].y) + c) / Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

        if (distance === dmax) {
          middle = this.points[i];
        }
      }

      if (middle) {
        this.compress(from, middle);
        this.compress(middle, to);
      }
    }
    console.log(this.points);
  }
}





class Pen implements Drawable {
  list: Array<Point> = [];

  add(point: Point) {
    this.list.push(point);
  }

  setContextOptions(ctx: CanvasRenderingContext2D, options = {}) : boolean {
    ctx.shadowOffsetX = options.shadowOffsetX;
    ctx.shadowOffsetY = options.shadowOffsetY;
    ctx.shadowBlur = options.shadowBlur;
    ctx.strokeStyle = options.strokeStyle;
    ctx.globalAlpha = options.opacity / 100;
    ctx.lineWidth = options.lineWidth || 2;

    return true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const start = this.list[0];
    const len = this.list.length;
    ctx.save()
    this.setContextOptions(ctx);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    for (let i = 1; i < len; i++) {
      const point : Point = this.list[i];
      ctx.lineTo(point.x, point.y);
    }

    ctx.stroke();
    ctx.restore();
  }

  reformat(ctx: CanvasRenderingContext2D) {
    const start: Point = this.list[0];
    const end: Point = this.list[this.list.length - 1];
    const douglas = new Douglas(this.list);
    douglas.compress(start, end);
    ctx.save();
    
    this.setContextOptions(ctx);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    for (let i = 1; i < douglas.points.length; i++) {
      const point : Point = douglas.points[i];
      ctx.lineTo(point.x, point.y);
    }

    ctx.stroke();
    ctx.restore();
  }

}