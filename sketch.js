/* Biodiversity Ecology - Estimating Stream Diversity Model
 * Adapted from Virtual Lab Biology's Stream Diversity Model Simulation
 * Adapted by Sophia Wang
 * 10.02.2024
*/

// CONSTANTS
// levels of pollution
const HIGH = 2;
const MODERATE = 1;
const LOW = 0;
let pollution;
// sampling details
const SAMP_TIME = 60;
let time = 0;
let species = 0;
let abundance = 0;
// window/box sizing ratios
let W;
let H;
const MAIN_WIDTH = 0.8;
const MAIN_HEIGHT = 0.7;
const BOX_HEIGHT = 0.07;
const BOX_WIDTH = 0.089;
const BOX_PAD = 0.01;
const BOX_YPOS = MAIN_HEIGHT + BOX_PAD;
const BOX_CORNER = 5;
const BTN_PAD = 0.025;
const BTN_WIDTH = 0.15;
const BTN_HEIGHT = 0.05;
const BTN_XPOS = MAIN_WIDTH + BTN_PAD;
const BTN_FONT_SIZE = '18px';
const HEAD_FONT_SIZE = 18;
const TEXT_FONT_SIZE = 16;
// buttons/dropdowns
let selPollution;
let btnReset;
let btnGo;
let btnOpen;

// STATES
const STOPPED = 0;
const RUNNING = 1;
const TRAP_OPEN = 2;
let state = STOPPED;

// CLASSES
// class Organism {
// 	// constructor
// 	constructor (name, id, sensitivity) {
// 		this.name = name;
// 		this.id = id;
// 		this.sensitivity = sensitivity;
// 	}
// 	// getters
// 	name () { return this.name; }
// 	id () { return this.id; }
// 	sensitivity () { return this.sensitivity; }
// }

// ORGANISM INFORMATION
const organisms = [['Caddisflies', 0], ['Mayflies', 0], ['Stoneflies', 0], ['Riffle Beetles', 0], ['Water Penny Beetles', 0],
									['Dragonflies', 1], ['Craneflies', 1], ['Gill Snails', 1], ['Dobson flies', 1], ['Crayfish', 1],
									['Black Flies', 2], ['Midges', 2], ['Worms', 2], ['Lung Snails', 2], ['Leeches', 2], ['Sowbugs', 2]];
let caddisfly, mayfly, stonefly, riffleBeetle, waterPenny, dragonfly, craneFly, gillSnail;
let dobsonfly, crayfish, blackfly, midge, worm, lungsnail, leech, sowbug;

// SETUP
function setup() {
	W = windowWidth;
	H = windowHeight;
	// essentials
	createCanvas(windowWidth, windowHeight);
	background(255);
	
	// buttons
	btnReset = createButton('Reset');
	btnReset.position(BTN_XPOS * W, BTN_PAD * H)
	btnReset.style('font-size', BTN_FONT_SIZE)
	btnReset.style('height', BTN_HEIGHT * H + 'px')
	btnReset.style('width', BTN_WIDTH * W + 'px')
	btnReset.mousePressed(reset);
	btnGo = createButton('Go');
	btnGo.position(BTN_XPOS * W, (BTN_PAD * 2 + BTN_HEIGHT) * H)
	btnGo.style('font-size', BTN_FONT_SIZE)
	btnGo.style('height', BTN_HEIGHT * H + 'px')
	btnGo.style('width', BTN_WIDTH * W + 'px')
	btnGo.mousePressed(go);
	btnOpen = createButton('Open Trap');
	btnOpen.position(BTN_XPOS * W, (BTN_PAD * 3 + BTN_HEIGHT * 2) * H)
	btnOpen.style('font-size', BTN_FONT_SIZE)
	btnOpen.style('height', BTN_HEIGHT * H + 'px')
	btnOpen.style('width', BTN_WIDTH * W + 'px')
	btnOpen.mousePressed(openTrap);
	btnOpen.attribute('disabled', '');
	
	// dropdowns
	selPollution = createSelect();
	selPollution.option('None');
	selPollution.option('Moderate');
	selPollution.option('High');
	selPollution.selected('None');
	selPollution.position(BTN_XPOS * W, (BTN_PAD * 4 + BTN_HEIGHT * 4.5) * H)
	selPollution.style('font-size', BTN_FONT_SIZE/2)
	selPollution.style('height', BTN_HEIGHT * H + 'px')
	selPollution.style('width', BTN_WIDTH * W + 'px')
	
	repaint();
	
	return;
}

// DRAW
function draw() {
	if (state == TRAP_OPEN) {
		 time += 1;
		if (time == 60) {
			frameRate(0);
		}
	}
	repaint();
	drawCaddisfly(50, 50);
	drawMayfly(100, 100);
	drawStonefly(100, 60);
	return;
}

// REPAINT
// draws on text and boxes
function repaint () {
	// essentials
	background(255);
	
	// side panel indicators
	textSize(HEAD_FONT_SIZE);
	fill(0);
	text('Pollution', BTN_XPOS * W, (BTN_PAD * 4 + BTN_HEIGHT * 4) * H);
	text('Sampling Time', BTN_XPOS * W, (BTN_PAD * 6 + BTN_HEIGHT * 6.5) * H);
	text('Total Species', BTN_XPOS * W, (BTN_PAD * 7 + BTN_HEIGHT * 8.5) * H);
	text('Abundance', BTN_XPOS * W, (BTN_PAD * 8 + BTN_HEIGHT * 10.5) * H);
	textSize(TEXT_FONT_SIZE);
	text(time + ' minutes', BTN_XPOS * W, (BTN_PAD * 6 + BTN_HEIGHT * 7.5) * H);
	text(species, BTN_XPOS * W, (BTN_PAD * 7 + BTN_HEIGHT * 9.5) * H);
	text(abundance, BTN_XPOS * W, (BTN_PAD * 8 + BTN_HEIGHT * 11.5) * H);
	// simulation boxes
	fill('#385cac');
	rect(W * BOX_PAD, H * BTN_PAD, W * MAIN_WIDTH, H * MAIN_HEIGHT, BOX_CORNER);
	fill(0);
	rect (W * BOX_PAD, H * (MAIN_HEIGHT - 2 * BOX_HEIGHT - 0.5 * BTN_PAD), W * MAIN_WIDTH, H * (2 * BOX_HEIGHT + 3 * BOX_PAD + 0.5 * BTN_PAD), 0, 0, BOX_CORNER, BOX_CORNER);
	for (let i = 2; i >= 1; i--) {
		for (let j = 1; j <= 8; j++) {
			fill('#93b4f5');
			rect(W * ((j + 1) * BOX_PAD + (j - 1) * BOX_WIDTH), H * (MAIN_HEIGHT - i * (BOX_HEIGHT + BOX_PAD) + BTN_PAD), W * BOX_WIDTH, H * BOX_HEIGHT, BOX_CORNER);
			fill('#fffc9c')
			rect(W * ((j + 1) * BOX_PAD + (j - 1) * BOX_WIDTH), H * (MAIN_HEIGHT + (i - 1) * (BOX_HEIGHT + BOX_PAD) + 2 * BTN_PAD), W * BOX_WIDTH, H * BOX_HEIGHT, BOX_CORNER);
			fill(0);
			textSize(TEXT_FONT_SIZE);
			text(organisms[8 * (i - 1) + j - 1][0], W * ((j + 1.5) * BOX_PAD + (j - 1) * BOX_WIDTH), H * (MAIN_HEIGHT + i * (BOX_HEIGHT + BOX_PAD) - 0.4 * BTN_PAD));
		}
	}
	
	if (state > RUNNING) {
		drawTrap();
	}
}


// BUTTON FUNCTIONS
// go button
function go () {
	console.log('Simulation running.')
	pollution = selPollution.selected();
	if (pollution == 'None' || pollution == 'Moderate' || pollution == 'High') {
		state = RUNNING;
		btnGo.style('background-color', '#2dc43f');
		btnOpen.removeAttribute('disabled');
	}
	return;
}

// open trap button
function openTrap () {
	console.log('Opened trap.');
	if (state == RUNNING) {
		state = TRAP_OPEN;
		drawTrap();
		frameRate(15);
		btnGo.style('background-color', null);
		btnGo.attribute('disabled', '');
		btnOpen.style('background-color', '#2dc43f');
	}
	return;
}

// reset button
function reset () {
	console.log('Reset simulation.');
	state = STOPPED;
	time = 0;
	species = 0;
	abundance = 0;
	frameRate(0);
	selPollution.selected('None');
	btnGo.style('background-color', null);
	btnOpen.style('background-color', null)
	btnOpen.attribute('disabled', '');
	btnGo.removeAttribute('disabled');
	draw();
	return;
}

// DRAWING ORGANISMS/TRAP
function drawTrap () {
	fill('#c2c2c2');
	let w = W * (MAIN_WIDTH/2);
	let h = H * (MAIN_HEIGHT/2);
	line(w - 50, h - 50, w + 50, h - 35);
	line(w - 50, h + 50, w + 50, h + 35);
	beginShape();
	vertex(w - 40, h - 48.5);
	vertex(w + 40, h - 36.5);
	vertex(w + 40, h + 36.5);
	vertex(w - 40, h + 48.5);
	endShape(CLOSE);
	fill(0);
	line(w - 30, h, w + 30, h);
	line(w - 30, h - 30, w + 30, h - 20);
	line(w - 30, h + 30, w + 30, h + 20);
}

function drawCaddisfly (x, y) {
	fill('#9b734c');
	let dilation = 2;
	beginShape();
	vertex(x + 3 * dilation, y + 20 * dilation);
	vertex(x + 2 * dilation, y + 17 * dilation);
	vertex(x + 2.5 * dilation, y + 13 * dilation);
	vertex(x + 2.5 * dilation, y + 11.5 * dilation);
	vertex(x + 18 * dilation, y + 3 * dilation);
	vertex(x + 19 * dilation, y + 2 * dilation);
	vertex(x + 24 * dilation, y - 2 * dilation);
	vertex(x + 19 * dilation, y + 2 * dilation);
	vertex(x + 20 * dilation, y + 2.5 * dilation);
	vertex(x + 20 * dilation, y + 5.5 * dilation);
	vertex(x + 19.5 * dilation, y + 6 * dilation);
	vertex(x + 19 * dilation, y + 6.5 * dilation);
	vertex(x + 25 * dilation, y + 10 * dilation);
	vertex(x + 19 * dilation, y + 6.5 * dilation);
	vertex(x + 18 * dilation, y + 8 * dilation);
	vertex(x + 17.5 * dilation, y + 15 * dilation);
	vertex(x + 18 * dilation, y + 8 * dilation);
	vertex(x + 15.5 * dilation, y + 13 * dilation);
	vertex(x + 15 * dilation, y + 12.5 * dilation);
	vertex(x + 13 * dilation, y + 13 * dilation);
	vertex(x + 12.5 * dilation, y + 20 * dilation);
	vertex(x + 12.5 * dilation, y + 12 * dilation);
	vertex(x + 9 * dilation, y + 17.5 * dilation);
	endShape(CLOSE);
}

function drawMayfly (x, y) {
	fill('#a28150');
	let dilation = 2;
	beginShape();
	vertex(x + 6 * dilation, y + 5 * dilation);
	vertex(x + 16.5 * dilation, y + 10 * dilation);
	vertex(x + 17.8 * dilation, y + 9 * dilation);
	vertex(x + 20 * dilation, y + 7 * dilation);
	vertex(x + 21  * dilation, y + 8.5 * dilation);
	vertex(x + 22 * dilation, y + 9 * dilation);
	vertex(x + 25 * dilation, y + 5 * dilation);
	vertex(x + 22.2 * dilation, y + 8.2 * dilation);
	vertex(x + 26 * dilation, y + 8 * dilation);
	vertex(x + 19.5 * dilation, y + 10 * dilation);
	vertex(x + 19 * dilation, y + 12 * dilation);
	vertex(x + 22 * dilation, y + 11 * dilation);
	vertex(x + 25 * dilation, y + 10 * dilation);
	vertex(x + 19 * dilation, y + 12 * dilation);
	vertex(x + 23.5 * dilation, y + 15 * dilation);
	vertex(x + 19 * dilation, y + 12 * dilation);
	vertex(x + 15 * dilation, y + 17.5 * dilation);
	vertex(x + 10 * dilation, y + 20 * dilation);
	vertex(x + 7 * dilation, y + 19 * dilation);
	vertex(x + 1 * dilation, y + 19 * dilation);
	vertex(x + 11 * dilation, y + 17.5 * dilation);
	vertex(x + 14 * dilation, y + 15 * dilation);
	vertex(x + 10 * dilation, y + 15 * dilation);
	vertex(x + 7 * dilation, y + 11 * dilation);
	endShape(CLOSE);
}

function drawStonefly (x, y) {
	fill('#5a5145');
	let dilation = 2;
	beginShape();
	vertex(x + 5 * dilation, y + 17 * dilation);
	vertex(x + 4 * dilation, y + 17 * dilation);
	vertex(x + 3 * dilation, y + 15 * dilation);
	vertex(x + 3.5 * dilation, y + 12 * dilation);
	vertex(x + 3.3 * dilation, y + 10 * dilation);
	vertex(x + 2 * dilation, y + 11 * dilation);
	vertex(x + 1.5 * dilation, y + 14 * dilation);
	vertex(x + 2 * dilation, y + 11 * dilation);
	vertex(x + 3.3 * dilation, y + 10 * dilation);
	vertex(x + 3 * dilation, y + 8 * dilation);
	vertex(x + 2 * dilation, y + 8.5 * dilation);
	vertex(x + 1 * dilation, y + 10 * dilation);
	vertex(x + 2 * dilation, y + 8.5 * dilation);
	vertex(x + 3 * dilation, y + 8 * dilation);
	vertex(x + 3.5 * dilation, y + 6.5 * dilation);
	vertex(x + 3.3 * dilation, y + 5.5 * dilation);
	vertex(x + 3 * dilation, y + 5 * dilation);
	vertex(x + 1 * dilation, y + 6.5 * dilation);
	vertex(x + 3 * dilation, y + 5 * dilation);
	vertex(x + 3.3 * dilation, y + 5.5 * dilation);
	vertex(x + 4 * dilation, y + 4 * dilation);
	vertex(x + 3.5 * dilation, y + 2.5 * dilation);
	vertex(x + 2.5 * dilation, y + 0.5 * dilation);
	vertex(x + 3.5 * dilation, y + 2.5 * dilation);
	vertex(x + 4 * dilation, y + 4 * dilation);
	vertex(x + 5 * dilation, y + 4 * dilation);
	vertex(x + 5 * dilation, y + 2 * dilation);
	vertex(x + 5.5 * dilation, y + 1 * dilation);
	vertex(x + 5 * dilation, y + 2 * dilation);
	vertex(x + 5 * dilation, y + 4 * dilation);
	vertex(x + 5.5 * dilation, y + 4.5 * dilation);
	vertex(x + 5.5 * dilation, y + 5.5 * dilation);
	vertex(x + 6.5 * dilation, y + 5 * dilation);
	vertex(x + 8.5 * dilation, y + 6.5 * dilation);
	vertex(x + 6.5 * dilation, y + 5 * dilation);
	vertex(x + 5.5 * dilation, y + 5.5 * dilation);
	vertex(x + 6 * dilation, y + 7.2 * dilation);
	vertex(x + 6.5 * dilation, y + 7 * dilation);
	vertex(x + 8.7 * dilation, y + 10 * dilation);
	vertex(x + 6.5 * dilation, y + 7 * dilation);
	vertex(x + 6 * dilation, y + 7.2 * dilation);
	vertex(x + 6 * dilation, y + 10 * dilation);
	vertex(x + 7 * dilation, y + 11 * dilation);
	vertex(x + 7.5 * dilation, y + 14 * dilation);
	vertex(x + 7 * dilation, y + 11 * dilation);
	vertex(x + 6 * dilation, y + 10 * dilation);
	vertex(x + 6 * dilation, y + 13 * dilation);
	vertex(x + 6.5 * dilation, y + 15 * dilation);
	endShape(CLOSE);
}
