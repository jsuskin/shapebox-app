class Shape {
  constructor(shapeObj, dimsObj, colsObj) {
    this.id = shapeObj.id
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
  }

  setPos() {
    const findCenter = stmt =>
      this.dims.filter((x, idx) => stmt(idx)).reduce((a, b) => a + b) / 3;

    // Ellipse, Rectangle
    if (this.dims.length === 4) {
      this.dims[0] = mouseX;
      this.dims[1] = mouseY;
    // Triangle
    } else if(this.dims.length === 6) {
      const ctrX = findCenter(idx => idx % 2 === 0),
        ctrY = findCenter(idx => idx % 2 !== 0);

      this.dims.forEach((d, idx, self) => {
        self[idx] = d - (idx % 2 === 0 ? ctrX - mouseX : ctrY - mouseY);
      });
    // Quadrilateral
    } else {
      const findClosestAlongAxis = axis => {
        const counts =
          axis === "x"
            ? this.dims.filter((x, idx) => idx % 2 === 0)
            : this.dims.filter((x, idx) => idx % 2 !== 0);
        const goal = axis === "x" ? mouseX : mouseY;

        const closest = counts.reduce(function(prev, curr) {
          return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
        });
        
        return closest;
      }

      const closest = ['x', 'y'].map(axis => findClosestAlongAxis(axis));
      const [ xTarget, yTarget ] = [0, 1].map(num => this.dims.indexOf(closest[num]));
      const [ correspondingXValue, correspondingYValue ] = [xTarget + 1, yTarget - 1].map(idx => this.dims[idx]);
      const useXVal =
        this.dims[xTarget] - correspondingXValue <
        this.dims[yTarget] - correspondingYValue;

      if(useXVal) {
        this.dims[xTarget] = mouseX;
        this.dims[xTarget + 1] = mouseY;
      } else {
        this.dims[yTarget] = mouseY;
        this.dims[yTarget - 1] = mouseX;
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
