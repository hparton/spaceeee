export const createChildCanvas = function(id, parentCanvas, order, background) {
  	let canvas = document.createElement("canvas");
  	let parent = parentCanvas;
    let ctx = canvas.getContext("2d");

    canvas.id = id;

    // Make the height/width/position match the parents.
    canvas.width = parentCanvas.width;
  	canvas.height = parentCanvas.height;
  	canvas.style.position = 'absolute';
  	canvas.style.zIndex = order;
  	canvas.style.left = '0';
  	canvas.style.top = '0';

  	// Set z-index based on order.

  	if (background) {
	  	canvas.style.background = background;
  	}

  	parent.parentNode.insertBefore(canvas, parent)

  	return {
  		canvas: canvas,
  		ctx: ctx
  	}
}