// We start by importing necessary modules.
// The 'Agent' class from '@hyv/core/agent' provides methods for creating an instance of an agent,
// assigning it tasks, and managing its behavior.
import { Agent } from "@hyv/core/agent";

// 'GPTModelAdapter' from '@hyv/openai/gpt-model-adapter' is a class that acts as a wrapper
// or "adapter" for the GPT-4 language model. This makes it easier for us to interact with the GPT-4 model.
import { GPTModelAdapter } from "@hyv/openai/gpt-model-adapter";

// Here we instantiate a new 'Agent' object, passing a new 'GPTModelAdapter' instance to it.
// The GPTModelAdapter does not require any arguments for its constructor, so we can instantiate it without any parameters.
// The 'Agent' instance ('agent') represents an AI model that we can assign tasks to.
const agent = new Agent(new GPTModelAdapter());

// Now we use a try/catch block to handle potential errors that could occur when we assign tasks to the agent.
try {
	// The 'assign' method of 'Agent' is used to assign a task to the agent.
	// In this case, we're asking the agent a question: "What is time?".
	// The 'assign' method is asynchronous, so we need to use the 'await' keyword to wait for the agent to finish processing the task.
	// The result of the 'assign' method is stored in the 'answer' variable.
	const answer = await agent.assign({ question: "What is time?" });

	// We then log the agent's answer to the console.
	// The 'answer' object has a 'message' property that contains the agent's response.
	console.log(answer.message);
} catch (error) {
	// If any errors occur during the execution of the try block, they will be caught here.

	// We log any errors to the console.
	console.error("Error:", error);
}
