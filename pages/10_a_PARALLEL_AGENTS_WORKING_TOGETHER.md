# Establishing Concurrent Agents in Hyv

## Overview

Hyv allows the establishment of parallel agents which can work simultaneously on diverse tasks or
distinct portions of a shared task. This guide will demonstrate how to create these concurrent
agents.

## Prerequisites

Knowledge of TypeScript and a basic understanding of Hyv library are prerequisites for executing
this guide successfully.

## Guide

### Importing Necessary Libraries

Initially, the essential libraries are imported.

```typescript
import type { ModelMessage } from "@hyv/core";
import { Agent, memoryStore } from "@hyv/core";
import { createInstruction, GPTModelAdapter } from "@hyv/openai";
import type { FileContentWithPath } from "@hyv/utils";
import { minify } from "@hyv/utils";
```

### Specifying Agent Instructions

Instructions for each parallel agent need to be defined next, setting the guidelines and
expectations for the AI.

```typescript
const systemInstruction1 = createInstruction(
    "TypeScript Developer",
    minify`
    Do tasks. Never ask back.
    Provide a TypeScript function and export it as named export.
    Use DECLARATIVE names.
    ONLY VALID and COMPLETE code.
    Use ESNext/ESM with 'import/export'.
    Create TypeScript files with the solution.
    `,
    {
        thoughts: "your thoughts",
        decision: "your decision",
        functionNames: ["string"],
        files: [
            {
                path: "src/[path/to/filename].ts",
                content: "// Valid TypeScript code",
            },
        ],
    }
);
```

### Establishing Concurrent Agents

Once instructions for each agent are defined, the `Agent` class and `GPTModelAdapter` are used to
create the agents.

```typescript
const agent1 = new Agent(
    new GPTModelAdapter({
        model: "gpt-4",
        maxTokens: 2048,
        systemInstruction: systemInstruction1,
    }),
    {
        verbosity: 1,
    }
);
```

## Summary

By following this guide, you've learned how to create parallel agents in Hyv. These agents can work
concurrently, thereby allowing simultaneous processing of multiple tasks or different parts of a
shared task.

## Tags

Hyv, Concurrent Agents, GPT-4, TypeScript, AI, Parallel Processing
