# **Shapebox Readme**

## Prerequisites

  * A database to pull data from and save data to
    * The backend code for a database compatible with these files and storing data on a MongoDB server can be found at https://github.com/jsuskin/shapebox

## How to Use

  * Select a shape from the dropdown at the top of the page populated with options from a database running on a server
  * Select a default shape (ellipse, rectangle, triangle, quadrilateral) from the dropdown at the bottom of the page, to the left of the name input
  * Generate a shape to resize, reposition, and recolor by selecting a shape from either of the two dropdowns
    * When a shape is displayed on the canvas, a series of number inputs will appear just below the rgb sliders. View the dimensions each input represents by removing the value held in the input to reveal its placeholder value
  * Readjust the color (red, green, blue) settings by adjusting either of the three sliders directly beneath the canvas
  * View the red, green, and blue values in the display on the left side of the canvas when a shape is displayed
  * Readjust the dimensions of an ellipse, a rectangle, a triangle, or a quadrilateral in the following ways:
    * **Ellipse or Rectangle**
      * Define custom values for the width and height by changing the values in the last two dropdowns in the row just beneath the rgb sliders 
      * Readjust the width and the height of the shape equally by scrolling (ex. moving the mouse wheel)
    * **Triangle**
      * Define custom values for the x1, y1, x2, y2, x3, and y3 values by changing the values in any of the six inputs just below the rgb sliders
      * Move triangle points anywhere on the canvas by clicking and dragging a point
    * **Quadrilateral**
      * Define custom values for the x1, y1, x2, y2, x3, y3, x4, and y4 values by changing the values in any of the six inputs just below the rgb sliders
      * Dove quadrilateral points anywhere on the canvas by clicking and dragging a point
  * Readjust the positioning of an ellipse, a rectangle, or a triangle in the following ways:
    * **Ellipse, Rectangle**
      * Define custom values for the X- and Y-positioning by changing the values in the first two dropdowns in the row just beneath the rgb sliders
      * Move the shape anywhere on the canvas by clicking on the canvas
      * Move the shape anywhere on the canvas by clicking and dragging on the canvas
    * **Triangle**
      * Move the shape anywhere on the canvas by holding down the `ctrl` key and clicking on the canvas
      * Move the shape anywhere on the canvas by holding down the `ctrl` key and clicking and dragging on the canvas
  * Save a shape to database by providing a name in the `Name` input and pressing the `Save Shape` button
  * Update an existing shape in database by pressing the `Update Shape` buttons