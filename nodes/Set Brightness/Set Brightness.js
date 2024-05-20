const MAX7219 = require("../../control/max7219");

module.exports = function(RED){
	function SetBrightness(config){
		RED.nodes.createNode(this, config);

		this.on("input", function(msg, send, done) {
			const flow = this.context().flow;
			if(!flow.MAX7219Context){
				throw new Error("No MAX7219 context. Initialise must be executed.");
			}
			const context = flow.MAX7219Context
			const brightness = parseInt(msg.payload?.max7219?.brightness || config.brightness);


			try {
				MAX7219.setBrightness(context, brightness);

			} catch(e){
				this.status({
					fill: "red",
					shape: "ring",
					text: "Failed to set brightness"
				});

				throw new Error(`Could not set brightness: ${e.message}`)
			}

			this.status({
				fill: "green",
				shape: "dot",
				text: "Brightness set"
			})

			send(msg);
			if(done){
				done();
			}

			return msg;
		});
	}
	RED.nodes.registerType("Set Brightness", SetBrightness)
}