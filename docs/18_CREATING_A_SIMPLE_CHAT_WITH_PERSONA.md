# Creating a Simple Chat with a Persona using Hyv

Hyv provides a straightforward way to create interactive chats with an AI persona. This can be done
using the Node.js `readline` library for reading user input from the terminal.

## Creating an Interactive Chat

Here is an example of how to create a simple chat with a persona named "James", a Software Engineer,
using Hyv:

```typescript
import readline from "readline";
import { Agent, createInstructionPersona } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";

// Create an agent with a persona
const agent = new Agent(
    new GPTModelAdapter({
        model: "gpt-4",
        systemInstruction: createInstructionPersona(
            {
                name: "James",
                profession: "Software Engineer",
                characteristics: ["analytical", "detail-oriented", "patient"],
            },
            [{ priority: "high", rule: "stay in character" }],
            {
                thoughts: "Analyzing the problem, considering the best approach",
                assurance: "Staying in character as a software engineer",
                answer: "Providing a detailed and analytical response",
            }
        ),
    }),
    { verbosity: 1 }
);

// Create a readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Function to handle the chat
const chat = async () => {
    rl.question("> ", async userInput => {
        // Assign the user's input to the agent
        try {
            const response = await agent.assign({ message: userInput });
            console.log(response.answer);
        } catch (error) {
            console.error("Error:", error);
        }
        // Continue the chat by calling the function again
        chat();
    });
};

// Start the chat
chat();
```

## Understanding the Code

Here's a breakdown of the code:

1. **Creating an Agent**: A new `Agent` object is created with a persona. In this case, the persona
   is 'James', a 'Software Engineer' who is 'analytical', 'detail-oriented', and 'patient'.

2. **Setting up the Readline Interface**: The `readline` library is used to read the user's input
   from the terminal on a line-by-line basis.

3. **Defining the Chat Function**: This function handles the interaction between the user and the
   agent. It uses the `question` method from `readline` to get the user's input, assigns the input
   to the agent, and logs the agent's response.

4. **Running the Chat**: The chat function is called to start the interaction.

This code will create an interactive chat in the terminal with the persona 'James'. The chat will
continue until the program is manually terminated.
