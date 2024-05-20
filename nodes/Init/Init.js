const MAX7219 = require("../../control/max7219");

module.exports = function(RED){
	function InitNode(config){
		RED.nodes.createNode(this, config);

		this.on("input", async function(msg, send, done) {
			
			const spiBus = parseInt(msg.payload?.max7219?.bus || config.spiBus);
			const spiDevice = parseInt(msg.payload?.max7219?.device || config.spiDevice);

			try {
				const context = MAX7219.initialise(spiBus, spiDevice);

				const flow = this.context().flow;
				flow.MAX7219Context = context;
			} catch(e){
				this.status({
					fill: "red",
					shape: "ring",
					text: "Failed to initialise"
				});

				throw new Error(`Failed to initialise device: /dev/spidev${spiBus}.${spiDevice}: ${e.message}`)
			}

			this.status({
				fill: "green",
				shape: "dot",
				text: "Initialised"
			})

			send(msg);
			if(done){
				done();
			}

			return msg;
		});

		this.on("close", function(done) {
			const flow = this.flow.context().flow;
			if(flow.MAX7219Context){
				MAX7219.cleanup(flow.MAX7219Context);

				flow.MAX7219Context = null
			} 

			if(done){
				done();
			}
		})
	}
	RED.nodes.registerType("MAX - Initialise", InitNode)
}