// Import the 'path' module from Node.js. This module provides utilities for working with file and directory paths.
import path from "node:path";

// Import the 'Agent' class and 'sequence' function from the '@hyv/core' module.
// The 'Agent' class is used to create an agent that can execute tasks,
// while the 'sequence' function allows you to create a sequence of tasks for the agent to execute.
import { Agent, sequence } from "@hyv/core";

// Import the 'DallEModelAdapter' class from the '@hyv/openai' module.
// This class provides an adapter for the DALL·E model, which is a specific type of model used in the Hyv AI system.
import { DallEModelAdapter } from "@hyv/openai";

// Import the 'createFileWriter' function from the '@hyv/utils' module.
// This function allows you to create a file writer, which can be used to write data to a file.
import { createFileWriter } from "@hyv/utils";

// Create a file writer that writes data to a new file in the 'examples/output/dall-e' directory.
// The new file's name is the current timestamp, and the data format is 'base64'.
const imageWriter = createFileWriter(
	path.join(process.cwd(), `examples/output/dall-e/${Date.now()}`),
	"base64"
);

// Create a new agent with the DALL·E model.
// In addition, we specify a side effect, which is the 'imageWriter' that we created earlier.
// Side effects are operations that the agent performs in addition to its main tasks.
const agent = new Agent(new DallEModelAdapter(), {
	sideEffects: [imageWriter],
});

// Use a try/catch block to handle any errors that may occur when the agent is performing its tasks.
try {
	// The 'sequence' function is used to create a sequence of tasks for the agent to execute.
	// Here, the agent is tasked with generating an image of a "red apple" based on an existing image located at 'assets/bar.png'.
	await sequence({ images: [{ path: "assets/bar.png", prompt: "red apple" }] }, [agent]);
} catch (error) {
	// If any error occurs during the execution of the tasks, it will be caught here.

	// The error message is then logged to the console.
	console.error("Error:", error);
}
