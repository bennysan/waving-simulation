import { Vector2 } from "./src/helpers.js";

class Chain {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.length = 30;
    this.segments = [];
    this.delta = 0;
    this.frequancy = 0.05;
    this.amplitude = 20;
    this.rotation = 0;
    this.position = new Vector2(0, 0);
  }
  build() {
    this.segments = [];
    this.ctx.save();
    this.ctx.translate(this.position.x, this.position.y);
    for (var i = 0; i <= this.length; i++) {
      this.rotation = Math.sin(this.delta - i / this.length) * this.amplitude;
      this.segments.push(
        new Segment(
          this.canvas,
          this.ctx,
          this.segments[i - 1],
          this.rotation,
          `rgba(28,252,252, ${parseFloat((1 / this.length) * i)})`
        )
      );
    }
    this.segments.forEach((segment) => {
      segment.show();
    });

    this.ctx.restore();
  }

  update() {
    this.delta += this.frequancy;
    this.build();
  }

  setPos(position) {
    this.position = position;
  }
}

class Segment {
  constructor(canvas, ctx, parent, rotation = 0, color = "red") {
    this.canvas = canvas;
    this.ctx = ctx;
    this.parent = parent ? parent : null;
    this.position = parent
      ? new Vector2(
          parent.position.x +
            Math.sin(this.parent.rotation) * this.parent.scale.y,
          parent.position.y -
            +Math.cos(this.parent.rotation) * this.parent.scale.y +
            0.2
        )
      : new Vector2(this.canvas.width / 2, this.canvas.height / 2);
    this.rotation = (rotation * Math.PI) / 180;
    this.scale = new Vector2(10, 3);
    this.origin = new Vector2(-this.scale.x / 2, -this.scale.y);
    this.color = color;
  }

  show() {
    this.ctx.save();
    this.ctx.translate(this.position.x, this.position.y);
    this.ctx.rotate(this.rotation);
    this.ctx.save();
    this.ctx.translate(this.origin.x, this.origin.y);
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(0, 0, this.scale.x, this.scale.y);
    this.ctx.restore();
    this.ctx.restore();
  }
}

class Simulation {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.grid = {
      show: false,
      scale: 20,
      resolution: 0,
    };
    this.chains = [];
  }

  initialize() {
    const root = document.getElementById("root");
    root.appendChild(this.canvas);

    this.resize();

    window.addEventListener("resize", () => {
      this.resize();
    });

    this.grid.resolution = this.canvas.width / 2 / this.grid.scale;

    for (var i = 0; i < 10; i++) {
      this.chains.push(new Chain(this.canvas, this.ctx));
      this.chains[i].setPos(new Vector2(this.grid.scale * i));
    }

    if (this.grid.show) {
      this.buildGrid();
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (this.grid.show) {
      this.buildGrid();
    }
  }

  buildGrid() {
    this.ctx.strokeStyle = "#ddd";
    this.ctx.beginPath();
    //  Grid +x axis
    for (let x = 0; x < this.canvas.width / 2; x++) {
      this.ctx.moveTo(this.grid.resolution * x + this.canvas.width / 2, 0);
      this.ctx.lineTo(
        this.grid.resolution * x + this.canvas.width / 2,
        this.canvas.height
      );
    }

    //  Grid -x axis
    for (let x = 0; x > -this.canvas.width / 2; x--) {
      this.ctx.moveTo(this.grid.resolution * x + this.canvas.width / 2, 0);
      this.ctx.lineTo(
        this.grid.resolution * x + this.canvas.width / 2,
        this.canvas.height
      );
    }

    //  Grid +y axis
    for (let y = 0; y < this.canvas.height / 2; y++) {
      this.ctx.moveTo(0, this.grid.resolution * y + this.canvas.height / 2);
      this.ctx.lineTo(
        this.canvas.width,
        this.grid.resolution * y + this.canvas.height / 2
      );
    }

    //  Grid -y axis
    for (let y = 0; y > -this.canvas.height / 2; y--) {
      this.ctx.moveTo(0, this.grid.resolution * y + this.canvas.height / 2);
      this.ctx.lineTo(
        this.canvas.width,
        this.grid.resolution * y + this.canvas.height / 2
      );
    }
    this.ctx.closePath();
    this.ctx.stroke();
    this.gridAxes();
  }

  gridAxes() {
    this.ctx.strokeStyle = "red";
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2, 0);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.strokeStyle = "green";
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvas.height / 2);
    this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  update() {
    this.ctx.fillStyle = "#222";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.grid.show) {
      this.buildGrid();
    }
    this.chains.forEach((chain) => chain.update());
  }
}

const sim = new Simulation();
sim.initialize();

setInterval(() => {
  sim.update();
}, 33);
