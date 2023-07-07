# Guide to Creating Storyteller AI Personas with Hyv

Creating AI personas can add a unique flavor to the interactions of your AI model. By imbuing your
model with a distinctive character or personality, its responses can become more engaging and
human-like. This guide illustrates how to create a storyteller AI persona using Hyv.

## Import the Required Modules

Start with importing the required modules. These include `Agent` from `@hyv/core` and
`createInstructionPersona`, `GPTModelAdapter` from `@hyv/openai`.

```typescript
import { Agent } from "@hyv/core";
import { createInstructionPersona, GPTModelAdapter } from "@hyv/openai";
```

## Define the Persona

Create a descriptive object for the AI's persona. The object can include attributes like name,
profession, age, characteristics, and other defining traits.

```typescript
const persona = {
    name: "Sage",
    profession: "Storyteller",
    characteristics: ["imaginative", "engaging", "humorous"],
};
```

In the example above, the persona is an imaginative, engaging, and humorous storyteller named Sage.

## Create Instructions for the Persona

Use the `createInstructionPersona` function to create a system instruction for the AI. The
instruction outlines the rules the AI should follow to adhere to its persona.

```typescript
const systemInstruction = createInstructionPersona(
    persona,
    [
        { importance: "high", rule: "ALWAYS stay in character!" },
        { importance: "ultra high", rule: "Create engaging and humorous stories!" },
    ],
    {
        thoughts: "describe in detail your thoughts about the story",
        assurance: "describe in detail how and why you stay in character",
        answer: "your story, told in an engaging manner",
    }
);
```

The `createInstructionPersona` function takes three arguments:

-   `persona`: The object describing the persona.
-   An array of rule objects that the AI should adhere to. Each rule has an `importance` and a
    `rule` string.
-   An object that details the format of the AI's responses.

## Create a Hyv Agent

With the persona and system instruction defined, create a new `Agent` using a `GPTModelAdapter` that
incorporates these settings.

```typescript
const storyteller = new Agent(
    new GPTModelAdapter({
        model: "gpt-4",
        systemInstruction,
    }),
    {
        verbosity: 1,
    }
);
```

## Assign Tasks to the Agent

Finally, you can assign tasks to the agent with the `assign` method:

```typescript
try {
    await storyteller.assign({
        task: "Tell a funny story about a cat that goes on an adventure.",
    });
} catch (error) {
    console.log(error);
}
```

Here, the `assign` method takes a `task` object specifying the task to be completed. The task is for
the AI to create a humorous story about a cat's adventure.

And that's it! You've created a storyteller AI persona and assigned it a storytelling task. The
persona will perform the task according to the rules and characteristics defined in the system
instruction, thereby crafting a unique narrative in line with its storytelling persona.
