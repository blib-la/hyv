# Creating Multiple Agents in Hyv for Code Development

## What are Multiple Agents?

In Hyv, you can use multiple agents to improve the quality of generated code. One agent generates
the initial code, and another optimizes it. In this first part of the guide, we will focus on
creating these two agents.

## Importing Modules

Start by importing the necessary modules.

```typescript
import { inspect } from "node:util";
import { Agent } from "@hyv/core";
import { createInstructionTemplate, GPTModelAdapter } from "@hyv/openai";
import { extractCode, minify } from "@hyv/utils";
```

## Creating the Developer and Optimizer Agents

Next, we're going to create two agents, `developer` and `optimizer`. Each of them will have a
specific `GPTModelAdapter` that contains its own system instruction.

```typescript
const developer = new Agent(
    new GPTModelAdapter({
        maxTokens: 2048,
        model: "gpt-4",
        systemInstruction: createInstructionTemplate(
            "expert JavaScript Developer, expert Canvas2D Developer, **performance expert**",
            minify`
            Achieve the {{goal}}.
            Use the {{boilerplate}}.
            `,
            {
                thoughts: "elaborative thoughts",
                code: "valid JavaScript",
            }
        ),
    }),
    { verbosity: 1 }
);

const optimizer = new Agent(
    new GPTModelAdapter({
        maxTokens: 2048,
        model: "gpt-4",
        systemInstruction: createInstructionTemplate(
            "expert JavaScript Developer, expert Canvas2D Developer, **performance expert**",
            minify`
            Review the {{code}}.
            Look for potential errors and fix them.
            Optimize the {{code}} as needed.
            `,
            {
                review: "elaborative review and critique",
                code: "valid JavaScript (original or optimized)",
            }
        ),
    }),
    {
        verbosity: 1,
        sideEffects: [
            {
                prop: "code",
                async run(value: string) {
                    const { code } = extractCode(value);
                    console.log("SIDE EFFECT");
                    console.log(code);
                },
            },
        ],
    }
);
```

The `developer` agent is tasked with achieving a specified goal using a given boilerplate.
Meanwhile, the `optimizer` agent is tasked with reviewing the code produced by the `developer`,
identifying potential errors, and optimizing the code as needed.
