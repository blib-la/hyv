# Generating and Illustrating a Story with Hyv, OpenAI GPT and DALL-E

## Overview

This guide's second part outlines the process of creating the AI agents responsible for generating
the narrative and its corresponding illustrations using Hyv, OpenAI's GPT-4, and DALL-E.

## Prerequisites

Ensure you have followed and completed the steps outlined in the first part of this guide, "Initial
Setup for Generating Illustrated Stories with Hyv, OpenAI GPT and DALL-E."

## Guide

### Developing the Story Creation and Illustration Agents

At this stage, we will create three agents: the `bookAgent` who will define a title and context, the
`author` who will write the story and the `illustrator` who will generate the accompanying images.
(check [the auto book example](../examples/auto-book.ts))

```typescript
import { DallEModelAdapter, GPTModelAdapter } from "@hyv/openai";

const dir = path.join(process.cwd(), `examples/output/auto-book/${Date.now()}`);
const fileWriter = createFileWriterWithReadingTime(dir);
const imageWriter = createFileWriter(dir, "base64");

const bookAgent = new Agent(/*... (code omitted for brevity) */);

const author = new Agent(GPTModelAdapter(/*... (code omitted for brevity) */), {
    // ... (code omitted for brevity)
    sideEffects: [fileWriter],
    async after(message: FilesMessage) {
        return {
            ...message,
            files: message.files.map(file => ({
                ...file,
                content: makeFloatingImages(file.content),
            })),
        };
    },
});

const illustrator = new Agent(DallEModelAdapter(/*... (code omitted for brevity) */), {
    // ... (code omitted for brevity)
    sideEffects: [imageWriter],
});
```

### Defining the Image Placement Function

With the agents set up, we also need to define a function that will control the placement of images
within the generated story. (check [the auto book example](../examples/auto-book.ts))

```typescript
function makeFloatingImages(inputText: string) {
    // ... (code omitted for brevity)
}
```

## Summary

This guide demonstrated how to create and configure AI agents for generating both text and
illustrations in a story using Hyv, OpenAI's GPT-4, and DALL-E. In the next part of the guide, we'll
cover assigning tasks to these agents and generating the final illustrated story.

## Tags

Hyv, OpenAI, GPT-4, DALL-E, TypeScript, Story Generation, AI, Illustrations
