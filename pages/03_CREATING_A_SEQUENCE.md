# Create a Sequence with Hyv to Process Multiple Agents

## Overview

This guide will help you understand how to create a sequence with Hyv to process multiple agents.
You will learn how to chain agents to follow a main goal while generating new tasks.

## Prerequisites

You should have a basic understanding of TypeScript and have the Hyv library installed in your
project.

## Guide

### Import Necessary Modules

First, import the necessary modules from the Hyv library.

```typescript
import { Agent, sequence } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";
```

### Create an Agent

Next, create a new agent with the GPTModelAdapter and set the verbosity to 1.

```typescript
const agent = new Agent(new GPTModelAdapter(), { verbosity: 1 });
```

### Run the Sequence

Now, you can run the sequence with a message and an array of agents.

```typescript
try {
    await sequence({ question: "What is life?" }, [agent]);
} catch (error) {
    console.error("Error:", error);
}
```

### Add More Agents

To add more agents, you can create additional agents and include them in the array passed to the
sequence function.

```typescript
const mainGoal = "Make the world a better place!";
const numberOfAgent = 5;
// Create an array of agents
const agents = Array.from<undefined, Agent>(
    { length: numberOfAgent },
    () =>
        new Agent(
            new GPTModelAdapter({
                // Use a larger/better model
                model: "gpt-4",
                // Adust the system instruction so that an agent creates a new task
                systemInstruction: createInstruction(
                    "AI",
                    "think about the task, reason your thoughts, create a new task based on your decision!",
                    {
                        thoughts: "detailed string",
                        reason: "detailed string",
                        task: "full and detailed task without references",
                    }
                ),
            }),
            {
                async before({ task }) {
                    // Only use the mainGoal and task
                    return {
                        task,
                        mainGoal,
                    };
                },
                verbosity: 1,
            }
        )
);

try {
    await sequence({ task: mainGoal }, agents);
} catch (error) {
    console.error("Error:", error);
}
```

## Expected Output

After running the sequence, you should expect to see the output of each agent in the console.

## Summary

You have now learned how to create a sequence with Hyv to process multiple agents. This allows you
to chain agents together to follow a main goal while generating new tasks.

## Tags

Hyv, TypeScript, sequence, agents, GPTModelAdapter, multi-agent processing
