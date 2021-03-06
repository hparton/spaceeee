import { genLine, generatePlanetTexture } from './js/backgroundPattern'
import { StarField } from './js/stars'
import { createChildCanvas } from './js/utils';

var params = {
  planets: 7
}

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

  this.canvas = document.getElementById('space');
  this.ctx = this.canvas.getContext('2d');

  this.ctx.canvas.width = this.width;
  this.ctx.canvas.height = this.height;

  this.sun = new Sun(this.canvas.width / 2, this.canvas.height - ( this.canvas.height / 2), 145, sunTexture)
  this.planets = [];

  // Create new planets and push them to this.planets
  this.registerPlanets()
  this.updatePlanetPosition()
}

SpaceBackground.prototype.init = function() {
  // Create the starfield background
  var starfield = new StarField(this.canvas, '#251b4f')
  starfield.init()

  // Draw the sun on its own canvas.
  this.drawSun()

  // Draw the static trajectories for the planets.
  var trajectoryCanvas = createChildCanvas('trajectory', this.canvas, -2)

  for (var i = this.planets.length -1; i >= 0; i--) {
    this.drawTrajectory(trajectoryCanvas.ctx, {
      x: this.sun.position.x,
      y: this.sun.position.y,
      radius: this.sun.radius + 150 + (150 * i)
    })
  }

  // Start the render loop.
  var self = this;

  function draw() {
    self.clearPlanets()
    self.updatePlanetPosition()
    self.drawPlanets()

    requestAnimationFrame(function(timestamp) {
      draw()
    })
  }

  // requestAnimationFrame(function(timestamp) {
    draw()
  // })
}


SpaceBackground.prototype.registerPlanets = function() {
  for (let i = params.planets - 1; i >= 0; i--) {
    let background = fetch_random(colors)
    var planet = new Planet(
      this.sun.position.y,
      this.sun.position.x,
      Math.floor(Math.random() * 30) + 15,
      this.sun.radius + 150 + (150 * i),
      generatePlanetTexture(600, [
        {
         offset: -40,
         height: 10,
         width: 20,
         fill: background
        },
        {
         offset: 140,
         height: 20,
         width: 20,
         fill: shadeColor2(background, 0.2)
        },
        {
         offset: 420,
         height: 20,
         width: 20,
         fill: shadeColor2(background, 0.4)
        },
      ], 1),
      Math.random() >= 0.5,
      Math.random() >= 0.5
    );
    this.planets.push(planet)
  };
}

SpaceBackground.prototype.updatePlanetPosition = function() {
  for (var i = this.planets.length -1; i >= 0; i--) {

    var p = this.planets[i];

    p.angle+=p.angularSpeed;

    var posX = Math.cos(p.angle)*(p.distance);
    var posY = Math.sin(p.angle)*(p.distance);

    p.position.x = posX + this.sun.position.x;
    p.position.y = posY + this.sun.position.y;

    if (p.moon) {
      p.moon.angle+=p.moon.angularSpeed;
      var monX = Math.cos(p.moon.angle)*(p.radius * 1.5);
      var monY = Math.sin(p.moon.angle)*(p.radius * 1.5);

      p.moon.position.x = monX + p.position.x;
      p.moon.position.y = monY + p.position.y;
    }
  }
}

SpaceBackground.prototype.clearPlanets = function() {
  for (var i = this.planets.length -1; i >= 0; i--) {
    var p = this.planets[i];
    this.ctx.clearRect(p.position.x - p.radius / 2 - 75, p.position.y - p.radius / 2 - 75, p.radius + 150, p.radius + 150);
  }
}

SpaceBackground.prototype.drawSun = function(ctx) {
  var sunCanvas = createChildCanvas('sun', this.canvas, -1)
  var sun = this.sun;

  drawCircle(sunCanvas.ctx, {
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

SpaceBackground.prototype.drawPlanets = function() {

  for (var i = this.planets.length -1; i >= 0; i--) {
    let planet = this.planets[i];

    drawCircle(this.ctx, {
      x: planet.position.x,
      y: planet.position.y,
      radius: planet.radius,
      background: planet.background,
      shadow: {
        color: 'rgba(247,222,226,0.35)',
        blur: 50,
      },
      texture: planet.texture,
      border: planet.border
    })

    if (planet.moon) {

      this.drawTrajectory(this.ctx, {
        x: planet.position.x,
        y: planet.position.y,
        radius: planet.radius * 1.5
      })

      drawCircle(this.ctx, {
        x: planet.moon.position.x,
        y: planet.moon.position.y,
        radius: planet.moon.radius,
        background: planet.moon.background,
        shadow: {
          color: 'rgba(247,222,226,0.2)',
          blur: 10,
        },
        texture: planet.moon.texture
      })

    }

  }

}


var drawCircle = function(ctx, {
  x,
  y,
  radius = 20,
  shadow = {},
  atmosphere = {},
  border = false,
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


      if (texture) {
        ctx.fillStyle = 'clear';
      } else {
        ctx.fillStyle = background;
      }


      if (texture) {
        ctx.drawImage(texture, x - radius, y - radius, radius * 2, radius * 2);
      } else {
        ctx.fill();
      }

      if (border) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke()
      }
      ctx.closePath();



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
  ctx.arc(x, y, radius + 2, 0, Math.PI*2, true)
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



function Planet(x, y, radius, distance, texture, border, moon) {
  this.radius = radius;

  this.distance = distance;
  this.angle = Math.random() * (360 - 0) + 0;
  this.angularSpeed = 6 / (this.distance * 2);
  this.position = {};
  this.position.x = x;
  this.position.y = y;
  this.texture = texture;
  this.border = border;

  if (moon) {
    this.moon = new Planet(this.position.x * 1.5, this.position.y * 1.5, this.radius / 3.5)
    this.moon.angularSpeed = 0.1;
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

var space = new SpaceBackground();

space.init();



