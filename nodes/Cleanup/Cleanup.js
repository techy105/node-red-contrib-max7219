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
				MAX7219.cleanup();

			} catch(e){
				this.status({
					fill: "red",
					shape: "ring",
					text: "Failed to cleanup: " + e.message
				});

				throw new Error(`Failed to cleanup: ${e.message}`)
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