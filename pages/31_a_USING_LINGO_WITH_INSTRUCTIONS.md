# Guide: Enhancing System Instructions with Lingo in Hyv

## Overview

In this guide, we aim to help developers understand how to leverage Lingo to create refined and
effective system instructions for a language model using the Hyv library. We will walk you through
how to establish a language model, create potent system instructions using Lingo, and guide the
model's output based on these instructions.

## Prerequisites

A basic understanding of TypeScript and familiarity with the Hyv library is recommended to follow
this guide. You should also acquaint yourself with Lingo using its
[GitHub repository](https://github.com/failfa-st/lingo).

## Guide

### Setting Up a Language Model

Start by importing the necessary modules from the Hyv library.

```typescript
import { Agent } from "@hyv/core";
import { createInstruction, GPTModelAdapter } from "@hyv/openai";
```

### Constructing System Instruction with Lingo

Next, construct a system instruction using Lingo to guide the language model's output. Lingo allows
us to add depth and specificity to the instructions. For instance, for a 'Comedic Writer' persona:

```typescript
const systemInstruction = createInstruction(
    "Comedic Writer, Twitter trend expert",
    minify`
        Follow instructions closely!
        Write a UNIQUE hilarious tweet WITH characters:length(~{{characterCount}}) AND hashtags:length(~{{hashtagCount}}), emojis:length(~{{emojiCount}}), images:length(={{imageCount}})!
        `,
    {
        thought: "very detailed elaborative string",
        decision: "very detailed elaborative string",
        tweet: "Did you know {(comparison)}, because {{term1}} … {{term2}} ?",
    }
);
```

### Guiding the Model's Output

Finally, assign a problem to the model. The AI will respond based on the system instruction you've
defined.

```typescript
const model = new GPTModelAdapter({
    systemInstruction: systemInstruction,
});

const agent = new Agent(model);

try {
    const response = await agent.assign({ task: "Create a hilarious tweet." });
    console.log(response.message);
} catch (error) {
    console.error("Error:", error);
}
```

## Expected Output

Upon following this guide, you will have the ability to create potent system instructions using
Lingo and guide a language model's responses effectively. The model's output will be in sync with
the instructions given.

For example, given the task "Create a hilarious tweet," you might get:

```json
{
    "thought": "How about we compare something unexpected and funny, like cats and cheese...",
    "decision": "Considering the cuteness and comforting purr of cats against the mere good taste of cheese, I decide cats are superior.",
    "tweet": "Did you know cats are better than cheese, because they purr and cheese just tastes good? 😻🧀 #CatsOverCheese #Purrfect"
}
```

## Summary

Through this guide, we learned how to establish a language model, construct system instructions
using Lingo, and guide the model's output using these instructions in Hyv. This ensures the output
is structured and relevant, effectively boosting your model's utility.

## Tags

Hyv, language model, system instructions, TypeScript, guide, Lingo
