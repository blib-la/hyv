# Using Automatic1111ModelAdapter with Hyv

## Overview

This guide illustrates the use of the `Automatic1111ModelAdapter` with Hyv for image generation. It
addresses questions such as: How to use stable diffusion in Hyv? How to generate images using
automatic1111 image-generation-web-ui?

## Prerequisites

A basic understanding of JavaScript or TypeScript, Node.js, and npm installed on your system.

## Guide

### Import Required Modules

Begin by importing necessary modules from Hyv's packages.

```typescript
import path from "node:path";
import { Agent } from "@hyv/core";
import { Automatic1111ModelAdapter } from "@hyv/stable-diffusion";
import { createFileWriter } from "@hyv/utils";
```

### Establish an Image Writer

Next, utilize the `createFileWriter` function to set up an image writer that will save the generated
image at a specified path.

```typescript
const imageWriter = createFileWriter(
    path.join(process.cwd(), `examples/output/stable-diffusion/${Date.now()}`),
    "base64"
);
```

### Create an Agent

Then, instantiate an `Agent` using the `Automatic1111ModelAdapter` and assign the `sideEffects` to
include the `imageWriter`.

```typescript
const agent = new Agent(new Automatic1111ModelAdapter({ steps: 20, cfgScale: 7 }), {
    sideEffects: [imageWriter],
});
```

### Generate Images

Lastly, use the `sequence` function to generate images. Provide an object with an `images` array,
each containing a `path`, `prompt`, and `negativePrompt`.

```typescript
try {
    await agent.assign({
        images: [
            {
                path: "clown.png",
                prompt: "portrait of a clown",
                negativePrompt: "worst quality",
            },
        ],
    });
} catch (error) {
    console.error("Error:", error);
}
```

## Summary

This guide provided a walkthrough on how to configure the `Automatic1111ModelAdapter` with Hyv for
image generation with stable diffusion. For deeper exploration, try altering the model's parameters
or using different prompts.

## Tags

Hyv, JavaScript, TypeScript, Automatic1111ModelAdapter, Image Generation, Node.js, npm, gradio,
stable diffusion
