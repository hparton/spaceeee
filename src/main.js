import { genLine, generatePlanetTexture } from './js/backgroundPattern'
import { StarField } from './js/stars'
import { createChildCanvas } from './js/utils';

var colors = {
  pink: '#e29fc7',
  purple: '#5e3d86',
  ice: '#a7b0d0'
}

var sunTexture = generatePlanetTexture(600, [
  {
   offset: -40,
   height: 10,
   width: 4,
   fill: '#fbe1d9'
  },
  {
   offset: 140,
   height: 18,
   width: 4,
   fill: '#efbad3'
  },
  {
   offset: 280,
   height: 18,
   width: 4,
   fill: '#e29fc7'
  },
  {
   offset: 420,
   height: 18,
   width: 4,
   fill: '#ce86b5'
  }
], 0.9);

function SpaceBackground() {
  this.width = window.innerWidth;
  this.height = window.innerHeight;



  this.init();



  this.sun = new Sun(this.canvas.width / 6, this.canvas.height - ( this.canvas.height / 3), 150, sunTexture)
  this.planets = [];

  var planetCount = 7;
  for (var b = planetCount - 1; b >= 0; b--) {
    let background = fetch_random(colors)
    var planet = new Planet(
      0,
      0,
      Math.floor(Math.random() * 30) + 15,
      generatePlanetTexture(600, [
        {
         offset: -40,
         height: 10,
         width: 20,
         fill: shadeColor2(background, 0.6)
        },
        {
         offset: 140,
         height: 20,
         width: 20,
         fill: shadeColor2(background, 0.8)
        },
        {
         offset: 420,
         height: 20,
         width: 20,
         fill: shadeColor2(background, 1)
        },
      ], 1),
      Math.random() >= 0.5,
      Math.random() >= 0.5
    );
    this.planets.push(planet)
  };

  var self = this;

  var starfield = new StarField(this.canvas)
  starfield.init()

  var sunCanvas = createChildCanvas('sun', this.canvas, -1)
  self.drawSun(sunCanvas.ctx, self.sun)

  var trajectoryCanvas = createChildCanvas('trajectory', this.canvas, -2)

  for (var i = this.planets.length -1; i >= 0; i--) {
    this.drawTrajectory(trajectoryCanvas.ctx, {
      x: this.sun.position.x,
      y: this.sun.position.y,
      radius: this.sun.radius + 150 + (150 * i)
    })
  }


  function draw(timestamp) {
    // Don't clear the whole page, instead we need to stop using rotate on the planets
    // get the X/Y coords and size, then clear the space they used to occupy (including shadow)
    // and then redraw

    self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
    self.updatePlanetPos(self.planets)
    self.drawPlanets(self.planets)

    requestAnimationFrame(function(timestamp) {
      draw(timestamp)
      meter.tick();
    })
  }

  // requestAnimationFrame(function(timestamp) {
  //   draw(timestamp)
  // })

}

SpaceBackground.prototype.init = function() {
  this.canvas = document.getElementById('space');
  this.ctx = this.canvas.getContext('2d');

  this.ctx.canvas.width = this.width;
  this.ctx.canvas.height = this.height;
}

SpaceBackground.prototype.drawSun = function(ctx, sun) {
  drawCircle(ctx, {
    x: sun.position.x,
    y: sun.position.y,
    radius: sun.radius,
    background: sun.background,
    atmosphere: {
      color: '#82648B',
      rings: 4
    },
    shadow: {
      color: 'rgba(130,100,139,0.6)',
      blur: 120
    },
    texture: sun.texture
  })
}

SpaceBackground.prototype.drawPlanets = function(planets) {

  for (var i = planets.length -1; i >= 0; i--) {

    this.ctx.save();

      this.ctx.translate(this.sun.position.x, this.sun.position.y);
        // rotate the rect
      this.ctx.rotate(planets[i].angle);

   drawCircle(this.ctx, {
      x: planets[i].position.x,
      y: planets[i].position.y,
      radius: planets[i].radius,
      background: planets[i].background,
      shadow: {
        color: 'rgba(247,222,226,0.55)',
        blur: 80,
      },
      texture: planets[i].texture
    })
    if (planets[i].moon) {

      this.drawTrajectory(this.ctx, {
        x: planets[i].position.x,
        y: planets[i].position.y,
        radius: planets[i].radius * 1.5
      })

      this.ctx.save();

      this.ctx.translate(planets[i].position.x, planets[i].position.y);
        // rotate the rect
      this.ctx.rotate(planets[i].moon.angle);

      drawCircle(this.ctx, {
        x: planets[i].radius * 1.5,
        y: 0,
        radius: planets[i].moon.radius,
        background: planets[i].moon.background,
        shadow: {
          color: 'rgba(247,222,226,0.2)',
          blur: 10,
        },
        texture: planets[i].moon.texture
      })

      this.ctx.restore();

    }
    this.ctx.restore();

  }

}

SpaceBackground.prototype.updatePlanetPos = function(planets) {
  for (var i = planets.length -1; i >= 0; i--) {
    // this.planets[i].position.y += 0.1;
    this.planets[i].position.x = this.sun.radius + 150 + (150 * i);
    this.planets[i].position.y = 0;
    planets[i].angle+=planets[i].angularSpeed;

    if (planets[i].moon) {
     planets[i].moon.angle+=planets[i].moon.angularSpeed;
    }
  }
}


var drawCircle = function(ctx, {
  x,
  y,
  radius = 20,
  shadow = {},
  atmosphere = {},
  border = {},
  background = 'grey',
  texture
} = {}) {

      if (shadow.color) {
        ctx.shadowColor = shadow.color;
        ctx.shadowBlur = shadow.blur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      if (atmosphere.rings) {
        for (var i = atmosphere.rings - 1; i >= 0; i--) {
            ctx.fillStyle = atmosphere.color;
            ctx.globalAlpha = 0.6 - i * 0.15
            ctx.beginPath();
            ctx.arc(x, y, radius + (20 * i), 0, Math.PI*2, true);
            ctx.fill();
            ctx.closePath();

        };
        ctx.globalAlpha = 1;
      }


      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI*2, true);

      ctx.closePath();

      if (texture) {
        ctx.fillStyle = 'clear';
      } else {
        ctx.fillStyle = background;
      }

      ctx.fill();

      if (texture) {
        ctx.drawImage(texture, x - radius, y - radius, radius * 2, radius * 2);

      }

      if (border.width) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = border.width;
        ctx.stroke()
      }


     if (shadow.color) {
      ctx.shadowBlur = 0;
     }
}

SpaceBackground.prototype.drawTrajectory = function(ctx, {
  x,
  y,
  radius,
  width = 2,
  color = '#483b67',
} = {}) {
  ctx.strokeStyle = '#483b67';

  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI*2, true)
  ctx.strokeStyle = color;
  ctx.closePath();
  ctx.stroke();
}


function Sun(x, y, radius, texture) {
  this.radius = radius;
  this.position = {};
  this.position.x = x;
  this.position.y = y;
  this.children = [];
  this.texture = texture;

  this.background = colors.orange;
}

function Planet(x, y, radius, texture, border, moon) {
  this.radius = radius;

  this.angle = Math.random() * (360 - 0) + 0;
  this.angularSpeed = (100 - this.radius) / 10000;
  this.position = {};
  this.position.x = x;
  this.position.y = y;
  this.texture = texture;

  if (moon) {
    this.moon = new Planet(this.position.x * 1.5, this.position.y * 1.5, this.radius / 3.5)
  }

  this.background = fetch_random(colors);
}

function fetch_random(obj) {
    var temp_key, keys = [];
    for(temp_key in obj) {
       if(obj.hasOwnProperty(temp_key)) {
           keys.push(temp_key);
       }
    }
    return obj[keys[Math.floor(Math.random() * keys.length)]];
}

function shadeColor2(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

var meter = new FPSMeter({
  theme: 'dark',
  heat:  1,
  graph:   1,
  history: 20 ,
  maxFPS: 100,
});

var space = new SpaceBackground();



