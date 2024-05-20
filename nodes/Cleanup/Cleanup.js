const MAX7219 = require("../../control/max7219");

module.exports = function(RED){
	function Cleanup(config){
		RED.nodes.createNode(this, config);

		this.on("input", function(msg, send, done) {
			const flow = this.context().flow;
			if(!flow.MAX7219Context){
				throw new Error("No MAX7219 context. Initialise must be executed.");
			}
			

			try {
				const cleanup = MAX7219.cleanup(spiBus, spiDevice);

			} catch(e){
				this.status({
					fill: "red",
					shape: "ring",
					text: "Failed to cleanup"
				});

				throw new Error(`Failed to cleanup!`)
			}

			this.status({
				fill: "green",
				shape: "dot",
				text: "Cleaned up and released"
			})

			send(msg);
			if(done){
				done();
			}

			return msg;
		});
	}
	RED.nodes.registerType("MAX - Cleanup", Cleanup)
}