class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.set = (vector) => {
      this.updateValue(vector);
    };
  }

  updateValue(vector = new vector2(0, 0)) {
    this.x = vector.x;
    this.y = vector.y;
  }
}

export { Vector2 };
