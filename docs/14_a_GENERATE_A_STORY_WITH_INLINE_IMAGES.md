# Initial Setup for Generating Illustrated Stories with Hyv, OpenAI, and DALL-E

## Overview

This guide provides a walk-through on setting up the necessary modules to create an illustrated
story with Hyv, OpenAI's GPT-4, and DALL-E.

## Prerequisites

Ensure that Node.js and npm are installed on your system. Familiarity with TypeScript is beneficial.

## Guide

### Installing Required Packages

The initial step involves installing the necessary packages: `@hyv/core`, `@hyv/openai` and
`@hyv/utils`. Use the npm install command to add these packages to your project.

```shell
npm install @hyv/core @hyv/openai @hyv/utils
```

### Importing Essential Modules

After installing the required packages, proceed to import the necessary modules that will be used
for our story generation task.

```typescript
import path from "node:path";
import type { ModelMessage } from "@hyv/core";
import { Agent, sequence } from "@hyv/core";
import { createInstruction, GPTModelAdapter } from "@hyv/openai";
import type { FileContentWithPath, SideEffect } from "@hyv/utils";
```

### Constructing Helper Functions

With the necessary modules imported, create utility functions that will aid in writing and
optimizing the story.

```typescript
export function createFileWriterWithReadingTime(
    dir: string,
    encoding: BufferEncoding = "utf-8"
): SideEffect<(FileContentWithPath & { readingTime: number })[]> {
    return {
        prop: "files",
        async run(files) {
            await Promise.all(
                files.map(async file =>
                    writeFile(
                        path.join(dir, file.path),
                        `Reading time: ${Math.round(file.readingTime * 10) / 10} minutes\n\n${
                            file.content
                        }`,
                        encoding
                    )
                )
            );
        },
    };
}

function getReadingTime(text: string) {
    return text.length / 1_000;
}

function getWordCount(text: string) {
    return text.split(" ").filter(Boolean).length;
}
```

## Summary

This guide covers the initial steps needed to set up a project for generating illustrated stories
using Hyv, OpenAI GPT, and DALL-E. The subsequent guides will delve into assigning tasks to agents
and generating the story itself.

## Tags

Hyv, OpenAI, GPT-4, Dall-E, TypeScript, Story Generation, AI, Setup
