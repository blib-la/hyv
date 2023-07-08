# Assigning Tasks and Merging Results with Parallel Agents in Hyv

## Defining a Task Assignment Function

Create a function to assign tasks to an agent and retrieve the results.

```typescript
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

## Assigning Tasks to the Agents

Assign tasks to your agents. These tasks are performed concurrently due to the use of `Promise.all`.

```typescript
const mainTask = { task: "Write a simple React todo-list app, be creative" };

const files = (
    await Promise.all(Array.from({ length: 2 }, async () => doAndGetResult(mainTask)))
).flat() as FileContentWithPath[];
```

In the example above, the same main task is assigned to two agents which are set to run
concurrently.

## Merging the Results

Finally, use another agent to merge the outputs from the parallel tasks, if needed.

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
is specifically trained to analyze and merge TypeScript code. This concludes the guide on how to use
parallel agents in Hyv to perform tasks concurrently and improve the efficiency of your AI model.
