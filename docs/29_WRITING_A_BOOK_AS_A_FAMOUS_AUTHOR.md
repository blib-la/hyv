Creating an AI-based persona of J.R.R. Tolkien for writing a book can be an exciting experiment.
Here's how you could set up this process:

## Import necessary modules

Start by importing the necessary modules:

```typescript
import { Agent } from "@hyv/core";
import { createInstructionPersona, GPTModelAdapter } from "@hyv/openai";
import { createFileWriter } from "@hyv/utils";
```

## Define the author's persona

Next, define the author's persona. For J.R.R. Tolkien, you could use something like this:

```typescript
const tolkienPersona = {
    name: "J.R.R. Tolkien",
    profession: "Author",
    characteristics: [
        "Renowned for his detailed and expansive world-building",
        "Creator of several conlangs, or constructed languages",
        "Known for his intricate, multi-layered narratives",
        "Often incorporates themes of good versus evil, death and immortality, fate and free will",
        "Frequent use of rustic settings and naturalistic descriptions",
        "Characters often embark on epic journeys or quests",
        "Writing style tends to be formal and archaic",
    ],
};
```

## Set up the persona instructions

Next, create the system instructions for your AI persona. These instructions guide how the AI will
write:

```typescript
const tolkienInstruction = createInstructionPersona(
    tolkienPersona,
    [
        "Always stay in character as J.R.R. Tolkien",
        "Incorporate expansive world-building and complex narratives",
        "Maintain a formal, archaic writing style",
        "Develop characters that readers can empathize with",
        "Incorporate elements of epic quests or journeys",
        {
            importance: "ultra high",
            rule: "Write the chapter in the desired  {{files}} format and use the desired format and {{wordCount}}",
        },
    ],
    {
        thought: "What is the underlying theme of this chapter?",
        assurance: "How will this chapter contribute to the overall narrative arc and theme?",
        files: [
            {
                path: "chapter-name.md",
                content: "the content of the chapter",
            },
        ],
    },
    {
        format: "json",
    }
);
```

## Create the agent

Now, create an agent using the `GPTModelAdapter` and your Tolkien persona. The fileWriter is added
as a sideEffect. To allow the story to make sense and all chapters to build on the previous, we
increase the historySize to 3.

```typescript
const dir = path.join(process.cwd(), `examples/output/${Date.now()}`);
const fileWriter = createFileWriter(dir);
const tolkienAgent = new Agent(
    new GPTModelAdapter({
        model: "gpt-4",
        historySize: 3,
        systemInstruction: tolkienInstruction,
    }),
    {
        verbosity: 1,
        sideEffects: [fileWriter],
    }
);
```

## Write the book

Finally, you can generate your book. Let's create a three-chapter book:

```typescript
const tasks = [
    "Begin the tale in a peaceful shire, introduce our unassuming hero.",
    "Our hero hears an ancient prophecy and sets out on a great journey.",
    "Our hero faces the final challenge, an epic confrontation with an ancient evil.",
];

const fileWriter = createFileWriter();

for (let i = 0; i < tasks.length; i++) {
    await tolkienAgent.assign({ task: tasks[i], wordCount: ">=1000" }).catch(console.error);
}
```

In this example, we're creating a Tolkien-like narrative with the help of our Tolkien AI agent. The
AI writes each chapter and saves it to a separate file.
