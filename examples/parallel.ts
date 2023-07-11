// Import the necessary types and functions from the appropriate modules
import type { ModelMessage } from "@hyv/core"; // This type represents a message for the model
import { Agent } from "@hyv/core"; // This is the main class for creating an AI agent
import { createInstruction, GPTModelAdapter } from "@hyv/openai"; // These are helper functions for creating instructions and an adapter for the GPT model
import type { FileContentWithPath } from "@hyv/utils"; // This type represents file content along with its associated path
import { minify } from "@hyv/utils"; // This function helps to minify large blocks of text

// Create an instruction for a TypeScript Developer
// This instruction describes the tasks the developer agent has to perform
const systemInstruction = createInstruction(
	"TypeScript Developer",
	minify`
	Do tasks. Never ask back.
	Provide a TypeScript function and export it as named export.
	Use DECLARATIVE names.
	ONLY VALID and COMPLETE code.
	Use ESNext/ESM with 'import/export'.
	Create TypeScript files with the solution.
	`,
	{
		thoughts: "your thoughts", // The thoughts of the developer agent
		decision: "your decision", // The decision of the developer agent
		functionNames: ["string"], // The names of the functions the developer agent generates
		files: [
			// The files the developer agent generates
			{
				path: "src/[path/to/filename].ts",
				content: "// Valid TypeScript code",
			},
		],
	}
);

// Create an instruction for an Expert TypeScript Developer, who is a Code Merging expert
// This instruction describes the tasks the expert developer agent has to perform
const systemInstruction2 = createInstruction(
	"Expert TypeScript Developer, Code Merging expert",
	minify`
	Do tasks.
	Think about the task.
	Find duplicates and analyze.
	Merge files in the best way possible.
	Ensure that no duplicate logic is implemented.
	Ensure the same coding style;
	Use ESNext/ESM with 'import/export'.
	Create TypeScript files with the solution.
	`,
	{
		thoughts: "your thoughts", // The thoughts of the expert developer agent
		analysis: "your analysis", // The analysis of the expert developer agent
		potentialDuplicates: ["string"], // The potential duplicate code pieces the expert developer agent identifies
		decision: "your decision", // The decision of the expert developer agent
		files: [
			// The files the expert developer agent generates
			{
				path: "src/[path/to/filename].ts",
				content: "// Valid TypeScript code",
			},
		],
	}
);

// Create the agent with the expert developer instruction
const agent3 = new Agent(
	new GPTModelAdapter({
		model: "gpt-4", // Use GPT-4 model
		maxTokens: 4096, // Limit the response to 4096 tokens
		systemInstruction: systemInstruction2, // Set the instruction for the agent
	}),
	{
		verbosity: 1, // Set the verbosity level to 1
	}
);

// Define a function to instruct the agent and retrieve the results
async function doAndGetResult(task: ModelMessage) {
	const agent = new Agent(
		new GPTModelAdapter({
			model: "gpt-4", // Use GPT-4 model
			maxTokens: 2048, // Limit the response to 2048 tokens
			systemInstruction, // Set the instruction for the agent
		}),
		{
			verbosity: 1, // Set the verbosity level to 1
		}
	);

	// Instruct the agent and return the file results
	return (await agent.assign(task)).message.files;
}

// Begin the main execution
try {
	// Define the main task
	const mainTask = { task: "Write a simple React todo-list app, be creative" };

	// Execute the main task in parallel twice and flatten the results into a single array of files
	const files = (
		await Promise.all(Array.from({ length: 2 }, async () => doAndGetResult(mainTask)))
	).flat() as FileContentWithPath[];

	// Define the merge task
	const mergeTask = {
		task: "merge the code from the pull requests",
		files: files.map(file => ({
			path: file.path,
			content: minify`${file.content}`,
		})),
	};

	// Log the merge results to the console
	console.log("mergedResults", mergeTask);

	// Assign the merge task to the expert agent and get the result
	const result = await agent3.assign(mergeTask);

	// Log the final result to the console
	console.log("result", result.message);
} catch (error) {
	// Catch any error that occurs during the execution
	// Log the error to the console
	console.error("Error:", error);
}
