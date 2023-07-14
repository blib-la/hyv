# Integrating GPT Function Calling into a Hyv Agent

## Overview

This guide provides a step-by-step instruction on integrating GPT function calling into a Hyv Agent.
It addresses how to utilize the capabilities of GPT in a Hyv agent, particularly on executing a task
like getting the weather of a location.

## Prerequisites

To follow this guide, you should:

-   Have a basic understanding of JavaScript/TypeScript.
-   Have Node.js and npm installed on your machine.
-   Have the Hyv and OpenAI libraries installed.

## Guide

### Import Necessary Modules

Start by importing the necessary modules from the Hyv library and Node.js. Here we are importing the
Agent class from the Hyv core library and the GPTModelAdapter from the OpenAI library.

```typescript
import { Agent } from "@hyv/core/agent";
import { GPTModelAdapter } from "@hyv/openai/gpt-model-adapter";
```

### Initialize the GPT Model Adapter

Next, create a new agent from the Hyv library. This agent uses a GPTModelAdapter, which enables it
to utilize a GPT model. The GPTModelAdapter is initialized with an array of functions, which
describe the capabilities of the agent.

In this example, we give our agent the capability of getting the weather.

```typescript
const agent = new Agent(
    new GPTModelAdapter({
        functions: [
            {
                //...getWeather function
            },
        ],
    }),
    {
        verbosity: 1,
    }
);
```

### Define Function Capability

The function capability of the agent takes a parameter and returns a value. This function is called
by GPT and the returned value is used by GPT to perform other tasks.

Here, we define the `getWeather` function:

```typescript
const functions = [
    {
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
        //...parameters
    },
];
```

### Assign a Task to the Agent

Finally, assign a task to the agent and await its response. The agent will execute the task and
integrate the result into a single output.

```typescript
try {
    await agent.assign({
        question: "What is the weather in Berlin, Germany?",
    });
} catch (error) {
    console.error("Error:", error);
}
```

## Expected Output

Upon successful execution, you should expect the agent to return the weather of Berlin, Germany. The
output will be logged to the console due to the verbosity setting in the agent's configuration.

## Summary

You've now successfully integrated GPT function calling into a Hyv Agent. These skills can be
expanded upon to add other functions to the agent and have it execute more complex tasks using the
capabilities of GPT.

## Tags

Hyv, OpenAI, GPT-4, JavaScript, TypeScript, Function Calling, Agent, GPTModelAdapter, Weather
