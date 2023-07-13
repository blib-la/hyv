# Performing Calculations with Hyv

## Overview

This guide outlines how to utilize the GPT-4 AI model in Hyv for executing detailed mathematical
calculations. It addresses questions such as: How to get step by step answers? How to create a
mathematical model? How to assign a problem to the agent?

## Prerequisites

Basic knowledge of JavaScript or TypeScript, Node.js, and npm installed on your system.

## Guide

### Import Required Modules

Start by importing necessary modules from Hyv's packages.

```typescript
import { Agent } from "@hyv/core";
import { createInstructionTemplate, GPTModelAdapter } from "@hyv/openai";
```

### Set Up a Mathematical Model

Next, establish a `GPTModelAdapter` specialized for mathematical calculations, using a custom
`systemInstruction`.

```typescript
const mathModel = new GPTModelAdapter({
    model: "gpt-4",
    systemInstruction: createInstructionTemplate(
        "Mathematician",
        "think about the problem, reason your thoughts, solve the problems step by step",
        {
            thought: "detailed string",
            reason: "detailed string",
            steps: ["detailed calculation step"],
            solution: "concise answer",
        }
    ),
});
```

### Create an Agent

Then, instantiate an `Agent` with the `mathModel`, with `verbosity` set to `1` to provide detailed
output.

```typescript
const mathAgent = new Agent(mathModel, { verbosity: 1 });
```

### Assign a Problem to the Agent

Lastly, assign a mathematical problem to the agent using the `assign` method.

```typescript
try {
    const answer = await mathAgent.assign({ problem: "(10 * 4 + 2) / (10 * 2 + 11 * 2) = x" });
    console.log(answer.message);
} catch (error) {
    console.error("Error:", error);
}
```

## Summary

This guide walked you through the process of using Hyv to perform precise calculations, treating the
AI agent as a mathematician. Further exploration could include assigning more complex problems or
altering the model's parameters.

## Tags

Hyv, JavaScript, TypeScript, GPT-4, Calculations, AI, Node.js, npm
