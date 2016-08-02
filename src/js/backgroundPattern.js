/**
 * Generate a line of curved columns
 *
 * @param {Object} canvas - The target canvas element to draw the line on.
 * @param {integer} x - x offset to start the line at.
 * @param {integer} y - y offset to start the line at.
 * @param {integer} width - width of the line.
 * @param {integer} h - Max height of the columns.
 * @param {integer} radius - radius of each of the column corners (this determines the width of each column).
 * @param {string} width - fill color for the row.
 */

export const genLine = function (canvas, x, y, width, h, radius, fill) {
  var context = canvas.getContext("2d");

  var startingPoint = {x: x, y: y};
  var currentPoint = startingPoint;
  var height = width;
  var baseline = y;

  var steps = []
  var columns = []

  // Calc how many columns we need to draw based on the container / colWidth
  var loops = Math.ceil(width / (radius * 4) + 1);

  // Generate all the possible steps each of the columns can have for a max/min height
  for (let i = 0; i < h; i+=(h / 4)) {
  	steps.push((h / 4) * i);
  }

  // Generate the columns with a top point above the baseline and a bottom below the baseline.
  // This could be reworked to just make sure the bottom is lower than the top and the next top point
  // is higher than the last bottom.
  for (let i = 0; i < loops; i++) {
  	columns.push({
    	top: steps[Math.floor(Math.random() * steps.length)],
      bottom: -steps[Math.floor(Math.random() * steps.length)]
    });
  }

  // Start our path, stoke styles are for debugging.
  context.beginPath();
  context.strokeStyle = "green";
  context.lineWidth = "4";

  // Move to a point way below the starting point so when we fill the object it doesn't clip in an odd way.
  context.moveTo(startingPoint.x, startingPoint.y + (height * 10))

  for (var i = 0; i < loops; i++) {
  	// Pass the current x/y co-ords from the previous loop.
    var posY = currentPoint.y;
    var posX = currentPoint.x;

    // Highest and lowest points defined in the columns array.
    var colTop = baseline + -columns[i].top
    var colBottom = baseline + -columns[i].bottom

		//                   _
    // Draw the column _| |
    //                    |_ with rounded corners.
    context.quadraticCurveTo(posX, posY, posX, posY - radius);
    context.lineTo(posX, colTop )
    context.quadraticCurveTo(posX, colTop - radius, posX + radius, colTop - radius);
    context.quadraticCurveTo(posX + radius * 2, colTop - radius, posX + radius * 2, colTop);
    context.lineTo(posX + radius * 2, colBottom - radius)

    if (i !== loops - 1) {
    		// We don't need the little flick on the last column
        context.quadraticCurveTo(posX + radius * 2, colBottom, posX + radius * 3, colBottom);
    }

    // Pass through the current x offset and where the last column finished drawing.
    currentPoint.x = posX + (radius * 4);
    currentPoint.y = colBottom;
	}

  // Draw another point low down to finish the shape.
  context.lineTo(currentPoint.x - radius * 2, currentPoint.y + (height * 10) )

  //context.stroke();

  // Fill the shape in.
  context.fillStyle = fill;
  context.fill();
}

/**
 * Generate the background for the planet.
 * @param {integer} width - The width of the canvas element created.
 *
 * @param {Object[]} texture - An array of each step of the planets texture
 * @param {integer} texture[].offset - Offset from top for the current step.
 * @param {integer} texture[].height - Height of the columns on the current step.
 * @param {integer} texture[].width - Width of the columns on the current step.
 * @param {string} texture[].fill - Background color of the columns on the current step.
 *
 * @param {integer} rotate - Rotate the background by x angle.
 *
 * var texture = [
 *   {
 *    offset: 0,
 *    height: 15,
 *    width: 10,
 *    fill: '#352460'
 *   }
 *   {
 *    offset: 20,
 *    height: 15,
 *    width: 10,
 *    fill: '#352460'
 *   }
 * ]
 */

// TODO: Accept a background color option so we don't waste the first genLine adding a background

export const generatePlanetTexture = function(width, texture, rotate) {
  var canvasTemp = document.createElement("canvas"),
      tCtx = canvasTemp.getContext("2d");

      canvasTemp.width = canvasTemp.height = width;
      tCtx.beginPath();

      tCtx.arc(canvasTemp.width / 2, canvasTemp.height / 2, canvasTemp.width / 2, 0, Math.PI*2, true)

      // TODO:
      // Replace clip with global composite operation
      // should fix jagged lines
      //
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation

      tCtx.save(); // Save the context before clipping
      tCtx.clip(); // Clip to whatever path is on the context

      if (rotate) {
        // Move to the center of the image
        tCtx.translate(canvasTemp.width / 2, canvasTemp.height / 2);
        // Rotate it
        tCtx.rotate(rotate);
        // Move back.
        tCtx.translate(-canvasTemp.width/2, -canvasTemp.width/2);
      }

      texture.forEach(function(step) {
        genLine(canvasTemp, 0, step.offset, canvasTemp.width, step.height, step.width, step.fill)
      });

      tCtx.restore(); // Restore the context after clipping

      //This is failing in Firefox + Chrome ?
      //var imageObj = new Image();
      //imageObj.src = tCtx.canvas.toDataURL("image/png");

      return tCtx.canvas
}
