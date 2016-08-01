import { createChildCanvas } from './utils';

export const StarField = function(canvas) {
	this.parentCanvas = canvas;
  	this.background = '#251b4f';
}

StarField.prototype.init = function() {
	// Make a new one
  	this.el = createChildCanvas('star-field', this.parentCanvas, 2, this.background);

  	this.drawStarField(200)
}

StarField.prototype._drawStar = function (ctx) {
	var x = Math.random() * this.el.canvas.width;
	var y = Math.random() * this.el.canvas.height;
	var radius = Math.random() * 2;
	var brightness = random(80, 100) / 100;

    // start drawing the star
    ctx.beginPath();
    // set the brightness of the star
    ctx.globalAlpha = brightness;
    ctx.fillStyle = "#ffffff";
    // draw the star (an arc of radius 2 * pi)
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    // fill the star and stop drawing it
    ctx.fill();
    ctx.closePath();
}

StarField.prototype.drawStarField = function (total) {
	for (let i = 0; i <= total; i++) {
		this._drawStar(this.el.ctx)
	}
}

function random (min, max) {
  return Math.round((Math.random() * max - min) + min);
}