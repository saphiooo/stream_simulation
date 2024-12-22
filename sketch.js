/* Biodiversity Ecology - Estimating Stream Diversity Model
 * Adapted from Virtual Lab Biology's Stream Diversity Model Simulation
 * Adapted by Sophia Wang
 * 12.21.2024
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
const TEXT_FONT_SIZE = 14;
const dilation = 1.3;
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
class Organism {
	// constructor
	constructor (name, sensitivity, display, i) {
		this.name = name;
		this.sensitivity = sensitivity;
		this.display = display;
		this.amt = 0;
		this.coords = [];
		this.boxCoords = [];
		this.box = [int(i/8), i%8];
	}
	// getters
	getName () { return this.name; }
	getAmt () { return this.amt; }
	getSensitivity () { return this.sensitivity; }
	getLenCoords () { return this.coords.length; }
	getCoords (i) { 
		if (this.coords.length <= i) { return [0, 0]; }
		else { return this.coords[i]; }
	}
	getLenBoxCoords () { return this.boxCoords.length; }
	getBoxCoords (i) {
		if (this.boxCoords.length <= i) { return [0, 0]; }
		return this.boxCoords[i];
	}
	drawOrganism (x, y) {return this.display(x, y); }
	// setters
	setAmt (a) { this.amt = a; return; }
	setCoords (i, l) { this.coords[i] = l; return; }
	addCoords (l) { this.coords.push(l); return; }
	setBoxCoords (i, l) { this.boxCoords[i] = l; return; }
	addBoxCoords (l) { this.boxCoords.push(l); return; }
	// resetters
	resetAmts () { this.amt = 0; this.coords = []; this.boxCoords = []; return; }
}

// ORGANISM INFORMATION
const names = ['Caddisflies', 'Mayflies', 'Stoneflies',  'Riffle Beetles',  'Water Pennies', 
									 'Dragonflies', 'Craneflies', 'Gill Snails', 'Dobson flies', 'Crayfish',
									 'Black Flies', 'Midges', 'Worms', 'Lung Snails', 'Leeches', 'Sowbugs'];
let caddisfly, mayfly, stonefly, riffleBeetle, waterPenny, dragonfly, craneFly, gillSnail;
let dobsonfly, crayfish, blackfly, midge, worm, lungsnail, leech, sowbug;
let organisms;

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
	pollution = 'None';
	selPollution.selected(pollution);
	selPollution.position(BTN_XPOS * W, (BTN_PAD * 4 + BTN_HEIGHT * 4.5) * H)
	selPollution.style('font-size', BTN_FONT_SIZE/2)
	selPollution.style('height', BTN_HEIGHT * H + 'px')
	selPollution.style('width', BTN_WIDTH * W + 'px')
	
	// organisms
	caddisfly = new Organism('Caddisfly', 2, drawCaddisfly, 0);
	mayfly = new Organism('Mayfly', 2, drawMayfly, 1);
	stonefly = new Organism('Stonefly', 2, drawStonefly, 2);
	riffleBeetle = new Organism('Riffle Beetle', 2, drawRiffleBeetle, 3)
	waterPenny = new Organism('Water Penny', 2, drawWaterPenny, 4);
	dragonfly = new Organism('Dragonfly', 1, drawDragonfly, 5);
	cranefly = new Organism('Crane fly', 1, drawCranefly, 6);
	gillSnail = new Organism('Gill snail', 1, drawGillSnail, 7);
	dobsonfly = new Organism('Dobson fly', 1, drawDobsonfly, 8);
	crayfish = new Organism('Crayfish', 1, drawCrayfish, 9);
	blackfly = new Organism('Black fly', 0, drawBlackfly, 10);
	midge = new Organism('Midge', 0, drawMidge, 11);
	worm = new Organism('Worm', 0, drawWorm, 12);
	lungSnail = new Organism('Lung Snail', 0, drawLungSnail, 13);
	leech = new Organism('Leech', 0, drawLeech, 14);
	sowbug = new Organism('Sowbug', 0, drawSowbug, 15);

	organisms = [caddisfly, mayfly, stonefly, riffleBeetle, waterPenny,
										 dragonfly, cranefly, gillSnail, dobsonfly, crayfish,
										 blackfly, midge, worm, lungSnail, leech, sowbug];
	
	repaint();
	
	return;
}

// DRAW
function draw() {
	if (state == TRAP_OPEN) {
		if (time < 60) {
			time ++;
		}
	}
	repaint();
	return;
}

// REPAINT
// draws on text and boxes
function repaint () {
	// essentials
	background(255);
	
	// simulation boxes
	if (pollution == 'None') { fill('#6489DB'); }
	else if (pollution == 'Moderate') { fill('#5163A0'); }
	else { fill('#364570'); }
	rect(W * BOX_PAD, H * BTN_PAD, W * MAIN_WIDTH, H * MAIN_HEIGHT, BOX_CORNER);
	fill(0);
	rect (W * BOX_PAD, H * (MAIN_HEIGHT - 2 * BOX_HEIGHT - 0.5 * BTN_PAD), W * MAIN_WIDTH, H * (2 * BOX_HEIGHT + 3 * BOX_PAD + 0.5 * BTN_PAD), 0, 0, BOX_CORNER, BOX_CORNER);
	for (let i = 2; i >= 1; i--) {
		for (let j = 1; j <= 8; j++) {
			// fill('#93b4f5');
			if (pollution == 'None') { fill('#8CA9E9'); }
			else if (pollution == 'Moderate') { fill('#687BBA'); }
			else { fill('#4F638F'); }
			rect(W * ((j + 1) * BOX_PAD + (j - 1) * BOX_WIDTH), H * (MAIN_HEIGHT - i * (BOX_HEIGHT + BOX_PAD) + BTN_PAD), W * BOX_WIDTH, H * BOX_HEIGHT, BOX_CORNER);
			fill('#fffc9c')
			rect(W * ((j + 1) * BOX_PAD + (j - 1) * BOX_WIDTH), H * (MAIN_HEIGHT + (i - 1) * (BOX_HEIGHT + BOX_PAD) + 2 * BTN_PAD), W * BOX_WIDTH, H * BOX_HEIGHT, BOX_CORNER);
			fill(0);
			textSize(TEXT_FONT_SIZE);
			text(names[8 * (i - 1) + j - 1], W * ((j + 1.5) * BOX_PAD + (j - 1) * BOX_WIDTH), H * (MAIN_HEIGHT + i * (BOX_HEIGHT + BOX_PAD) - 0.4 * BTN_PAD));
		}
	}
	
	// trap
	if (state > RUNNING) {
		drawTrap();
	}
	
	// bugs
	if (state >= RUNNING) {
		setCoords();
		for (let idx = 0; idx < 16; idx++) {
			o = organisms[idx];
			i = o.box[0] + 1; j = o.box[1] + 1;
			let tempAmt = o.getAmt();
			
			if (state > RUNNING) {
				fill(0);
				textSize(TEXT_FONT_SIZE + 5);
				const multipliers = [1.25, 1.5, 2];
				tempAmt *= multipliers[Math.floor(Math.random() + 1)];
				tempAmt = Math.floor(tempAmt);
				text(tempAmt, W * ((j + 2) * BOX_PAD + (j - 1) * BOX_WIDTH), H * (MAIN_HEIGHT + i * (BOX_HEIGHT + BOX_PAD) + 2 * BOX_PAD));
				abundance += tempAmt;
				// species
				if (o.getAmt() > 0) {
					species ++;
				}
			}
			// draw 
			for (let reps = 0; reps < o.getAmt(); reps ++) {
				if (o.getCoords(reps)[0] > W * 2 * BOX_PAD && 
						o.getCoords(reps)[0] < W * MAIN_WIDTH - W * BOX_PAD) {
					o.display(o.getCoords(reps)[0], o.getCoords(reps)[1]);
				}
			}
			if (state > RUNNING) {
				for (let reps = 0; reps < tempAmt; reps ++) {
					o.display(o.getBoxCoords(reps)[0], o.getBoxCoords(reps)[1]);
				}
			}
		}
	}
	
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
	species = 0;
	abundance = 0;
	
	return;
}


// BUTTON FUNCTIONS
// go button
function go () {
	// console.log('Simulation running.')
	pollution = selPollution.selected();
	if (pollution == 'None' || pollution == 'Moderate' || pollution == 'High') {
		state = RUNNING;
		frameRate(60);
		btnGo.style('background-color', '#2dc43f');
		btnOpen.removeAttribute('disabled');
		setAmts(pollution);
		setCoords();
		repaint();
		selPollution.disable();
	}
	return;
}

// open trap button
function openTrap () {
	// console.log('Opened trap.');
	if (state == RUNNING) {
		state = TRAP_OPEN;
		drawTrap();
		btnGo.style('background-color', null);
		btnGo.attribute('disabled', '');
		btnOpen.style('background-color', '#2dc43f');
	}
	return;
}

// reset button
function reset () {
	// console.log('Reset simulation.');
	state = STOPPED;
	time = 0;
	species = 0;
	abundance = 0;
	frameRate(0);
	btnGo.style('background-color', null);
	btnOpen.style('background-color', null)
	btnOpen.attribute('disabled', '');
	btnGo.removeAttribute('disabled');
	selPollution.enable();
	selPollution.selected(pollution);
	for (let o of organisms) { o.resetAmts(); }
	draw();
	return;
}

// RANDOMIZATION
// amounts
function setAmts (pollution) {
	if (pollution == 'None') {
		for (let o of organisms) {
			if (o.getAmt() == 0) {
				if (o.sensitivity == 2) { o.setAmt(Math.floor(Math.random() * 3 + 3)); }
				else if (o.sensitivity == 1) { o.setAmt(Math.floor(Math.random() * 3 + 3)); }
				else { o.setAmt(Math.floor(Math.random() * 3 + 2)); }
			}			
		}
	}
	else if (pollution == 'Moderate') {
		for (let o of organisms) {
			if (o.getAmt() == 0) {
				if (o.sensitivity == 2) { o.setAmt(Math.floor(Math.random() * 4)); }
				else if (o.sensitivity == 1) { o.setAmt(Math.floor(Math.random() * 3 + 1.5)); }
				else { o.setAmt(Math.floor(Math.random() * 4.5 + 3)); }
			}
		}
	}
	else if (pollution == 'High') {
		for (let o of organisms) {
			if (o.getAmt() == 0) {
				if (o.sensitivity == 2) { o.setAmt(Math.floor(Math.random() * 1.2)); }
				else if (o.sensitivity == 1) { o.setAmt(Math.floor(Math.random() * 3)); }
				else { o.setAmt(Math.floor(Math.random() * 6 + 4)); }
			}
		}
	}
	else {
		for (let o of organisms) {
			o.setAmt(0);
		}
	}
	return;
}

// coordinates
function setCoords () {
	for (let o of organisms) {
		// simulation coords
		let diff = o.getAmt() - o.getLenCoords();
		for (let i = 0; i < o.getLenCoords(); i++) {
			// old organisms
			let l = o.getCoords(i);
			l[0] -= Math.random() * 5;
			l[1] += Math.random() * 1.2 - 0.6;
			l[1] = Math.max(l[1], H * 2 * BOX_PAD); l[1] = Math.min(l[1], H * (MAIN_HEIGHT - 3 * BOX_HEIGHT - 3 * BOX_PAD));
			if (l[0] <= 0) {
				let x = W * 3 * MAIN_WIDTH;
				let y = Math.random() * H * (MAIN_HEIGHT - 2 * BOX_HEIGHT - BOX_PAD);
				o.setCoords(i, [x, y]);
			}
			else {
				o.setCoords(i, l);
			}
		}
		for (let i = o.getAmt() - diff; i < o.getAmt(); i++) {
			// new organisms
			let x = Math.random() * W * 3 * MAIN_WIDTH;
			let y = Math.random() * H * (MAIN_HEIGHT - 2 * BOX_HEIGHT - BOX_PAD);
			o.addCoords([x, y]);
			// console.log(o.coords);
		}
		// box coords
		diff = 2 * o.getAmt() - o.getLenBoxCoords();
		let r = o.box[0]; c = o.box[1] + 1;
		for (let i = 0; i < o.getLenBoxCoords(); i++) {
			// old organisms
			let l = o.getBoxCoords(i);
			l[0] += Math.random() * 1.2 - 0.6;
			l[1] += Math.random() * 1.2 - 0.6;
			l[0] = Math.max(l[0], W * ((c + 1) * BOX_PAD + (c - 1) * BOX_WIDTH) + 20); 
			l[0] = Math.min(l[0], W * ((c - 2) * BOX_PAD + c * BOX_WIDTH) - 20);
			l[1] = Math.max(l[1], H * (MAIN_HEIGHT - 2 * BOX_HEIGHT - BOX_PAD) + H * r * BOX_HEIGHT + (r + 1) * BOX_PAD + 20); 
			l[1] = Math.min(l[1], H * (MAIN_HEIGHT - 2 * BOX_HEIGHT - BOX_PAD) + H * (r + 1) * BOX_HEIGHT + r * BOX_PAD - 20);
			o.setBoxCoords(i, l);
		}
		
		for (let i = o.getAmt() - diff; i < o.getAmt(); i++) {
			// new organisms
			let x = W * ((c + 1) * BOX_PAD + (c - 1) * BOX_WIDTH + BOX_WIDTH/2) + Math.random() * W * BOX_WIDTH - W * BOX_WIDTH/2;
			let y = H * (MAIN_HEIGHT - 2 * BOX_HEIGHT - BOX_PAD + (r + 1) * BOX_HEIGHT + r * BOX_PAD) - Math.random() * H * BOX_HEIGHT;
			o.addBoxCoords([x, y]);
		}
	}
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
	return;
}

function drawCaddisfly (x, y) {
	fill('#9b734c');
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
	return;
}

function drawMayfly (x, y) {
	fill('#a28150');
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
	return;
}

function drawStonefly (x, y) {
	fill('#5a5145');
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
	return;
}

function drawRiffleBeetle (x, y) {
	fill('#5a5145');
	beginShape();
	vertex(x + 15 * dilation, y + 8.5 * dilation);
	vertex(x + 15 * dilation, y + 11.5 * dilation);
	vertex(x + 12.5 * dilation, y + 12.5 * dilation);
	vertex(x + 12 * dilation, y + 12.5 * dilation);
	vertex(x + 12 * dilation, y + 15 * dilation);
	vertex(x + 14 * dilation, y + 17.5 * dilation);
	vertex(x + 12 * dilation, y + 15 * dilation);
	vertex(x + 12 * dilation, y + 12.5 * dilation);
	vertex(x + 7.5 * dilation, y + 12.5 * dilation);
	vertex(x + 8 * dilation, y + 17.5 * dilation);
	vertex(x + 7.5 * dilation, y + 12.5 * dilation);
	vertex(x + 7 * dilation, y + 11.5 * dilation);
	vertex(x + 5 * dilation, y + 14 * dilation);
	vertex(x + 2.5 * dilation, y + 14 * dilation);
	vertex(x + 5 * dilation, y + 14 * dilation);
	vertex(x + 7 * dilation, y + 11.5 * dilation);
	vertex(x + 5 * dilation, y + 11.5 * dilation);
	vertex(x + 4 * dilation, y + 10.5 * dilation);
	vertex(x + 2.5 * dilation, y + 11.5 * dilation);
	vertex(x, y + 11.5 * dilation);
	vertex(x + 2.5 * dilation, y + 11.5 * dilation);
	vertex(x + 4 * dilation, y + 10.5 * dilation);
	vertex(x + 4 * dilation, y + 9.5 * dilation);
	vertex(x + 2.5 * dilation, y + 8.5 * dilation);
	vertex(x, y + 8.5 * dilation);
	vertex(x + 2.5 * dilation, y + 8.5 * dilation);
	vertex(x + 4 * dilation, y + 9.5 * dilation);
	vertex(x + 5 * dilation, y + 8.5 * dilation);
	vertex(x + 7 * dilation, y + 8.5 * dilation);
	vertex(x + 5 * dilation, y + 6 * dilation);
	vertex(x + 2.5 * dilation, y + 6 * dilation);
	vertex(x + 5 * dilation, y + 6 * dilation);
	vertex(x + 7 * dilation, y + 8.5 * dilation);
	vertex(x + 7.5 * dilation, y + 7.5 * dilation);
	vertex(x + 8 * dilation, y + 2.5 * dilation);
	vertex(x + 7.5 * dilation, y + 7.5 * dilation);
	vertex(x + 12 * dilation, y + 7.5 * dilation);
	vertex(x + 12 * dilation, y + 5 * dilation);
	vertex(x + 14 * dilation, y + 2.5 * dilation);
	vertex(x + 12 * dilation, y + 5 * dilation);
	vertex(x + 12 * dilation, y + 7.5 * dilation);
	vertex(x + 12.5 * dilation, y + 7.5 * dilation);
	vertex(x + 15 * dilation, y + 8.5 * dilation);
	endShape(CLOSE);
	return;
}

function drawWaterPenny (x, y) {
	x += 19; y += 10;
	fill('#7c3622');
	ellipse(x, y, 20, 16);
	line(x - 9.5, y + 0.5, x - 15, y + 2.5);
	line(x - 9.5, y - 0.5, x - 15, y - 2.5);
	return;
}

function drawDragonfly (x, y) {
	fill('#446c94');
	beginShape();
	vertex(x + dilation * 9.5, y + dilation * 2.5);
	vertex(x + dilation * 9.25, y + dilation * 3);
	vertex(x + dilation * 9.5, y + dilation * 3.5);
	vertex(x + dilation * 9, y + dilation * 5);
	vertex(x + dilation * 9.5, y + dilation * 7);
	vertex(x + dilation * 9, y + dilation * 12.5);
	vertex(x + dilation * 9.5, y + dilation * 17.5);
	vertex(x + dilation * 10.5, y + dilation * 17.5);
	vertex(x + dilation * 11, y + dilation * 12.5);
	vertex(x + dilation * 10.5, y + dilation * 7);
	vertex(x + dilation * 11, y + dilation * 5);
	vertex(x + dilation * 10.5, y + dilation * 3.5);
	vertex(x + dilation * 10.75, y + dilation * 3);
	vertex(x + dilation * 10.5, y + dilation * 2.5);
	endShape(CLOSE);
	fill('#add5dd');
	beginShape();
	vertex(x + dilation * 9, y + dilation * 5);
	vertex(x + dilation * 5, y + dilation * 5);
	vertex(x + dilation * 2, y + dilation * 5.75);
	vertex(x + dilation * 2, y + dilation * 6.25);
	vertex(x + dilation * 5, y + dilation * 7.5);
	vertex(x + dilation * 4.5, y + dilation * 10);
	vertex(x + dilation * 5, y + dilation * 11);
	vertex(x + dilation * 5.5, y + dilation * 10.5);
	vertex(x + dilation * 9.5, y + dilation * 7);
	vertex(x + dilation * 9, y + dilation * 5);
	endShape(CLOSE);
	beginShape();
	vertex(x + dilation * 11, y + dilation * 5);
	vertex(x + dilation * 15, y + dilation * 5);
	vertex(x + dilation * 18, y + dilation * 5.75);
	vertex(x + dilation * 18, y + dilation * 6.25);
	vertex(x + dilation * 15, y + dilation * 7.5);
	vertex(x + dilation * 15.5, y + dilation * 10);
	vertex(x + dilation * 15, y + dilation * 11);
	vertex(x + dilation * 14.5, y + dilation * 10.5);
	vertex(x + dilation * 10.5, y + dilation * 7);
	vertex(x + dilation * 11, y + dilation * 5);
	endShape(CLOSE);
	return;
}

function drawCranefly (x, y) {
	fill('#705c51');
	beginShape();
	vertex(x + dilation * 9.5, y + dilation * 9.5);
	vertex(x + dilation * 9.5, y + dilation * 10.5);
	vertex(x + dilation * 6.5, y + dilation * 13.5);
	vertex(x + dilation * 6, y + dilation * 15);
	vertex(x + dilation * 8, y + dilation * 13.75);
	vertex(x + dilation * 9.5, y + dilation * 10.75);
	vertex(x + dilation * 9.5, y + dilation * 14);
	vertex(x + dilation * 9.85, y + dilation * 15);
	vertex(x + dilation * 10.15, y + dilation * 15);
	vertex(x + dilation * 10.5, y + dilation * 14);
	vertex(x + dilation * 10.5, y + dilation * 10.75);
	vertex(x + dilation * 12, y + dilation * 13.75);
	vertex(x + dilation * 14, y + dilation * 15);
	vertex(x + dilation * 13.5, y + dilation * 13.5);
	vertex(x + dilation * 10.5, y + dilation * 10.5);
	vertex(x + dilation * 10.5, y + dilation * 9.5);
	endShape();
	line(x + dilation * 9.5, y + dilation * 10.5, x + dilation * 9, y + dilation * 10);
	line(x + dilation * 9, y + dilation * 10, x + dilation * 7, y + dilation * 5);
	line(x + dilation * 7, y + dilation * 5, x + dilation * 6, y);
	line(x + dilation * 10.5, y + dilation * 10.5, x + dilation * 11, y + dilation * 10);
	line(x + dilation * 11, y + dilation * 10, x + dilation * 13, y + dilation * 5);
	line(x + dilation * 13, y + dilation * 5, x + dilation * 14, y);
	line(x + dilation * 9.5, y + dilation * 10.5, x + dilation * 7, y + dilation * 11.5);
	line(x + dilation * 7, y + dilation * 11.5, x + dilation * 4, y + dilation * 10);
	line(x + dilation * 4, y + dilation * 10, x + dilation * 0.5, y + dilation * 11);
	line(x + dilation * 10.5, y + dilation * 10.5, x + dilation * 13, y + dilation * 11.5);
	line(x + dilation * 13, y + dilation * 11.5, x + dilation * 16, y + dilation * 10);
	line(x + dilation * 16, y + dilation * 10, x + dilation * 19.5, y + dilation * 11);
	line(x + dilation * 9.5, y + dilation * 10.5, x + dilation * 8.5, y + dilation * 15);
	line(x + dilation * 8.5, y + dilation * 15, x + dilation * 5.5, y + dilation * 17);
	line(x + dilation * 5.5, y + dilation * 17, x + dilation * 5, y + dilation * 20);
	line(x + dilation * 10.5, y + dilation * 10.5, x + dilation * 11.5, y + dilation * 15);
	line(x + dilation * 11.5, y + dilation * 15, x + dilation * 14.5, y + dilation * 17);
	line(x + dilation * 14.5, y + dilation * 17, x + dilation * 15, y + dilation * 20);
	return;
}

function drawGillSnail (x, y) {
	fill('#8c3416');
	beginShape();
	vertex(x + dilation * 5, y + dilation * 15);
	vertex(x + dilation * 5, y + dilation * 9);
	vertex(x + dilation * 8, y + dilation * 6);
	vertex(x + dilation * 12, y + dilation * 6);
	vertex(x + dilation * 15, y + dilation * 9);
	vertex(x + dilation * 15, y + dilation * 13.5);
	vertex(x + dilation * 13, y + dilation * 18);
	vertex(x + dilation * 8.5, y + dilation * 15.5);
	vertex(x + dilation * 5, y + dilation * 15);
	endShape(CLOSE);
	fill('#ecdc74');
	beginShape();
	vertex(x + dilation * 8.5, y + dilation * 15.5);
	vertex(x + dilation * 2, y + dilation * 15);
	vertex(x, y + dilation * 18.5);
	vertex(x + dilation * 9, y + dilation * 18.5);
	vertex(x + dilation * 13, y + dilation * 18.5);
	vertex(x + dilation * 8.5, y + dilation * 15.5);
	endShape(CLOSE);
	line(x + dilation * 8.5, y + dilation * 15.5, x + dilation * 13, y + dilation * 11.5);
	line(x + dilation * 13, y + dilation * 11.5, x + dilation * 10, y + dilation * 8.5);
	line(x + dilation * 10, y + dilation * 8.5, x + dilation * 7.5, y + dilation * 9);
	line(x + dilation * 7.5, y + dilation * 9, x + dilation * 7.75, y + dilation * 12);
	line(x + dilation * 7.75, y + dilation * 12, x + dilation * 9, y + dilation * 13);
	line(x + dilation * 9, y + dilation * 13, x + dilation * 10, y + dilation * 11);
	line(x + dilation * 10, y + dilation * 11, x + dilation * 9, y + dilation * 10);
	line(x + dilation * 9, y + dilation * 10, x + dilation * 8.75, y + dilation * 11);
	return;
}

function drawDobsonfly (x, y) {
	fill('#e2a657');
	beginShape();
	vertex(x + dilation * 11, y + dilation * 5);
	vertex(x + dilation * 11.5, y + dilation * 5.5);
	vertex(x + dilation * 11, y + dilation * 6);
	vertex(x + dilation * 11, y + dilation * 8);
	vertex(x + dilation * 10.25, y + dilation * 17);
	vertex(x + dilation * 9.75, y + dilation * 17);
	vertex(x + dilation * 9, y + dilation * 8);
	vertex(x + dilation * 9, y + dilation * 6);
	vertex(x + dilation * 8.5, y + dilation * 5.5);
	vertex(x + dilation * 9, y + dilation * 5);
	vertex(x + dilation * 11, y + dilation * 5);
	endShape(CLOSE);
	fill('#936638');
	beginShape();
	vertex(x + dilation * 11, y + dilation * 8);
	vertex(x + dilation * 12, y + dilation * 10);
	vertex(x + dilation * 13, y + dilation * 15);
	vertex(x + dilation * 12, y + dilation * 17.5);
	vertex(x + dilation * 11, y + dilation * 17.5);
	vertex(x + dilation * 10, y + dilation * 15);
	vertex(x + dilation * 9, y + dilation * 17.5);
	vertex(x + dilation * 8, y + dilation * 17.5);
	vertex(x + dilation * 7, y + dilation * 15);
	vertex(x + dilation * 8, y + dilation * 10);
	vertex(x + dilation * 9, y + dilation * 8);
	vertex(x + dilation * 11, y + dilation * 8);
	endShape(CLOSE);
	return;
}

function drawCrayfish (x, y) {
	// (╯°□°)╯︵ ┻━┻
	fill('#f85434');
	beginShape();
	vertex(x + dilation * 14.66, y + dilation * 18.5);
	vertex(x + dilation * 14, y + dilation * 18);
	vertex(x + dilation * 14.33, y + dilation * 17.5);
	vertex(x + dilation * 14, y + dilation * 16.5);
	vertex(x + dilation * 12.5, y + dilation * 16);
	vertex(x + dilation * 12.2, y + dilation * 15.5);
	vertex(x + dilation * 11.5, y + dilation * 15.2);
	vertex(x + dilation * 11.5, y + dilation * 14.8);
	vertex(x + dilation * 10.2, y + dilation * 14.8);
	vertex(x + dilation * 10, y + dilation * 13.5);
	vertex(x + dilation * 7.5, y + dilation * 12);
	vertex(x + dilation * 6, y + dilation * 9);
	vertex(x + dilation * 5.5, y + dilation * 6.5);
	vertex(x + dilation * 5, y + dilation * 6);
	vertex(x + dilation * 5.5, y + dilation * 6);
	vertex(x + dilation * 5.5, y + dilation * 5);
	vertex(x + dilation * 7, y + dilation * 6);
	vertex(x + dilation * 8.5, y + dilation * 7);
	vertex(x + dilation * 11.5, y + dilation * 8);
	vertex(x + dilation * 12.5, y + dilation * 12);
	vertex(x + dilation * 13, y + dilation * 12.2);
	vertex(x + dilation * 13.2, y + dilation * 13);
	vertex(x + dilation * 14.2, y + dilation * 13);
	vertex(x + dilation * 14.5, y + dilation * 14);
	vertex(x + dilation * 15, y + dilation * 14.2);
	vertex(x + dilation * 15, y + dilation * 15);
	vertex(x + dilation * 15.5, y + dilation * 15);
	vertex(x + dilation * 17.5, y + dilation * 14.8);
	vertex(x + dilation * 18, y + dilation * 15.5);
	vertex(x + dilation * 17.5, y + dilation * 17);
	vertex(x + dilation * 15.5, y + dilation * 18);
	vertex(x + dilation * 14.66, y + dilation * 18.5);
	endShape(CLOSE);
	beginShape();
	vertex(x + dilation * 8.5, y + dilation * 7);
	vertex(x + dilation * 8, y + dilation * 5);
	vertex(x + dilation * 7.5, y + dilation * 3);
	vertex(x + dilation * 5, y + dilation * 2);
	vertex(x + dilation * 5, y);
	vertex(x + dilation * 7, y + dilation * 2.5);
	vertex(x + dilation * 6.5, y + dilation);
	vertex(x + dilation * 5, y);
	vertex(x + dilation * 7.5, y);
	vertex(x + dilation * 8, y + dilation * 0.5);
	vertex(x + dilation * 7.5, y + dilation * 3);
	vertex(x + dilation * 9, y + dilation * 5);
	vertex(x + dilation * 9, y + dilation * 7.2);
	vertex(x + dilation * 8.5, y + dilation * 7);
	endShape(CLOSE);
	beginShape();
	vertex(x + dilation * 5.8, y + dilation * 8.5);
	vertex(x + dilation * 5, y + dilation * 8.5);
	vertex(x + dilation * 3, y + dilation * 7);
	vertex(x + dilation * 0.5, y + dilation * 6.5);
	vertex(x, y + dilation * 6);
	vertex(x + dilation * 0.5, y + dilation * 3.5);
	vertex(x + dilation * 1.5, y + dilation * 5.5);
	vertex(x + dilation * 2.5, y + dilation * 6);
	vertex(x + dilation * 1, y + dilation * 3.5);
	vertex(x + dilation * 1.5, y + dilation * 4);
	vertex(x + dilation * 3.5, y + dilation * 6.5);
	vertex(x + dilation * 5, y + dilation * 7.5);
	vertex(x + dilation * 5.5, y + dilation * 7.5);
	vertex(x + dilation * 5.8, y + dilation * 8.5);
	endShape(CLOSE);
	beginShape();
	vertex(x + dilation * 6, y + dilation * 9);
	vertex(x + dilation * 5, y + dilation * 10.5);
	vertex(x + dilation * 2.5, y + dilation * 10);
	vertex(x + dilation * 5, y + dilation * 11);
	vertex(x + dilation * 6, y + dilation * 9);
	endShape(CLOSE);
	beginShape();
	vertex(x + dilation * 6.5, y + dilation * 10.5);
	vertex(x + dilation * 5.5, y + dilation * 12);
	vertex(x + dilation * 3, y + dilation * 12.5);
	vertex(x + dilation * 5.5, y + dilation * 12.5);
	vertex(x + dilation * 6.5, y + dilation * 10.5);
	endShape(CLOSE);
	beginShape();
	vertex(x + dilation * 7, y + dilation * 11.5);
	vertex(x + dilation * 6.5, y + dilation * 12.5);
	vertex(x + dilation * 4.5, y + dilation * 14);
	vertex(x + dilation * 6.5, y + dilation * 13);
	vertex(x + dilation * 7, y + dilation * 11.5);
	endShape(CLOSE);
	beginShape();
	vertex(x + dilation * 10, y + dilation * 7.33);
	vertex(x + dilation * 11, y + dilation * 5.5);
	vertex(x + dilation * 10, y + dilation * 3);
	vertex(x + dilation * 11.2, y + dilation * 5);
	vertex(x + dilation * 10, y + dilation * 7.33);
	endShape(CLOSE);
	beginShape();
	vertex(x + dilation * 10.5, y + dilation * 7.66);
	vertex(x + dilation * 12.5, y + dilation * 5.66);
	vertex(x + dilation * 12, y + dilation * 3);
	vertex(x + dilation * 13, y + dilation * 6);
	vertex(x + dilation * 10.5, y + dilation * 7.66);
	endShape(CLOSE);
	beginShape();
	vertex(x + dilation * 11, y + dilation * 8);
	vertex(x + dilation * 13, y + dilation * 7.5);
	vertex(x + dilation * 13.5, y + dilation * 5);
	vertex(x + dilation * 13.2, y + dilation * 7.5);
	vertex(x + dilation * 11, y + dilation * 8);
	endShape(CLOSE);
	line(x + dilation * 5.5, y + dilation * 5, x + dilation * 10, y + dilation * 3.5);
	line(x + dilation * 10, y + dilation * 3.5, x + dilation * 15, y + dilation * 4);
	line(x + dilation * 5, y + dilation * 5.5, x + dilation * 2.5, y + dilation * 10);
	line(x + dilation * 2.5, y + dilation * 10, x + dilation * 4, y + dilation * 15);
	return;
}

function drawBlackfly (x, y) {
	fill('#686464');
	beginShape();
	vertex(x + dilation * 10.5, y + dilation * 5);
	vertex(x + dilation * 11.5, y + dilation * 6.5);
	vertex(x + dilation * 10.5, y + dilation * 8);
	vertex(x + dilation * 11.5, y + dilation * 12);
	vertex(x + dilation * 10.5, y + dilation * 17.5);
	vertex(x + dilation * 9.5, y + dilation * 17.5);
	vertex(x + dilation * 8.5, y + dilation * 12);
	vertex(x + dilation * 9.5, y + dilation * 8);
	vertex(x + dilation * 8.5, y + dilation * 6.5);
	vertex(x + dilation * 9.5, y + dilation * 5);
	vertex(x + dilation * 10.5, y + dilation * 5);
	endShape();
	fill('#e0f4fc');
	beginShape();
	vertex(x + dilation * 10, y + dilation * 10.5);
	vertex(x + dilation * 11, y + dilation * 9.5);
	vertex(x + dilation * 14.5, y + dilation * 12.5);
	vertex(x + dilation * 14, y + dilation * 16);
	vertex(x + dilation * 12, y + dilation * 15);
	vertex(x + dilation * 10, y + dilation * 10.5);
	endShape();
	beginShape();
	vertex(x + dilation * 10, y + dilation * 10.5);
	vertex(x + dilation * 9, y + dilation * 9.5);
	vertex(x + dilation * 5.5, y + dilation * 12.5);
	vertex(x + dilation * 6, y + dilation * 16);
	vertex(x + dilation * 8, y + dilation * 15);
	vertex(x + dilation * 10, y + dilation * 10.5);
	endShape();
	line(x + dilation * 10.5, y + dilation * 8, x + dilation * 13, y + dilation * 6.5);
	line(x + dilation * 13, y + dilation * 6.5, x + dilation * 15.5, y + dilation * 6);
	line(x + dilation * 9.5, y + dilation * 8, x + dilation * 7, y + dilation * 6.5);
	line(x + dilation * 7, y + dilation * 6.5, x + dilation * 4.5, y + dilation * 6);
	line(x + dilation * 11, y + dilation * 9.5, x + dilation * 13.5, y + dilation * 8);
	line(x + dilation * 13.5, y + dilation * 8, x + dilation * 17, y + dilation * 9);
	line(x + dilation * 9, y + dilation * 9.5, x + dilation * 6.5, y + dilation * 8);
	line(x + dilation * 6.5, y + dilation * 8, x + dilation * 3, y + dilation * 9);
	line(x + dilation * 11.5, y + dilation * 10, x + dilation * 13, y + dilation * 10.5);
	line(x + dilation * 13, y + dilation * 10.5, x + dilation * 15.5, y + dilation * 13);
	line(x + dilation * 8.5, y + dilation * 10, x + dilation * 7, y + dilation * 10.5);
	line(x + dilation * 7, y + dilation * 10.5, x + dilation * 4.5, y + dilation * 13);
	return;
}

function drawMidge (x, y) {
	fill('#674f3c');
	beginShape();
	vertex(x + dilation * 6.5, y + dilation * 8.5);
	vertex(x + dilation * 7.5, y + dilation * 8);
	vertex(x + dilation * 12.5, y + dilation * 8);
	vertex(x + dilation * 17.5, y + dilation * 9.5);
	vertex(x + dilation * 17.5, y + dilation * 10.5);
	vertex(x + dilation * 12.5, y + dilation * 12);
	vertex(x + dilation * 7.5, y + dilation * 12);
	vertex(x + dilation * 6.5, y + dilation * 11.5)
	vertex(x + dilation * 6.5, y + dilation * 8.5);
	endShape(CLOSE);
	fill('#dacebc');
	beginShape();
	vertex(x + dilation * 7.5, y + dilation * 8);
	vertex(x + dilation * 12, y + dilation * 7);
	vertex(x + dilation * 14.5, y + dilation * 7);
	vertex(x + dilation * 14.5, y + dilation * 8);
	vertex(x + dilation * 12.5, y + dilation * 9);
	vertex(x + dilation * 7.5, y + dilation * 10);
	vertex(x + dilation * 7.5, y + dilation * 8);
	endShape(CLOSE);
	beginShape();
	vertex(x + dilation * 7.5, y + dilation * 12);
	vertex(x + dilation * 12, y + dilation * 13);
	vertex(x + dilation * 14.5, y + dilation * 13);
	vertex(x + dilation * 14.5, y + dilation * 12);
	vertex(x + dilation * 12.5, y + dilation * 11);
	vertex(x + dilation * 7.5, y + dilation * 10);
	vertex(x + dilation * 7.5, y + dilation * 12);
	endShape(CLOSE);
	line(x + dilation * 7.5, y + dilation * 8, x + dilation * 2.5, y + dilation * 7.5);
	line(x + dilation * 2.5, y + dilation * 7.5, x, y + dilation * 6.5);
	line(x + dilation * 7.5, y + dilation * 12, x + dilation * 2.5, y + dilation * 12.5);
	line(x + dilation * 2.5, y + dilation * 12.5, x, y + dilation * 13.5);
	line(x + dilation * 7.5, y + dilation * 8, x + dilation * 8.5, y + dilation * 6.5);
	line(x + dilation * 8.5, y + dilation * 6.5, x + dilation * 6.5, y + dilation * 5);
	line(x + dilation * 6.5, y + dilation * 5, x + dilation * 5, y + dilation * 2.5);
	line(x + dilation * 7.5, y + dilation * 12, x + dilation * 8.5, y + dilation * 13.5);
	line(x + dilation * 8.5, y + dilation * 13.5, x + dilation * 6.5, y + dilation * 15);
	line(x + dilation * 6.5, y + dilation * 15, x + dilation * 5, y + dilation * 17.5);
	line(x + dilation * 7.5, y + dilation * 8, x + dilation * 12.5, y + dilation * 7);
	line(x + dilation * 12.5, y + dilation * 7, x + dilation * 15, y + dilation * 3);
	line(x + dilation * 7.5, y + dilation * 12, x + dilation * 12.5, y + dilation * 13);
	line(x + dilation * 12.5, y + dilation * 13, x + dilation * 15, y + dilation * 17);
	return 0;
}

function drawWorm (x, y) {
	fill('#C68994');
	beginShape();
	vertex(x + dilation * 7.5, y + dilation * 18);
	vertex(x + dilation * 10, y + dilation * 17);
	vertex(x + dilation * 12, y + dilation * 15);
	vertex(x + dilation * 12, y + dilation * 13);
	vertex(x + dilation * 10, y + dilation * 12.5);
	vertex(x + dilation * 7.5, y + dilation * 12.4);
	vertex(x + dilation * 5, y + dilation * 11.5);
	vertex(x + dilation * 3, y + dilation * 10);
	vertex(x + dilation * 2.5, y + dilation * 7.5);
	vertex(x + dilation * 3, y + dilation * 5);
	vertex(x + dilation * 5, y + dilation * 3);
	vertex(x + dilation * 7.5, y + dilation * 2.5);
	vertex(x + dilation * 8, y + dilation * 4.5);
	vertex(x + dilation * 6.7, y + dilation * 5);
	vertex(x + dilation * 5, y + dilation * 6.5);
	vertex(x + dilation * 5, y + dilation * 8.5);
	vertex(x + dilation * 6, y + dilation * 9.8);
	vertex(x + dilation * 8, y + dilation * 10);
	vertex(x + dilation * 11, y + dilation * 10.5);
	vertex(x + dilation * 13, y + dilation * 12);
	vertex(x + dilation * 14.5, y + dilation * 13.5);
	vertex(x + dilation * 14, y + dilation * 15);
	vertex(x + dilation * 12, y + dilation * 17.5);
	vertex(x + dilation * 9, y + dilation * 19);
	vertex(x + dilation * 7.5, y + dilation * 18);
	endShape(CLOSE);
	return;
}

function drawLungSnail (x, y) {
	fill('#5a462e');
	beginShape();
	vertex(x + dilation * 5, y + dilation * 15);
	vertex(x + dilation * 5, y + dilation * 9);
	vertex(x + dilation * 8, y + dilation * 6);
	vertex(x + dilation * 12, y + dilation * 6);
	vertex(x + dilation * 15, y + dilation * 9);
	vertex(x + dilation * 15, y + dilation * 13.5);
	vertex(x + dilation * 13, y + dilation * 18);
	vertex(x + dilation * 8.5, y + dilation * 15.5);
	vertex(x + dilation * 5, y + dilation * 15);
	endShape(CLOSE);
	fill('#9c9a81');
	beginShape();
	vertex(x + dilation * 8.5, y + dilation * 15.5);
	vertex(x + dilation * 2, y + dilation * 15);
	vertex(x, y + dilation * 18.5);
	vertex(x + dilation * 9, y + dilation * 18.5);
	vertex(x + dilation * 13, y + dilation * 18.5);
	vertex(x + dilation * 8.5, y + dilation * 15.5);
	endShape(CLOSE);
	line(x + dilation * 8.5, y + dilation * 15.5, x + dilation * 13, y + dilation * 11.5);
	line(x + dilation * 13, y + dilation * 11.5, x + dilation * 10, y + dilation * 8.5);
	line(x + dilation * 10, y + dilation * 8.5, x + dilation * 7.5, y + dilation * 9);
	line(x + dilation * 7.5, y + dilation * 9, x + dilation * 7.75, y + dilation * 12);
	line(x + dilation * 7.75, y + dilation * 12, x + dilation * 9, y + dilation * 13);
	line(x + dilation * 9, y + dilation * 13, x + dilation * 10, y + dilation * 11);
	line(x + dilation * 10, y + dilation * 11, x + dilation * 9, y + dilation * 10);
	line(x + dilation * 9, y + dilation * 10, x + dilation * 8.75, y + dilation * 11);
	return;
}

function drawLeech (x, y) {
	fill('#402f24');
	beginShape();
	vertex(x + dilation * 7.5, y + dilation * 18);
	vertex(x + dilation * 10, y + dilation * 17);
	vertex(x + dilation * 12, y + dilation * 15);
	vertex(x + dilation * 12, y + dilation * 13);
	vertex(x + dilation * 10, y + dilation * 12.5);
	vertex(x + dilation * 7.5, y + dilation * 12.4);
	vertex(x + dilation * 5, y + dilation * 11.5);
	vertex(x + dilation * 3, y + dilation * 10);
	vertex(x + dilation * 2.5, y + dilation * 7.5);
	vertex(x + dilation * 3, y + dilation * 5);
	vertex(x + dilation * 5, y + dilation * 3);
	vertex(x + dilation * 7.5, y + dilation * 2.5);
	vertex(x + dilation * 8, y + dilation * 4.5);
	vertex(x + dilation * 6.7, y + dilation * 5);
	vertex(x + dilation * 5, y + dilation * 6.5);
	vertex(x + dilation * 5, y + dilation * 8.5);
	vertex(x + dilation * 6, y + dilation * 9.8);
	vertex(x + dilation * 8, y + dilation * 10);
	vertex(x + dilation * 11, y + dilation * 10.5);
	vertex(x + dilation * 13, y + dilation * 12);
	vertex(x + dilation * 14.5, y + dilation * 13.5);
	vertex(x + dilation * 14, y + dilation * 15);
	vertex(x + dilation * 12, y + dilation * 17.5);
	vertex(x + dilation * 9, y + dilation * 19);
	vertex(x + dilation * 7.5, y + dilation * 18);
	endShape(CLOSE);
	return;
}

function drawSowbug (x, y) {
	x += 10; y += 20;
	fill('#605545');
	ellipse(x, y, 14, 22);
	line(x, y - 10.5, x - 4, y - 16);
	line(x, y - 10.5, x + 4, y - 16);
	line(x - 4, y - 16, x - 6.5, y - 17);
	line(x + 4, y - 16, x + 6.5, y - 17);
	line(x - 5, y, x + 5, y);
	line(x - 3, y - 4, x + 3, y - 4);
	line(x - 3, y + 4, x + 3, y + 4);
	return;
}
