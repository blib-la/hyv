// Import the 'path' module from Node.js. The 'path' module provides utilities for working with file and directory paths.
import path from "node:path";

// Import the 'Agent' class and the 'sequence' function from the '@hyv/core' module.
// 'Agent' allows you to create an agent that can execute tasks.
// 'sequence' is a function that allows you to execute a sequence of tasks in a specific order.
import { Agent, sequence } from "@hyv/core";

// Import the 'Automatic1111ModelAdapter' class from the '@hyv/stable-diffusion' module.
// This class provides an adapter for the 'Automatic1111' model, which is a specific type of model used in the Hyv AI system.
import { Automatic1111ModelAdapter } from "@hyv/stable-diffusion";

// Import the 'createFileWriter' function from the '@hyv/utils' module.
// This function allows you to create a file writer, which is an object that can write data to a file.
import { createFileWriter } from "@hyv/utils";

// Call the 'createFileWriter' function to create a new file writer.
// The file writer will write files to a directory named 'stable-diffusion' inside the 'output' directory,
// located in the directory where the script is run from.
// The file writer will encode the written data in base64 format.
const imageWriter = createFileWriter(
	path.join(process.cwd(), `examples/output/stable-diffusion/${Date.now()}`),
	"base64"
);

// Create a new agent.
// We pass in a new instance of 'Automatic1111ModelAdapter', and set the number of steps to 20 and cfgScale to 7.
// The second parameter is an options object where we specify 'sideEffects'.
// The 'sideEffects' option is used to specify an array of side effect handlers, which can handle the output of the agent.
// Here, we set 'imageWriter' as our side effect handler which will write any output images to a file.
const agent = new Agent(new Automatic1111ModelAdapter({ steps: 20, cfgScale: 7 }), {
	sideEffects: [imageWriter],
});

// Now, we use a try/catch block to handle any potential errors that could occur when executing the sequence of tasks.
try {
	// The 'sequence' function allows you to execute a sequence of tasks in a specific order.
	// We pass an object with an 'images' property containing an array of tasks for the agent to complete.
	// In this case, the task is to process an image named 'image.png', with the goal of creating a "portrait of a clown",
	// while avoiding "worst quality".
	// We also pass our 'agent' into the sequence function to execute these tasks.
	await sequence(
		{
			images: [
				{
					path: "image.png",
					prompt: "portrait of a clown",
					negativePrompt: "worst quality",
				},
			],
		},
		[agent]
	);
} catch (error) {
	// If any error happens during the execution of the tasks, it will be caught here.

	// We log the error to the console.
	console.error("Error:", error);
}
