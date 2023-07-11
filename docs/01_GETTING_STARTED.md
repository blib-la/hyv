# Getting Started with Hyv Agents

## Overview

This guide will help you understand how to get started with Hyv agents, and how to use them
effectively in your TypeScript projects. It addresses questions like how to install the Hyv library,
create an agent, and assign tasks to it.

## Prerequisites

You must have a basic understanding of TypeScript and Node.js. Additionally, you need to have
Node.js and npm installed on your system. The Hyv library can be installed using npm:

```shell
npm install @hyv/core
```

## Guide

### Importing the Hyv Core Module

Start by importing the core module of Hyv:

```typescript
import { Agent } from "@hyv/core";
```

### Creating a Hyv Agent

You can create a new agent by instantiating the `Agent` class. The `Agent` constructor accepts an
adapter as its argument. For this guide, we will use the `GPTModelAdapter` from `@hyv/openai`:

```typescript
import { GPTModelAdapter } from "@hyv/openai";

const agent = new Agent(new GPTModelAdapter());
```

### Assigning a Task to the Agent

To assign a task to the agent, you can use the `assign` method. This method accepts an object with a
`question` property:

```typescript
const response = await agent.assign({ question: "What is time?" });
console.log(response.message);
```

## Expected Output

After running the above code, you should see the agent's response to your question in the console.
The response is an object with several properties, including `message`, which contains the agent's
answer:

```json
{
    "thought": "Time is a concept that humans use to measure the duration between events.",
    "reason": "It is a way to organize and understand the sequence of events that occur in our lives.",
    "reflection": "Time is a fundamental aspect of our existence, and yet it is something that we cannot see or touch. It is a human construct that helps us make sense of the world around us.",
    "answer": "Time can be defined as the duration between events, and it is a concept that is used to organize and understand the sequence of events that occur in our lives."
}
```

## Summary

This guide introduced you to the basics of using Hyv agents in TypeScript. You learned how to
install the Hyv library, create an agent, and assign tasks to it. For more detailed information, you
can refer to the [official Hyv documentation](https://github.com/failfa-st/hyv).

## Tags

Hyv, TypeScript, AI, Agents, Getting Started, GPT, OpenAI
