class Shape {
  constructor(shapeObj, dimsObj, colsObj) {
    this.id = shapeObj.id
    this.name = shapeObj.name;
    this.type = shapeObj.type;
    this.dims = [...dimsObj];
    this.color = [...colsObj];
    this.isBeingDragged = false;
    this.pointsBeingDragged = [];
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
  }

  setPos() {
    const findCenter = stmt =>
      this.dims.filter((x, idx) => stmt(idx)).reduce((a, b) => a + b) / 3;

    // Move Ellipse, Rectangle
    if (this.dims.length === 4) {
      this.dims[0] = mouseX;
      this.dims[1] = mouseY;
    // Move triangle when ctrl is pressed
    } else if(this.dims.length === 6 && keyIsDown(CONTROL)) {
      const ctrX = findCenter(idx => idx % 2 === 0),
        ctrY = findCenter(idx => idx % 2 !== 0);

      this.dims.forEach((d, idx, self) => {
        self[idx] = d - (idx % 2 === 0 ? ctrX - mouseX : ctrY - mouseY);
      });
    // Redfine dimensions of triangle/quadrilateral with canvas click
    } else {
      const [ xTarget, yTarget ] = [0, 1].map(num => this.dims.indexOf(closest(this.dims)[num]));
      const [ correspondingXValue, correspondingYValue ] = [yTarget - 1, xTarget + 1].map(idx => this.dims[idx]);

      const useXVal =
        Math.abs(this.dims[xTarget] - correspondingXValue) <
        Math.abs(this.dims[yTarget] - correspondingYValue);

        const setCoords = target => {
          const isX = target === "x";
          this.pointsBeingDragged = isX ? [xTarget, xTarget + 1] : [yTarget - 1, yTarget];
          this.dims[isX ? xTarget : yTarget - 1] = mouseX;
          this.dims[isX ? xTarget + 1 : yTarget] = mouseY;
        }

      if(!this.isBeingDragged) {
        useXVal ? setCoords('x') : setCoords('y');
      } else {
        this.dims[this.pointsBeingDragged[0]] = mouseX;
        this.dims[this.pointsBeingDragged[1]] = mouseY;
      }
    }

    setInputs();
  }

  // shrink/grow ellipse/rectangle
  changeSize(evt) {
    if(this.dims.length === 4)
      [2, 3].forEach(idx => {
        this.dims[idx] += evt.deltaY / 10;
      });
    if(this.dims.length === 6) {
      [0, 1, 2, 3, 4, 5].forEach(idx => {
        // change triangle size
      })
    }

    setInputs();
  }

  // DEFAULT DIMENSIONS

  static defaultDims(width, height) {
    return [width / 2, height / 2, 50, 50];
  }

  static triDefaultDims(width, height) {
    return [
      width / 2 - 40,
      height / 2 + 40,
      width / 2 - 40,
      height / 2 - 40,
      width / 2 + 40,
      height / 2 + 40
    ];
  }

  static quadDefaultDims(width, height) {
    return [
      width / 2 - 50,
      height / 2 + 50,
      width / 2 - 30,
      height / 2 - 40,
      width / 2 + 20,
      height / 2 - 60,
      width / 2 + 70,
      height / 2 + 40
    ];
  }
}
