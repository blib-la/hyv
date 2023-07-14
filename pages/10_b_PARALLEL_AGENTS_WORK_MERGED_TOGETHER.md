# Deploying Tasks and Consolidating Outputs with Concurrent Agents in Hyv

## Overview

Upon establishing concurrent agents in Hyv, as shown in the previous guide, the next steps involve
deploying tasks to these agents and unifying the results. This guide will elaborate on how to
perform these steps.

## Prerequisites

To follow this guide, you should have completed the previous guide on creating concurrent agents in
Hyv. Familiarity with TypeScript and a basic understanding of the Hyv library is also needed.

## Guide

### Formulating a Function to Assign Tasks

Develop a function to delegate tasks to an agent and fetch the results.

```typescript
async function doAndGetResult(task: ModelMessage) {
    const agent = new Agent(
        new GPTModelAdapter({
            model: "gpt-4",
            maxTokens: 2048,
            systemInstruction2,
        }),
        {
            verbosity: 1,
        }
    );
    return (await agent.assign(task)).message.files;
}
```

### Delegating Tasks to Agents

Next, assign tasks to the agents. The usage of `Promise.all` ensures that these tasks are executed
concurrently.

```typescript
const mainTask = { task: "Write a simple React todo-list app, be creative" };

const files = (
    await Promise.all(Array.from({ length: 2 }, async () => doAndGetResult(mainTask)))
).flat() as FileContentWithPath[];
```

In the preceding example, the same main task is assigned to two agents which perform concurrently.

### Unifying the Outcomes

Lastly, if necessary, employ an additional agent to unify the results from the parallel tasks.

```typescript
const agent3 = new Agent(
    new GPTModelAdapter({
        model: "gpt-4",
        maxTokens: 4096,
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

In this instance, the results of the concurrent tasks are merged by a third agent, `agent3`. This
agent is uniquely trained to analyze and unify TypeScript code.

## Summary

By following this guide, you've learned how to assign tasks to and unify the results from parallel
agents in Hyv. The capability to carry out tasks concurrently enhances the efficiency of your AI
model.

## Tags

Hyv, Concurrent Agents, Task Assignment, Merging Results, GPT-4, TypeScript, AI, Parallel Processing
