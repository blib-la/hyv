// Import the Agent class from the '@hyv/core' module.
// This class allows you to create an agent that can execute tasks.
import { Agent } from "@hyv/core";

// Import the createInstructionTemplate function and the GPTModelAdapter class from the '@hyv/openai' module.
// createInstructionTemplate function allows you to create instruction templates for the agent,
// which define how the agent should approach a task.
// GPTModelAdapter class provides an adapter for the GPT-4 model, which is a specific type of model used in the Hyv AI system.
import { createInstructionTemplate, GPTModelAdapter } from "@hyv/openai";

// Create a new instance of the GPTModelAdapter class.
// The parameters provided specify the instructions for the model,
// which includes the role of the model ("Mathematician"), the tasks it should complete,
// and the output format it should provide.
const mathModel = new GPTModelAdapter({
	model: "gpt-4",
	systemInstruction: createInstructionTemplate(
		"Mathematician",
		"think about the problem, reason your thoughts, solve the problems step by step",
		{
			thought: "detailed string",
			reason: "detailed string",
			steps: ["detailed calculation step"],
			solution: "concise answer",
		}
	),
});

// Create a new agent with the math model and set the verbosity level to 1.
// The verbosity level controls how much debugging information the agent outputs as it works.
const mathAgent = new Agent(mathModel, { verbosity: 1 });

// Use a try/catch block to handle any errors that may occur when the agent is performing its tasks.
try {
	// The agent is assigned a math problem to solve.
	// The 'assign' method tells the agent to perform a task and then waits for the task to complete.
	const answer = await mathAgent.assign({ problem: "(10 * 4 + 2) / (10 * 2 + 11 * 2) = x" });

	// Once the agent has completed the task, it logs the answer to the console.
	console.log(answer.message);
} catch (error) {
	// If any error occurs during the execution of the tasks, it will be caught here.

	// The error message is then logged to the console.
	console.error("Error:", error);
}
