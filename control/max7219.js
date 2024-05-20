const SPI = require("spi-device");

async function initialise(bus, device){
	return new Promise( (resolve, reject) => {
		const context  = SPI.open(bus, device, err => {
			if(err){
				return reject(err);
			}
			return resolve(context);
		})
	}) 
}


function cleanup(context){
	if(!context){
		return true;
	}

	context.closeSync();
	return true;
}

module.exports = {
	initialise,
	cleanup
}