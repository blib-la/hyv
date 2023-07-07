# Kickstarting with Hyv

## Setting Up Dependencies

To get started with Hyv, the initial step involves installing the essential dependencies, including
Hyv's core, openai and utils. To do this, run the command:

```shell
npm install @hyv/core @hyv/openai @hyv/utils
```

## Generating Images

### Integrating Modules

Begin by importing `Agent`, `sequence` from Hyv's core, `DallEModelAdapter` from Hyv's openai, and
`createFileWriter` from Hyv's utils:

```typescript
import path from "node:path";
import { Agent, sequence } from "@hyv/core";
import { DallEModelAdapter } from "@hyv/openai";
import { createFileWriter } from "@hyv/utils";
```

### Establishing a DallEModelAdapter

Set up a `DallEModelAdapter` which is utilized to generate images with OpenAI's DALL-E model:

```typescript
const adapter = new DallEModelAdapter({ size: "256x256", n: 1 }, openAI);
```

### Crafting an Agent

Generate an `Agent` using a `DallEModelAdapter` and a file writer side effect:

```typescript
const imageWriter = createFileWriter(
    path.join(process.cwd(), `examples/output/dall-e/${Date.now()}`),
    "base64"
);
const agent = new Agent(new DallEModelAdapter(), {
    sideEffects: [imageWriter],
});
```

### Tasking the Agent

Assign a task to the agent to create an image:

```typescript
try {
    await sequence({ images: [{ path: "assets/bar.png", prompt: "red apple" }] }, [agent]);
} catch (error) {
    console.error("Error:", error);
}
```

### Executing the Script

Run the script and check the designated path for the generated image:

```text
examples/output/dall-e/timestamp
```
