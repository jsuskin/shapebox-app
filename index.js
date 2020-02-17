let canvas,
    infoDiv,
    appTitle,
    colorDisplay,
    currentShape, 
    dimsDiv,
    inputLabels,
    typeSelect,
    rgbDiv,
    currentColor,
    miscDiv,
    nameInput, 
    savedShapesSelect, 
    saveBtn,
    updateBtn,
    // set initial height and width of window
    ww = window.innerWidth, wh = window.innerHeight;
// redSlider, greenSlider, blueSlider
const rgbSliders = Array.from(Array(3));
const savedShapes = [];
const url = 'http://localhost:4000/shapes';

function setup() {
  // saved shapes dropdown
  savedShapesSelect = createSavedShapesSelect();

  infoDiv = createInfoDiv();
  // canvas
  textAlign(CENTER);
  canvas = createCanvas(ww - 15, wh * 4 / 5);
  canvas.mousePressed(() => currentShape ? currentShape.setPos() : null);
  // random initial color
  currentColor = [random(255), random(255), random(255)];
  // red green blue slider controls
  rgbDiv = createRgbDiv();
  rgbSliders.forEach(setSliders(rgbDiv, width, setColor));
  // div to hold (4-8) shape dimension inputs
  dimsDiv = createDivWithClassName("flex-space-around with-pad");
  // div holds typeSelect, nameInput, saveBtn
  miscDiv = createDivWithClassName("textalign-center");
  // select a type for basic shape
  typeSelect = setTypeSelect();
  // name shape to save
  nameInput = createNameInput();
  // save current shape
  saveBtn = createSaveBtn();
  updateBtn = createUpdateBtn();

  miscDiv.child(typeSelect);
  miscDiv.child(nameInput);
  miscDiv.child(saveBtn);
  miscDiv.child(updateBtn);
}

function draw() {
  canvas.clear();
  background('#f2f9f2');
  rectMode(CENTER);

  if(currentShape) {
    currentShape.isBeingDragged = false;
    currentShape.color = [
      rgbSliders[0].value(),
      rgbSliders[1].value(),
      rgbSliders[2].value()
    ];
    currentShape.show();

    setInfoDisplay();
  }
}

// move shape
function mouseDragged() {
  if (currentShape && mouseY < height && mouseY > 0) {
    currentShape.isBeingDragged = true;
    currentShape.setPos();
  }
}

// shrink/grow shape
function mouseWheel(evt) {
  if (currentShape && mouseY < height) currentShape.changeSize(evt);
  return false;
}

function setShape() {
  // if selecting a shape already in db
  if(this.id() === 'saved-shapes') {
    const id = savedShapes.find(shape => shape[0] === this.value())[1];
    fetchShape(url, id);
  // select default ellipse/rectangle
  } else if( ['Ellipse', 'Rectangle'].indexOf(this.value()) > -1 ) {
    currentShape = setCurrentShape(4, Shape.defaultDims(width, height), this.value());
  // select default triangle
  } else if(this.value() === 'Triangle') {
    currentShape = setCurrentShape(6, Shape.triDefaultDims(width, height), this.value());
  // select default quad
  } else if(this.value() === 'Quadrilateral') {
    currentShape = setCurrentShape(8, Shape.quadDefaultDims(width, height), this.value());
  }
  setInputs();
}

function setColor(evt) {
  const rgbIndex = +evt.target.id.slice(-1);
  currentColor[rgbIndex] = rgbSliders[rgbIndex].value();
}

function saveShape() {
  if(nameInput.value()) {
    postShape(url, "POST", nameInput.value()).then(res => res.json()).then(data => {
      savedShapesSelect.option(data.name);
      savedShapes.push([data.name, data.id]);
    });
  } else {
    console.log("Enter Name");
  }
}

function updateShape() {
  if(currentShape.id) {
    postShape(`${url}/${currentShape.id}`, "PUT", currentShape.name);
  } else {
    console.log("Shape not in database. Give this shape a name and save it if you want to keep it.")
  }
}