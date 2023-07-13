# Introduction to Image generation with Hyv

## Overview

This guide details how to start using Hyv to generate images. It answers questions such as: How to
use DALL-E in Hyv? How to generate images using DALL-E model?

## Prerequisites

Familiarity with JavaScript or TypeScript, Node.js, and npm installed on your system.

## Guide

### Install Hyv Dependencies

First, install the necessary Hyv dependencies including core, openai, and utils.

```shell
npm install @hyv/core @hyv/openai @hyv/utils
```

### Import Modules

Next, import required modules from Hyv's packages.

```typescript
import path from "node:path";
import { Agent } from "@hyv/core";
import { DallEModelAdapter } from "@hyv/openai";
import { createFileWriter } from "@hyv/utils";
```

### Create DallEModelAdapter

Now, set up a `DallEModelAdapter` which can generate images.

```typescript
const adapter = new DallEModelAdapter({ size: "256x256", n: 1 }, openAI);
```

### Set up an Agent

Then, create an `Agent` using the `DallEModelAdapter` and a file writer side effect.

```typescript
const imageWriter = createFileWriter(
    path.join(process.cwd(), `examples/output/dall-e/${Date.now()}`),
    "base64"
);
const agent = new Agent(new DallEModelAdapter(), {
    sideEffects: [imageWriter],
});
```

### Assign Task to Agent

Next, assign the task of creating an image to the agent.

```typescript
try {
    await agent.assign({ images: [{ path: "assets/red-apple.png", prompt: "red apple" }] });
} catch (error) {
    console.error("Error:", error);
}
```

## Expected Output

After running the script, you should find the generated image at the following path:

```text
examples/output/dall-e/timestamp
```

## Summary

We have learned how to set up and use Hyv to generate images using OpenAI's DALL-E model. For
further learning, explore different configuration options for the DallEModelAdapter and other
utilities provided by Hyv.

## Tags

Hyv, JavaScript, TypeScript, OpenAI, DALL-E, Image Generation, Node.js, npm
