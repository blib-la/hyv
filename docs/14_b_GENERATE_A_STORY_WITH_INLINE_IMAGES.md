# Writing and Illustrating a Story with Hyv, OpenAI, and Stable Diffusion

In this part, we'll focus on creating the agents that will generate the story text and
illustrations.

## Creating Agents for Writing and Illustrating

Now, we'll create two agents: one for writing the story and another one for creating illustrations:

```typescript
const dir = path.join(process.cwd(), `examples/output/auto-book/${Date.now()}`);
const fileWriter = createFileWriterWithReadingTime(dir);
const imageWriter = createFileWriter(dir, "base64");

const bookAgent = new Agent();
// ... (code omitted for brevity)

const author = new Agent();
// ... (code omitted for brevity)

const illustrator = new Agent();
// ... (code omitted for brevity)
```

Don't forget to define a function to handle image placement in the story:

```typescript
function makeFloatingImages(inputText: string) {
    // ... (code omitted for brevity)
}
```
