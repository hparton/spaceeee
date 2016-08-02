import { createChildCanvas } from './utils';

export const StarField = function(canvas, background) {
	this.parentCanvas = canvas;
  	this.background = background;
}

StarField.prototype.init = function() {
	// Make a new canvas
  	this.el = createChildCanvas('star-field', this.parentCanvas, -3, this.background);
  	this.drawStarField(200)
}

StarField.prototype._drawStar = function (ctx) {
	var x = Math.random() * this.el.canvas.width;
	var y = Math.random() * this.el.canvas.height;
	var radius = Math.random() * 2;
	var brightness = random(80, 100) / 100;

    ctx.beginPath();
    // set the brightness of the star
    ctx.globalAlpha = brightness;
    ctx.fillStyle = "#ffffff";
    // draw the star
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    // fill the star
    ctx.fill();
    ctx.closePath();
}

StarField.prototype.drawStarField = function (total) {
	// Many stars. Such field.
	for (let i = 0; i <= total; i++) {
		this._drawStar(this.el.ctx)
	}
}

function random (min, max) {
  return Math.round((Math.random() * max - min) + min);
}