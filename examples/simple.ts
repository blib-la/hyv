// We start by importing necessary modules.
// The 'Agent' class from '@hyv/core' provides methods for creating an instance of an agent,
// assigning it tasks, and managing its behavior.
// The 'sequence' function from '@hyv/core' allows you to execute a sequence of tasks in a particular order.
import { Agent, sequence } from "@hyv/core";

// 'GPTModelAdapter' from '@hyv/openai' is a class that acts as a wrapper
// or "adapter" for the GPT-4 language model. This makes it easier for us to interact with the GPT-4 model.
import { GPTModelAdapter } from "@hyv/openai";

// Here we instantiate a new 'Agent' object, passing a new 'GPTModelAdapter' instance to it.
// We also pass an options object to the 'Agent' constructor, which includes the 'verbosity' option.
// The verbosity level controls how much information the agent includes in its output.
// A verbosity of 1 means that the agent will only include the most important information in its output.
const agent = new Agent(new GPTModelAdapter(), { verbosity: 1 });

// Now we use a try/catch block to handle potential errors that could occur when we assign tasks to the agent.
try {
	// The 'sequence' function allows you to execute a sequence of tasks in a specific order.
	// The first argument to 'sequence' is the task to be assigned.
	// The second argument is an array of agents that are to execute the tasks. In this case, we only have one agent.
	// The 'sequence' function is asynchronous, so we need to use the 'await' keyword to wait for the sequence of tasks to complete.
	await sequence({ question: "What is life?" }, [agent]);
} catch (error) {
	// If any errors occur during the execution of the try block, they will be caught here.

	// We log any errors to the console.
	console.error("Error:", error);
}
