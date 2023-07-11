# Implementing Custom Functions in an AI Agent with Hyv

## Overview

This guide introduces the usage of custom functions in an AI agent using the Hyv library. We will
create an AI agent, assign a weather reporting function to it, and interact with the agent using the
`assign` method. Questions answered by this guide include: How do you create an `Agent` in Hyv? How
can you add a custom function to an `Agent`? How can you call the custom function and handle the
`Agent`'s response?

## Prerequisites

To follow this guide successfully, you should have basic understanding of JavaScript or TypeScript,
and some familiarity with the Hyv library's `Agent` and `GPTModelAdapter`.

## Guide

### Creating the Custom Function

We will create a mock `getWeather` function that simulates fetching weather data. This function will
later be assigned to our agent.

```typescript
const functions = {
    async getWeather({ location }: { location: string }) {
        return JSON.stringify({
            location,
            temperature: "24",
            unit: "celsius",
            forecast: ["sunny", "windy"],
        });
    },
};
```

### Setting up the Agent

We start by importing the necessary classes and creating an `Agent` object using the
`GPTModelAdapter`.

```typescript
import { Agent } from "@hyv/core/agent";
import { GPTModelAdapter } from "@hyv/openai/gpt-model-adapter";

const agent = new Agent(
    new GPTModelAdapter({
        historySize: 3,
        functions: [
            {
                fn: getWeather,
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
        ],
    })
);
```

### Interacting with the Agent

In this step, we will assign a question to the agent and handle its response. The agent will
automatically handle the function call through the `GPTModelAdapter`.

```typescript
try {
    const { message } = await agent.assign({ question: "What is the weather in Berlin, Germany?" });

    console.log(message);
} catch (error) {
    console.error("Error:", error);
}
```

## Expected Output

After executing the code, the agent will assign a task to the `getWeather` function, which will
return mock weather data for Berlin, Germany. The returned result will be logged to the console, and
then passed back to the agent, which will provide a final response also logged to the console.

```json
{
    "location": "Berlin, Germany",
    "temperature": "24",
    "unit": "celsius",
    "forecast": ["sunny", "windy"]
}
```

## Summary

In this guide, we have demonstrated how to set up an AI agent using the Hyv library, add a custom
function to the agent, and interact with it by assigning tasks. The concepts and steps explained in
this guide enable developers to leverage the power of AI models and custom functions to build
interactive and intelligent applications.

## Tags

Hyv, JavaScript, TypeScript, GPTModelAdapter, Agent, Custom Functions, assign Method
