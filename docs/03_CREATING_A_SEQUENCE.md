# Creating a sequence

## Before You Begin

Make sure you've completed the [Getting Started with Hyv](01_GETTING_STARTED.md) and
[System Instructions](02_SYSTEM_INSTRUCTIONS.md) guides.

## Running a sequence

Create a sequence with Hyv to process multiple agents in a chain, one after another.

The `sequence` function is linear and takes a message and an array of agents. By setting the
`verbosity` of the agent to `1`, you will receive a prettified output in the console.

```typescript
import { Agent, sequence } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";

const agent = new Agent(new GPTModelAdapter(), { verbosity: 1 });

try {
  await sequence({ question: "What is life?" }, [agent]);
} catch (error) {
  console.error("Error:", error);
}
```

**output**

```
 Thought

Life is a characteristic that distinguishes physical entities that have biological processes, such as signaling and self-sustaining processes, from those that do not, either because such functions have ceased (death), or because they never had such functions and are classified as inanimate.

 Reason

Life is a complex concept that has been studied by scientists, philosophers, and theologians for centuries. It is a fundamental aspect of our existence that is difficult to define in a concise manner.

 Reflection

The concept of life raises many questions about the nature of existence, the purpose of our existence, and the meaning of life. It is a topic that has fascinated humans for ages and continues to do so today.

 Answer

Life can be defined as a characteristic that distinguishes physical entities that have biological processes, such as signaling and self-sustaining processes, from those that do not.

```

## Adding more agents

Change the model to `gpt-4` (not required) for improved answers and modify the system instruction.
Create three agents and chain them to follow a main goal while generating new tasks.

```typescript
import { Agent, sequence } from "@hyv/core";
import { createInstruction, GPTModelAdapter } from "@hyv/openai";

const agents = Array.from<undefined, Agent>(
  { length: 3 },
  () =>
    new Agent(
      new GPTModelAdapter({
        model: "gpt-4",
        systemInstruction: createInstruction(
          "AI",
          "think about the task, reason your thoughts, create a new task based on your decision!",
          {
            mainGoal: "{{mainGoal}}",
            thoughts: "detailed string",
            reason: "detailed string",
            task: "full and detailed task without references",
          }
        ),
      }),
      {
        async before({ task, mainGoal }) {
          return {
            task,
            mainGoal,
          };
        },
        verbosity: 1,
      }
    )
);

try {
  await sequence(
    { task: "Make the world a better place!", mainGoal: "Make the world a better place!" },
    agents
  );
} catch (error) {
  console.error("Error:", error);
}
```
