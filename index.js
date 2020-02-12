let canvas, 
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
    // set initial height and width of window
    ww = window.innerWidth, wh = window.innerHeight;
// redSlider, greenSlider, blueSlider
const rgbSliders = Array.from(Array(3));
const savedShapes = [];
const url = 'http://localhost:4000/shapes';

function setup() {
  // saved shapes dropdown
  savedShapesSelect = createSavedShapesSelect();
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
  dimsDiv = createDimsDiv();
  // div holds typeSelect, nameInput, saveBtn
  miscDiv = createMiscDiv();
  // select a type for basic shape
  typeSelect = setTypeSelect();
  // name shape to save
  nameInput = createNameInput();
  // save current shape
  saveBtn = createSaveBtn();

  miscDiv.child(typeSelect);
  miscDiv.child(nameInput);
  miscDiv.child(saveBtn);
}

function draw() {
  canvas.clear();
  background(222);
  rectMode(CENTER);

  if(currentShape) currentShape.show();
}

// move shape
function mouseDragged() {
  if (currentShape && mouseY < height && mouseY > 0) currentShape.setPos();
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
    currentShape = setCurrentShape(4, defaultDims(width, height), this.value());
  // select default triangle
  } else if(this.value() === 'Triangle') {
    currentShape = setCurrentShape(6, triDefaultDims(width, height), this.value());
  // select default quad
  } else if(this.value() === 'Quadrilateral') {
    currentShape = setCurrentShape(8, quadDefaultDims(width, height), this.value());
  }
  setInputs();
}

function setInputs() {
  dimsDiv.html("");
  if(currentShape) {
    currentShape.dims.forEach(setInputAndLabels);
  }
}

function setColor(evt) {
  const rgbIndex = +evt.target.id.slice(-1);
  currentColor[rgbIndex] = rgbSliders[rgbIndex].value();
  currentShape.color = [ ...currentColor ];
}

function saveShape() {
  if(nameInput.value()) {
    postShape();
  } else {
    console.log('Enter Name');
  }
}