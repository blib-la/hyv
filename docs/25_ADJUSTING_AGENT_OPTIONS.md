# Adjusting Hyv Agent Settings

The `Agent` class in the Hyv library provides various getters and setters to fine-tune its settings.
This guide explains how to use these getters and setters to adjust the agent's behavior.

## Adjusting Side Effects

The `sideEffects` setter allows you to change the side effects for an agent. Side effects are
additional actions performed based on the properties of the output message.

```typescript
import { Agent, createFileWriter } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";
import path from "path";

const agent = new Agent(new GPTModelAdapter());

// Assigning new side effects to the agent
agent.sideEffects = [createFileWriter(path.join(process.cwd(), "output"))];
```

In the above example, a `createFileWriter` side effect is assigned to the agent. It writes the
output to a file in the "output" directory.

## Customizing `before`, `after` and `finally` Functions

You can use the `before`, `after`, and `finally` setters to provide your custom functions for
preprocessing, post-processing, and finalizing the task.

```typescript
import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";

const agent = new Agent(new GPTModelAdapter());

// Adjusting the before function
agent.before = async message => {
    console.log("About to process the following message:", message);
    return message;
};

// Adjusting the after function
agent.after = async message => {
    console.log("Processed the following message:", message);
    return message;
};

// Adjusting the finally function
agent.finally = async (messageId, message) => {
    console.log("Finished processing the message with id:", messageId);
    return messageId;
};
```

In this example, the `before`, `after`, and `finally` functions are adjusted to log the input and
output messages and the final message id.

## Switching the Model

The `model` setter allows you to switch the model for an agent.

```typescript
import { Agent, DallEModelAdapter } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";

const agent = new Agent(new GPTModelAdapter());

// Switching to a different model
agent.model = new DallEModelAdapter();
```

In the above example, the agent's model is initially set to `GPTModelAdapter`. Later, it is switched
to a `DallEModelAdapter`.

These settings provide powerful tools to fine-tune the agent's behavior according to your specific
requirements.
