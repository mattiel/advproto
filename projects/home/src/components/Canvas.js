import React from "react";
import Sketch from "react-p5";

let kMax; // maximal value for the parameter "k" of the blobs
let step = 0.01; // difference in time between two consecutive blobs
let n = 100; // total number of blobs
let radius = 0; // radius of the base circle
let inter = 0.05; // difference of base radii of two consecutive blobs
let maxNoise = 500; // maximal value for the parameter "noisiness" for the blobs

const Canvas = ({temperature, humidity}) => {
	const setup = (p5, canvasParentRef) => {
		// use parent to render the canvas in this ref
		// (without that p5 will render the canvas outside of your component)
		p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
		p5.colorMode(p5.HSB, 1);
		p5.angleMode(p5.DEGREES);
		kMax = p5.random(0.6, 1.0);
		p5.noFill();
		p5.noStroke();
	};

	const draw = (p5) => {
		p5.background(0, 0, 0, 1);

		const blob = (size, xCenter, yCenter, k, t, noisiness) => {
			p5.beginShape();
			let angleStep = 360 / 10;
			for (let theta = 0; theta <= 360 + 2 * angleStep; theta += angleStep) {
				let r1, r2;
				r1 = p5.cos(theta)+1;
				r2 = p5.sin(theta)+1; // +1 because it has to be positive for the function noise
				let r = size + p5.noise(k * r1,  k * r2, t) * noisiness;
				let x = xCenter + r * p5.cos(theta);
				let y = yCenter + r * p5.sin(theta);
				p5.curveVertex(x, y);
			}
			p5.endShape();
		}
		if(temperature !== 0) {
			let t = p5.frameCount/100;
			for (let i = n; i > 0; i--) {
				let alpha = 1 - (i / n);
				let h = alpha / 5 + p5.map(temperature, 122, 32, 0, 0.75);
				// h = alpha / 5 + .75
				p5.fill(h % 1, 1, 1, alpha);
				let size = radius + i * inter;
				let k = kMax * p5.sqrt(i/n);
				let noisiness = maxNoise * (i / n);
				blob(size, p5.width/2, p5.height/2, k, t - i * step, noisiness);
			}
		}
	};

	const windowResized = (p5) => {
		p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
	}

	return (
		<Sketch 
			setup={setup} 
			draw={draw} 
			windowResized={windowResized} 
			temperature={temperature}
		/>
	)
};

export default Canvas;
