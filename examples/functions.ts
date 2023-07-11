// Import the necessary modules from the Hyv library and Node's utility module
import { Agent } from "@hyv/core/agent";
import { GPTModelAdapter } from "@hyv/openai/gpt-model-adapter";

// Create a new agent from the Hyv library. The agent uses a GPTModelAdapter, which allows it to use a GPT model.
// The GPTModelAdapter is initialized with an array of functions, which describe the capabilities of the agent.
// Here, the agent has two capabilities: getting the weather and getting the population.
const agent = new Agent(
	new GPTModelAdapter({
		functions: [
			{
				// The 'getWeather' function takes a 'location' parameter and returns the current weather.
				async fn({ location }: { location: string }) {
					return JSON.stringify({
						location,
						temperature: "24",
						unit: "celsius",
						forecast: ["sunny", "windy"],
					});
				},
				name: "getWeather",
				description: "Get the current weather in a given location",
				parameters: {
					type: "object",
					properties: {
						location: {
							type: "string",
							description: "The city and state, e.g. San Francisco, CA",
						},
						unit: {
							type: "string",
							enum: ["celsius", "fahrenheit"],
						},
					},
					required: ["location"],
				},
			},
			{
				// The 'getPopulation' function takes a 'location' parameter and returns the current population.
				async fn({ location }: { location: string }) {
					return JSON.stringify({ location, population: 3_755_251 });
				},
				name: "getPopulation",
				description: "Get the population of a given location",
				parameters: {
					type: "object",
					properties: {
						location: {
							type: "string",
							description: "The city and state, e.g. San Francisco, CA",
						},
					},
					required: ["location"],
				},
			},
		],
	}),
	{
		verbosity: 1,
	}
);

// Start a try-catch block to handle errors during the execution of the agent's tasks.
try {
	// Assign a task to the agent and await its response.
	// The task here is to get the weather in Berlin, Germany and the population of Berlin, Germany.
	// The agent will perform these tasks in sequence and integrate the results into a single output.
	// The results will be logged in the console because of the verbosity setting in the agent's configuration.
	await agent.assign({
		question: "What is the weather in Berlin, Germany and what is its population?",
	});
} catch (error) {
	// If an error occurs during the execution of the agent's tasks, log the error message to the console.
	console.error("Error:", error);
}
