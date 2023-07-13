# Implementing Interactive AI Chat with Hyv

## Overview

This guide demonstrates how to implement an interactive chat with a distinct AI persona using the
Hyv library and Node.js `readline` for terminal-based user input. It addresses questions such as:
How to create an AI persona in Hyv? How to set up user input from the terminal? How to process and
respond to user input using the AI persona?

## Prerequisites

Familiarity with JavaScript or TypeScript, Node.js, and npm installed on your system. Knowledge of
Hyv's `Agent`, `createInstructionPersona`, and `GPTModelAdapter` is beneficial.

## Guide

### Setting Up Required Imports

Begin by importing the necessary modules from Node.js and Hyv's packages.

```typescript
import readline from "readline";
import { Agent } from "@hyv/core";
import { GPTModelAdapter, createInstructionPersona } from "@hyv/openai";
```

### Constructing an Agent with Persona

Next, create an `Agent` with a defined persona using the `GPTModelAdapter`.

```typescript
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
```

### Initiating Readline Interface

Then, initialize the `readline` interface to read user input from the terminal.

```typescript
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
```

### Implementing the Chat Function

Define the function that facilitates user-agent interaction, receives user input, assigns the input
to the agent, and logs the agent's response.

```typescript
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
```

### Starting the Chat

Lastly, initiate the chat by calling the `chat` function.

```typescript
chat();
```

## Summary

By following this guide, you have set up an interactive terminal chat with an AI persona. The chat
will continue until manually terminated. Further exploration could involve creating diverse personas
or handling more complex conversational structures.

## Tags

Hyv, JavaScript, TypeScript, Node.js, readline, AI Chat, GPT-4, Agent, Persona, GPTModelAdapter
