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

function fetchShape(url, id) {
  fetch(`${url}/${id}`)
    .then(res => res.json())
    .then(shape => {
      currentShape = new Shape(
        { name: shape.name, type: shape.type },
        shape.dims,
        shape.color
      );
      setInputs();
    });
}

function postShape() {
  fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: nameInput.value(),
      type: currentShape.type,
      dims: [...currentShape.dims],
      color: [...currentShape.color]
    })
  });
}

// ELEMENT SETTINGS/ORGANIZATION

const createSavedShapesSelect = () => {
  const sel = createSelect();
  sel.show();
  sel.attribute("id", "saved-shapes");
  sel.style("width", "100%");
  sel.style("margin", "7.5px 0");
  sel.option("Select a Shape");
  fetchShapeNames();
  sel.changed(setShape);
  return sel;
}

const createDimsDiv = () => {
  const div = createDiv();
  div.show();
  div.style("display", "flex");
  div.style("justify-content", "space-around");
  div.style("padding", "7.5px 0");
  return div;
}

const createMiscDiv = () => {
  const div = createDiv();
  div.show();
  div.style("text-align", "center");
  return div;
}

const createRgbDiv = () => {
  const div = createDiv();
  div.style("display", "flex");
  div.style("justify-content", "space-around");
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
  sel.style("margin", "0 7.5px");
  sel.attribute("id", "type-select");
  ["Ellipse", "Rectangle", "Triangle", "Quadrilateral"].forEach(shape => sel.option(shape));
  sel.changed(setShape);
  return sel;
};

const createNameInput = () => {
  const input = createInput();
  input.style("margin", "0 7.5px");
  input.attribute("placeholder", "Name");
  return input;
}

const createSaveBtn = () => {
  const btn = createButton("Save Shape");
  btn.style("margin", "0 7.5px");
  btn.mousePressed(saveShape);
  return btn;
}

// DEFAULT DIMENSIONS

const defaultDims = (width, height) => [width / 2, height / 2, 50, 50];

const triDefaultDims = (width, height) => [
  width / 2 - 40,
  height / 2 + 40,
  width / 2 - 40,
  height / 2 - 40,
  width / 2 + 40,
  height / 2 + 40
];

const quadDefaultDims = (width, height) => [
  width / 2 - 50,
  height / 2 + 50,
  width / 2 - 30,
  height / 2 - 40,
  width / 2 + 20,
  height / 2 - 60,
  width / 2 + 70,
  height / 2 + 40
];