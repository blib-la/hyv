# Initiating Hyv with Automatic1111ModelAdapter

## Configuring Dependencies

In order to use Hyv with the `Automatic1111ModelAdapter`, follow the subsequent steps:

### Importing Necessary Modules

Start by importing the necessary modules from `@hyv/core`, `@hyv/stable-diffusion`, and
`@hyv/utils`. This will include `Agent`, `sequence`, `Automatic1111ModelAdapter`, and
`createFileWriter`.

```typescript
import path from "node:path";
import { Agent, sequence } from "@hyv/core";
import { Automatic1111ModelAdapter } from "@hyv/stable-diffusion";
import { createFileWriter } from "@hyv/utils";
```

### Constructing an Image Writer

Employ the `createFileWriter` function to establish an image writer that will pen down the generated
image at a specific path.

```typescript
const imageWriter = createFileWriter(
    path.join(process.cwd(), `examples/output/stable-diffusion/${Date.now()}`),
    "base64"
);
```

### Instituting an Agent

Set up an `Agent` using the `Automatic1111ModelAdapter` and specify the `sideEffects` to comprise
the `imageWriter`.

```typescript
const agent = new Agent(new Automatic1111ModelAdapter({ steps: 20, cfgScale: 7 }), {
    sideEffects: [imageWriter],
});
```

### Creating Images

Employ the `sequence` function to produce images. Supply an object with an `images` array, each
featuring a `path`, `prompt`, and `negativePrompt`. In this case, we're fabricating a "portrait of a
clown" while circumventing "worst quality".

```typescript
try {
    await sequence(
        {
            images: [
                {
                    path: "image.png",
                    prompt: "portrait of a clown",
                    negativePrompt: "worst quality",
                },
            ],
        },
        [agent]
    );
} catch (error) {
    console.error("Error:", error);
}
```
