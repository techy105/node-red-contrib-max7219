const SPI = require("spi-device");
const FONTS = require("./fonts");
// Portions of this code have been taken from the great work of: https://github.com/SebSchwartz/node-max7219-led-matrix/blob/master/index.js

const MAX7219_REG_DECODEMODE = 0x9;
const MAX7219_REG_INTENSITY = 0xA;
const MAX7219_REG_SCANLIMIT = 0xB;
const MAX7219_REG_SHUTDOWN = 0xC;
const MAX7219_REG_DISPLAYTEST = 0xF;

const NUM_DIGITS = 8;
const MAX7219_REG_DIGIT0 = 0x1;
const MAX7219_REG_DIGIT1 = 0x2;
const MAX7219_REG_DIGIT2 = 0x3;
const MAX7219_REG_DIGIT3 = 0x4;
const MAX7219_REG_DIGIT4 = 0x5;
const MAX7219_REG_DIGIT5 = 0x6;
const MAX7219_REG_DIGIT6 = 0x7;
const MAX7219_REG_DIGIT7 = 0x8;

function initialise(bus, device, displayCount=1){
	let context;
	try {
		context = SPI.openSync(bus, device, {
			mode: 0
		});

	} catch(e){
		throw new Error(`Cannot open SPI device /dev/spidev${bus}.${device}.`);
	}

	write(context, MAX7219_REG_SCANLIMIT, 7*displayCount);  // show all 8 digits
	write(context, MAX7219_REG_DECODEMODE, 0x0); // use matrix (not digits)
	write(context, MAX7219_REG_DISPLAYTEST, 0x0); // no display test
	write(context, MAX7219_REG_SHUTDOWN, 0x1); // not shutdown mode
	setBrightness(context, 7);

	return context;
}


function write(context, register, value){
	const sendBuffer = Buffer.from([register, value]);
	const message = [{
		sendBuffer: sendBuffer,
		byteLength: 2
	}]

    const response = context.transferSync(message);
	
	console.log("Response: ", response);
}

function setBrightness(context, level){
	if(level < 0 || level > 15){
		throw new Error("Brightness must be between 0 and 15")
	}

	write(context, MAX7219_REG_INTENSITY, level)
	return true;
}

function letter(context, letter, font="CP437_FONT"){
    let asciiCode = letter.charCodeAt(0);

    if(asciiCode > 256 || asciiCode < 0){
        throw 'Bad letter: ' + letter;
    }
	const fontSet = FONTS[font];
	if(!fontSet){
		throw new Error("Bad font: " + font);
	}

    var column = MAX7219_REG_DIGIT0;
    var fontChar = fontSet[asciiCode];
    for(var index in fontChar){
        if(column > MAX7219_REG_DIGIT7){
            clear();
        }
        write(context, column, fontChar[index]);

		wait(10);
        column++;
    }
}



function clear(context){
 	for(var i; i<NUM_DIGITS; i++){
        write(context, MAX7219_REG_DIGIT0 + i, 0x0);
    }

	return true;
}

function cleanup(context){
	if(!context){
		return true;
	}

	setBrightness(context, 15)
	clear(context);

	//Shutdown the display
	write(context, MAX7219_REG_SHUTDOWN, 0x1)
	context.closeSync();
	return true;
}

/** Code below is NOT proted from python **/
function wait(ms){
	const tsNow = Date.now();
	const tsTarget = tsNow + ms;
	while(Date.now() < tsTarget){
		var noop;
	}
}

module.exports = {
	initialise,
	cleanup,
	setBrightness,
	letter
}