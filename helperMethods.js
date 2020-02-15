// ELEMENT SETTINGS/ORGANIZATION

const createSavedShapesSelect = () => {
  const sel = createSelect();
  sel.show();
  sel.changed(setShape);
  sel.attribute("id", "saved-shapes");
  sel.class("full-width with-pad");

  sel.option("Saved Shapes");
  sel.selected("Saved Shapes");
  const options = selectAll('option', '#saved-shapes');
  options[0].elt.disabled = true;

  fetchShapeNames();
  
  return sel;
}

const createDivWithClassName = className => {
  const div = createDiv();
  div.show();
  div.class(className);
  return div;
}

const createRgbDiv = () => {
  const div = createDiv();
  div.class("flex-space-around");
  return div;
}

const setSliders = (rgbDiv, width, setColor) => (s, idx, self) => {
  self[idx] = createSlider(0, 255, 0);
  // self[idx].value(currentColor[idx]);
  self[idx].parent(rgbDiv);
  self[idx].attribute("id", `slider-${idx}`);
  self[idx].size(width / 3 - 15);
  self[idx].changed(setColor);
};

const setTypeSelect = () => {
  const sel = createSelect();
  sel.attribute("id", "type-select");
  sel.class("with-margin");
  sel.option("Select Shape");
  sel.selected("Select Shape");
  const options = selectAll("option", "#type-select");
  options[0].elt.disabled = true;
  ["Ellipse", "Rectangle", "Triangle", "Quadrilateral"].forEach(shape => sel.option(shape));
  sel.changed(setShape);
  return sel;
};

const createNameInput = () => {
  const input = createInput();
  input.class("with-margin");
  input.attribute("placeholder", "Name");
  return input;
}

const createSaveBtn = () => {
  const btn = createButton("Save Shape");
  btn.class("with-margin");
  btn.mousePressed(saveShape);
  return btn;
}

const createUpdateBtn = () => {
  const btn = createButton("Update Shape");
  btn.class("with-margin");
  btn.mousePressed(updateShape);
  return btn;
}

const displayShape = (type, dims) => new Shape( { name: "", type: type }, dims, currentColor );

const setInputLabels = () => {
  if (currentShape.type === "Triangle") {
    return ["x1", "y1", "x2", "y2", "x3", "y3"];
  }
  if (currentShape.type === "Quadrilateral") {
    return ["x1", "y1", "x2", "y2", "x3", "y3", "x4", "y4"];
  }
  if (["Ellipse", "Rectangle"].indexOf(currentShape.type) > -1) {
    return ["posX", "posY", "width", "height"];
  }
}

const setInput = (x, idx) => {
  const input = createInput();
  input.attribute("placeholder", inputLabels[idx]);
  input.size(width / inputLabels.length - 35);
  input.value(x);
  input.changed(() => {
    currentShape.dims[idx] = +input.value();
  });
  return input;
}

const setInputAndLabels = (x, idx) => {
  inputLabels = setInputLabels();
  const input = setInput(x, idx);
  dimsDiv.child(input);
  rgbSliders.forEach((s, idx) => {
    s.value(currentColor[idx]);
  });
};

const setInputs = () => {
  dimsDiv.html("");
  if (currentShape) {
    currentShape.dims.forEach(setInputAndLabels);
  }
}

const setCurrentShape = (numDims, defDims, val) => {
  const currentDims =
    currentShape && currentShape.dims.length === numDims
      ? currentShape.dims.slice()
      : defDims;
  return displayShape(val, currentDims);
};

const findClosestAlongAxis = (arr, axis) => {
  const counts =
    axis === "x"
      ? arr.filter((x, idx) => idx % 2 === 0)
      : arr.filter((x, idx) => idx % 2 !== 0);
  const goal = axis === "x" ? mouseX : mouseY;

  const closest = counts.reduce(function(prev, curr) {
    return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
  });

  return closest;
};

const closest = arr => ["x", "y"].map(axis => findClosestAlongAxis(arr, axis));

// FETCHES

// add saved shape names to select
function fetchShapeNames() {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      data
        .sort((a, b) => a.name < b.name ? -1 : b.name < a.name ? 1 : 0)
        .forEach(shape => {
          savedShapesSelect.option(shape.name);
          savedShapes.push([shape.name, shape._id]);
        });
    });
}

// GET shape to display
function fetchShape(url, id) {
  fetch(`${url}/${id}`)
    .then(res => res.json())
    .then(shape => {
      currentShape = new Shape(
        { name: shape.name, type: shape.type, id: shape._id },
        shape.dims,
        shape.color
      );
      setInputs();
    });
}

// POST/PUT reqs
function postShape(path, method, name) {
  fetch(path, {
    method: method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      type: currentShape.type,
      dims: [...currentShape.dims],
      color: [...currentShape.color]
    })
  });
}