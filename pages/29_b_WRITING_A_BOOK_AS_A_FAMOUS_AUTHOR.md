# Using the J.R.R. Tolkien AI Persona to Write a Book

## Overview

In the second part of our guide series, we will demonstrate how to employ the AI persona of J.R.R.
Tolkien that we established in the previous guide to write a story.

## Prerequisites

Ensure that you have followed the first part of this guide series - "Preparing the AI Persona for
Writing a Book - Setting up the J.R.R. Tolkien AI Persona" and have a functioning AI persona ready
for use.

## Guide

### Establishing the AI Agent

With our persona and instructions ready, we will create an agent with the `GPTModelAdapter` model,
using the persona we set up. We'll also add a FileWriter as a side effect:

```typescript
const dir = path.join(process.cwd(), `examples/output/${Date.now()}`);
const fileWriter = createFileWriter(dir);
const tolkienAgent = new Agent(
    new GPTModelAdapter({
        model: "gpt-4",
        historySize: 3,
        systemInstruction: tolkienInstruction,
    }),
    {
        verbosity: 1,
        sideEffects: [fileWriter],
    }
);
```

### Writing the Story

Now that our agent is prepared, we can embark on the writing process. In this example, we will
generate a three-chapter book:

```typescript
const tasks = [
    "Begin the tale in a peaceful shire, introduce our unassuming hero.",
    "Our hero hears an ancient prophecy and sets out on a great journey.",
    "Our hero faces the final challenge, an epic confrontation with an ancient evil.",
];

const fileWriter = createFileWriter();

for (let i = 0; i < tasks.length; i++) {
    await tolkienAgent.assign({ task: tasks[i], wordCount: ">=1000" }).catch(console.error);
}
```

## Summary

By the end of this guide, we have successfully generated a three-chapter story inspired by J.R.R.
Tolkien's writing style. The story is created with the assistance of our AI agent using the GPT-4
model, exhibiting the powerful capabilities of the Hyv library.

## Tags

hyv, gpt-4, artificial-intelligence, ai-persona, book-writing, J.R.R. Tolkien, story-generation
