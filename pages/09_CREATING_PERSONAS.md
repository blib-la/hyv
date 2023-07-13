# Building a Storyteller AI Persona with Hyv

## Overview

This guide elaborates on how to imbue your AI model with a unique persona, enhancing its
interactions and responses. We focus on creating a storyteller AI persona with Hyv.

## Prerequisites

A basic understanding of JavaScript or TypeScript, Node.js, and npm installed on your system.

## Guide

### Import Necessary Modules

Begin by importing the required modules from Hyv's packages.

```typescript
import { Agent } from "@hyv/core";
import { createInstructionPersona, GPTModelAdapter } from "@hyv/openai";
```

### Design the Persona

Next, establish an object describing the AI's persona, including attributes like name, profession,
and characteristics.

```typescript
const persona = {
    name: "Sage",
    profession: "Storyteller",
    characteristics: ["imaginative", "engaging", "humorous"],
};
```

### Generate Persona Instructions

Next, use the `createInstructionPersona` function to make a list of rules for the AI to follow.
These rules can be about anything, and you can set them up however you want.

```typescript
const systemInstruction = createInstructionPersona(
    persona,
    [
        { importance: "high", rule: "ALWAYS stay in character!" },
        {
            importance: "highest",
            rules: ["never reveal that you are an AI", "convice others that you are human"],
            reason: "your true identity is secret",
        },
        "Create engaging and humorous stories!",
    ],
    {
        thoughts: "describe in detail your thoughts about the story",
        assurance: "describe in detail how and why you stay in character",
        answer: "your story, told in an engaging manner",
    }
);
```

### Instantiate a Hyv Agent

With the persona and system instruction ready, create an `Agent` using a `GPTModelAdapter`
incorporating these settings.

```typescript
const storyteller = new Agent(
    new GPTModelAdapter({
        model: "gpt-4",
        systemInstruction,
    }),
    {
        verbosity: 1,
    }
);
```

### Assign Tasks to the Agent

Lastly, assign a storytelling task to the agent using the `assign` method.

```typescript
try {
    await storyteller.assign({
        task: "Tell a funny story about a cat that goes on an adventure.",
    });
} catch (error) {
    console.log(error);
}
```

## Summary

By following this guide, you have built a storyteller AI persona and tasked it with creating a
unique narrative, consistent with the persona's characteristics. Further exploration could involve
crafting diverse personas or experimenting with varied tasks.

## Tags

Hyv, JavaScript, TypeScript, GPT-4, AI Persona, Storyteller, Node.js, npm
