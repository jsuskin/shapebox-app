class Shape {
  constructor(shapeObj, dimsObj, colsObj) {
    this.name = shapeObj.name;
    this.type = shapeObj.type;
    this.dims = [...dimsObj];
    this.color = [...colsObj];
  }

  show() {
    const col = color(this.color[0], this.color[1], this.color[2]);

    if (this.type === "Ellipse")
      ellipse(this.dims[0], this.dims[1], this.dims[2], this.dims[3]);
    if (this.type === "Rectangle")
      rect(this.dims[0], this.dims[1], this.dims[2], this.dims[3]);
    if (this.type === "Triangle")
      triangle(
        this.dims[0],
        this.dims[1],
        this.dims[2],
        this.dims[3],
        this.dims[4],
        this.dims[5]
      );
    if (this.type === "Quadrilateral")
      quad(
        this.dims[0],
        this.dims[1],
        this.dims[2],
        this.dims[3],
        this.dims[4],
        this.dims[5],
        this.dims[6],
        this.dims[7]
      );

    noStroke();
    fill(col);

    // setInputs();
  }

  setPos() {
    const findCenter = stmt =>
      this.dims.filter((x, idx) => stmt(idx)).reduce((a, b) => a + b) / 3;

    if (this.dims.length === 4) {
      this.dims[0] = mouseX;
      this.dims[1] = mouseY;
    } else {
      const ctrX = findCenter(idx => idx % 2 === 0),
        ctrY = findCenter(idx => idx % 2 !== 0);

      this.dims.forEach((d, idx, self) => {
        self[idx] = d - (idx % 2 === 0 ? ctrX - mouseX : ctrY - mouseY);
      });
    }

    setInputs();
  }

  // shrink/grow ellipse/rectangle
  changeSize(evt) {
    if (this.dims.length === 4)
      [2, 3].forEach(idx => {
        this.dims[idx] += evt.deltaY / 10;
      });

    setInputs();
  }

  // setColor(evt) {
  //   console.log(evt.target)
  // }
}
