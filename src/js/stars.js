// Extras - Generate less stars near the sun.
//
// if (detectedCloseToSunSomehow) {
// 	 if (RandomChance(INCREASED CHANCE OF FAILURE CLOSER TO SUN)) {
// 	 	drawStar
// 	 } else {
//		// We are far enough away that its a 100% chance so skip checking anyway.
//		drawStar
// 	 }
// }

export const StarField = function(canvas) {
	this.parentCanvas = canvas;
  	this.background = '#251b4f';
}

StarField.prototype.init = function() {

	// Make a new one
  	this.canvas = document.createElement("canvas");
    this.canvas.id = 'star-field';
    this.ctx = this.canvas.getContext("2d");

    // Make the height/width/position match the parents.
    this.ctx.canvas.width = this.parentCanvas.width;
  	this.ctx.canvas.height = this.parentCanvas.height;
  	this.canvas.position = 'absolute';
  	this.canvas.style.left = '0';
  	this.canvas.style.top = '0';


  	this.canvas.style.background = this.background;

  	this.parentCanvas.parentNode.insertBefore(this.canvas, this.parentCanvas)

  	this.drawStarField(200)
  	//this.drawStarField(this.width, this.height);
}

StarField.prototype.drawStar = function (ctx) {
	var x = Math.random() * this.canvas.width;
	var y = Math.random() * this.canvas.height;
	var radius = Math.random() * 2;
	var brightness = random(80, 100) / 100;

    // start drawing the star
    ctx.beginPath();
    // set the brightness of the star
    ctx.globalAlpha = brightness;
    // choose a random star colour
    ctx.fillStyle = "#ffffff";
    // draw the star (an arc of radius 2 * pi)
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    // fill the star and stop drawing it
    ctx.fill();
    ctx.closePath();
}

StarField.prototype.drawStarField = function (total) {
	for (let i = 0; i <= total; i++) {
		this.drawStar(this.ctx)
	}
}

function random (min, max) {
  return Math.round((Math.random() * max - min) + min);
}