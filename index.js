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
    ww = window.innerWidth, 
    wh = window.innerHeight;

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

  // if(currentColor) color(currentColor[0], currentColor[1], currentColor[2])
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
  // currentColor = /*currentShape ? currentShape.color.slice() :*/ [ random(255), random(255), random(255) ];

  // if selecting a shape already in db
  if(this.id() === 'saved-shapes') {
    const id = savedShapes.find(shape => shape[0] === this.value())[1];
    fetchShape(url, id);
  } else if( ['Ellipse', 'Rectangle'].indexOf(this.value()) > -1 ) {
    const currentDims =
      currentShape && currentShape.dims.length === 4
        ? currentShape.dims.slice()
        : defaultDims(width, height);

    currentShape = new Shape( { name: "", type: this.value() }, currentDims, currentColor );

  } else if(this.value() === 'Triangle') {
    currentShape = new Shape( { name: "", type: this.value() }, triDefaultDims(width, height), currentColor );
  } else if(this.value() === 'Quadrilateral') {
    currentShape = new Shape( { name: "", type: this.value() }, quadDefaultDims(width, height), currentColor );
  }
  setInputs();
}

function setInputs() {
  dimsDiv.html("");

  if(currentShape) {
    currentShape.dims.forEach((x, idx) => {
      const input = createInput();
  
      if (currentShape.type === "Triangle") {
        inputLabels = ["x1", "y1", "x2", "y2", "x3", "y3"];
      }
      if (currentShape.type === "Quadrilateral") {
        inputLabels = ["x1", "y1", "x2", "y2", "x3", "y3", "x4", "y4"];
      }
      if(currentShape.type === 'Ellipse' || currentShape.type === 'Rectangle') {
        inputLabels = ["posX", "posY", "width", "height"];
      }
  
      input.attribute("placeholder", inputLabels[idx]);
      input.size((width / inputLabels.length) - 35);
      input.value(x);
      input.changed(() => {
        currentShape.dims[idx] = input.value();
      });
      
      dimsDiv.child(input);
  
      rgbSliders.forEach((s, idx) => {
        s.value(currentColor[idx])
      })
    });
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