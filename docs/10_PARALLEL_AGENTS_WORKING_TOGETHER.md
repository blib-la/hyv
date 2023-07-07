# Guide to Creating Parallel Agents with Hyv

Parallel agents in Hyv are used when you need multiple agents to work concurrently on different
tasks or different parts of the same task. This guide will demonstrate how to create and use
parallel agents with Hyv based on a code-merging scenario.

## Import the Required Modules

First, you need to import the necessary modules.

```typescript
import type { ModelMessage } from "@hyv/core";
import { Agent, memoryStore } from "@hyv/core";
import { createInstruction, GPTModelAdapter } from "@hyv/openai";
import type { FileContentWithPath } from "@hyv/utils";
import { minify } from "@hyv/utils";
```

## Define Instructions for Each Agent

For each of your parallel agents, create a system instruction that outlines the rules and
expectations of the AI.

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

The `createInstruction` function is used to generate a formatted instruction for your agents to
follow.

## Create the Parallel Agents

Once you've defined the instructions for each agent, you can create the agents using the `Agent`
class and `GPTModelAdapter`.

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

## Define a Function for Assigning Tasks

Create a function that assigns tasks to an agent and retrieves the result.

```typescript
const systemInstruction2 = createInstruction(
    "Expert TypeScript Developer, Code Merging expert",
    minify`
	Do tasks.
	Think about the task.
	Find duplicates and analyze.
	Merge files in the best way possible.
	Ensure that no duplicate logic is implemented.
	Ensure the same coding style;
	Use ESNext/ESM with 'import/export'.
	Create TypeScript files with the solution.
	`,
    {
        thoughts: "your thoughts",
        analysis: "your analysis",
        potentialDuplicates: ["string"],
        decision: "your decision",
        files: [
            {
                path: "src/[path/to/filename].ts",
                content: "// Valid TypeScript code",
            },
        ],
    }
);

async function doAndGetResult(task: ModelMessage) {
    const agent = new Agent(
        new GPTModelAdapter({
            model: "gpt-4",
            maxTokens: 2048,
            format: "json",
            systemInstruction2,
        }),
        {
            verbosity: 1,
        }
    );
    return (await agent.assign(task)).message.files;
}
```

## Assign Tasks to the Agents

Now, you can assign tasks to your agents. The tasks are performed concurrently due to the use of
`Promise.all`.

```typescript
const mainTask = { task: "Write a simple React todo-list app, be creative" };

const files = (
    await Promise.all(Array.from({ length: 2 }, async () => doAndGetResult(mainTask)))
).flat() as FileContentWithPath[];
```

In the example above, the same main task is assigned to two agents which are set to run
concurrently.

## Merge the Results

Finally, if needed, another agent can be used to merge the outputs from the parallel tasks.

```typescript
const agent3 = new Agent(
    new GPTModelAdapter({
        model: "gpt-4",
        maxTokens: 4096,
        format: "json",
        systemInstruction: systemInstruction2,
    }),
    {
        verbosity: 2,
    }
);

const mergeTask = {
    task: "merge the code from the pull requests",
    files: files.map(file => ({
        path: file.path,
        content: minify`${file.content}`,
    })),
};

const result = await agent3.assign(mergeTask);

console.log("merged", result.message);
```

In this example, the outputs of the parallel tasks are merged by a third agent, `agent3`. This agent
is specifically trained to analyze and merge TypeScript code.

And that's it! You've successfully created and used parallel agents with Hyv to perform tasks
concurrently. This can significantly improve the performance and efficiency of your AI model when
dealing with complex or large-scale tasks.
