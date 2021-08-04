import React from "react";
import Sketch from "react-p5";

let particles = [];
let humidityAlpha;

const Humidity = ({ humidity }) => {
	const setup = (p5, canvasParentRef) => {
		p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
		class Particle {
      constructor(xIn, yIn, cIn) {
        this.posX = xIn;
        this.posY = yIn;
        this.c = cIn;
        this.incr = 0;
        this.theta = 0;
      }
    }

		const setParticles = () => {
			for(let i = 0; i < 6000; i++) {
				const x = p5.random(p5.width);
				const y = p5.random(p5.height);
				// const adj = map(y, 0, height, 255, 0);
				const c = p5.color(255, 255, 255, 100);
				particles[i] = new Particle(x, y, c);
			}
		}
    p5.background(0);
		p5.noStroke();
		setParticles();
	};

	const draw = (p5) => {
    p5.frameRate(80);
		humidityAlpha = p5.map(humidity, 0, 100, 5, 35);
    humidityAlpha = p5.map(p5.mouseX, 0, p5.width, 5, 35);
		p5.fill(0, humidityAlpha);
		p5.rect(0, 0, p5.width, p5.height);
		p5.loadPixels();
		particles.forEach(p => {
			// p.render();
			p.incr += .008
			p.theta = p5.noise(p.posX * .006, p.posY * .004, p.incr) * p5.TWO_PI
			p.posX += 2 * p5.cos(p.theta)
			p.posY += 2 * p5.sin(p.theta)
			if (p.posX > 0 && p.posX < p5.width && p.posY > 0  && p.posY < p5.height) {
				p5.pixels[parseInt(p.posX) + parseInt(p.posY) * p5.width] = p.c
			}
			if (p.posX < 0) 
				p.posX = p5.width
			if (p.posX > p5.width)
				p.posX = 0
			if (p.posY < 0)
				p.posY = p5.height
			if (p.posY > p5.height)
				p.posY = 0
		})

		p5.updatePixels();
	};

	// const windowResized = (p5) => {
	// 	p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
	// }

	return (
		<Sketch 
			setup={setup} 
			draw={draw} 
			// windowResized={windowResized} 
			humidity={humidity}
      className="absolute z-10"
		/>
	)
};

export default Humidity;
