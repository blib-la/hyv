# Getting started with Hyv

## Installing Dependencies

To begin using Hyv, you must first install the necessary dependencies. You will need the Hyv Agent
and a model adapter. To install these, use the following command:

```shell
npm install @hyv/core @hyv/openai
```

## Receiving a Response

### Importing Modules

Start by importing `Agent` and `GPTModelAdapter`:

```typescript
import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";
```

### Creating an Agent

Create an `Agent` using a `GPTModelAdapter`:

```typescript
const agent = new Agent(new GPTModelAdapter());
```

### Assigning a Message

Provide a question to the agent and obtain the answer:

```typescript
try {
    const answer = await agent.assign({ question: "What is time?" });
    console.log(answer.message);
} catch (error) {
    console.error("Error:", error);
}
```

### Running the Script

Execute the script and check the console output:

```json
{
    "thought": "Time is a concept that humans use to measure the duration between events.",
    "reason": "It is a way to organize and understand the sequence of events that occur in our lives.",
    "reflection": "Time is a fundamental aspect of our existence, and yet it is something that we cannot see or touch. It is a human construct that helps us make sense of the world around us.",
    "answer": "Time can be defined as the duration between events, and it is a concept that is used to organize and understand the sequence of events that occur in our lives."
}
```

Next:

-   [System Instructions](02_SYSTEM_INSTRUCTIONS.md)
