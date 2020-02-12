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
  savedShapesSelect = createSelect();
  savedShapesSelect.show();
  savedShapesSelect.attribute('id', 'saved-shapes');
  savedShapesSelect.style('width', '100%');
  savedShapesSelect.style('margin', '7.5px 0');
  savedShapesSelect.option('Select a Shape');
  fetchShapeNames();
  savedShapesSelect.changed(setShape);

  // canvas
  textAlign(CENTER);
  canvas = createCanvas(ww - 15, wh * 4 / 5);
  canvas.mousePressed(() => currentShape ? currentShape.setPos() : null);

  currentColor = [random(255), random(255), random(255)];

  // red green blue slider controls
  rgbDiv = createDiv();
  rgbDiv.style('display', 'flex');
  rgbDiv.style('justify-content', 'space-around');

  rgbSliders.forEach((s, idx, self) => {
    self[idx] = createSlider(0, 255, 0);
    // self[idx].value(currentColor[idx]);
    self[idx].parent(rgbDiv);
    self[idx].attribute('id', `slider-${idx}`);
    self[idx].size((width / 3) - 15);
    self[idx].changed(setColor);
  });

  // div to hold shape dimension inputs
  dimsDiv = createDiv();
  dimsDiv.show();
  dimsDiv.style('display', 'flex');
  dimsDiv.style('justify-content', 'space-around');
  dimsDiv.style('padding', '7.5px 0');

  // div holds typeSelect, nameInput, saveBtn
  miscDiv = createDiv();
  miscDiv.show();
  miscDiv.style('text-align', 'center');

  // select a type for basic shape
  typeSelect = createSelect();
  typeSelect.style('margin', '0 7.5px');
  typeSelect.attribute('id', 'type-select');
  typeSelect.option('Ellipse');
  typeSelect.option('Rectangle');
  typeSelect.option('Triangle');
  typeSelect.option('Quadrilateral');
  typeSelect.changed(setShape);
  
  // name shape to save
  nameInput = createInput();
  nameInput.style('margin', '0 7.5px');
  nameInput.attribute('placeholder', 'Name');
  
  // save current shape
  saveBtn = createButton('Save Shape');
  saveBtn.style('margin', '0 7.5px');
  saveBtn.mousePressed(saveShape);

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

// add saved shape names to select
function fetchShapeNames() {
  fetch(url).then(res => res.json()).then(data => {
    data.forEach(shape => {
      savedShapesSelect.option(shape.name);
      savedShapes.push([shape.name, shape._id]);
    });
  });
}

function setShape() {
  // currentColor = /*currentShape ? currentShape.color.slice() :*/ [ random(255), random(255), random(255) ];

  // if selecting a shape already in db
  if(this.id() === 'saved-shapes') {
    const id = savedShapes.find(shape => shape[0] === this.value())[1];

    fetch(`${url}/${id}`)
      .then(res => res.json())
      .then(shape => {
        currentShape = new Shape({ name: shape.name, type: shape.type }, shape.dims, shape.color);
        setInputs();
      });
      
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
  // const [ r, g, b ] = currentColor;

  currentColor[rgbIndex] = rgbSliders[rgbIndex].value();
  currentShape.color = [ ...currentColor ];
}

function saveShape() {
  if(nameInput.value()) {
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: nameInput.value(),
        type: currentShape.type,
        dims: [ ...currentShape.dims ],
        color: [ ...currentShape.color ]
      })
    });
  } else {
    console.log('Enter Name');
  }
}