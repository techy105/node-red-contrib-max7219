const MAX7219 = require("../../control/max7219");

module.exports = function(RED){
	function Letter(config){
		RED.nodes.createNode(this, config);

		this.on("input", function(msg, send, done) {
			const flow = this.context().flow;
			if(!flow.MAX7219Context){
				throw new Error("No MAX7219 context. Initialise must be executed.");
			}
			const context = flow.MAX7219Context
			const letter = msg.payload?.max7219?.letter || config.letter;
			const font = msg.payload?.max7219?.font || config.font;


			try {
				MAX7219.letter(context, letter, font);

			} catch(e){
				this.status({
					fill: "red",
					shape: "ring",
					text: "Failed to display letter '"+letter+"'"
				});

				throw new Error(`Could not set letter: ${e.message}`)
			}

			this.status({
				fill: "green",
				shape: "dot",
				text: "Displaying letter '" + letter + "'"
			})

			send(msg);
			if(done){
				done();
			}

			return msg;
		});
	}
	RED.nodes.registerType("MAX - Letter", Letter)
}