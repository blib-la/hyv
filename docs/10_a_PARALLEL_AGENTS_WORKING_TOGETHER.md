# Creating Parallel Agents in Hyv

## Understanding Parallel Agents

Parallel agents in Hyv are used when multiple agents are required to work concurrently on different
tasks or different parts of the same task. This first guide will show you how to create parallel
agents.

## Importing Necessary Modules

First, you need to import the necessary modules.

```typescript
import type { ModelMessage } from "@hyv/core";
import { Agent, memoryStore } from "@hyv/core";
import { createInstruction, GPTModelAdapter } from "@hyv/openai";
import type { FileContentWithPath } from "@hyv/utils";
import { minify } from "@hyv/utils";
```

## Defining Instructions for Each Agent

Create a system instruction for each parallel agent, outlining the rules and expectations of the AI.

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

## Creating the Parallel Agents

After defining the instructions for each agent, use the `Agent` class and `GPTModelAdapter` to
create the agents.

```typescript
const agent1 = new Agent(
    new GPTModelAdapter({
        model: "gpt-4",
        maxTokens: 2048,
        format: "json",
        systemInstruction: systemInstruction1,
    }),
    {
        verbosity: 1,
    }
);
```
