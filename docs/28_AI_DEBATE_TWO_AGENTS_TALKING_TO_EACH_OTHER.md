# Creating a Hyv-based Debate Between Two Characters

In this guide, we will explore how to use Hyv to simulate a debate between two well-defined
characters using GPT-4 as the underlying AI model. For illustration, we're taking two beloved
characters from the 'The Simpsons' series - Homer Simpson and Moe Szyslak.

To simulate a debate, we're going to create two `Agents` each embodying a character and have them
interact with each other.

## 1. Import Necessary Modules

Start by importing `Agent`, `ModelMessage`, `GPTModelAdapter`, and `createInstructionPersona`:

```typescript
import type { ModelMessage } from "@hyv/core";
import { Agent, GPTModelAdapter, createInstructionPersona } from "@hyv/openai";
```

## 2. Define Characteristics

We need to define the characteristics of both characters. This will help in generating responses
that align with their personas.

```typescript
const characteristics = {
    homer: [
        "Regularly consumes donuts and beer",
        "Works as a safety inspector at the Springfield Nuclear Power Plant",
        "Often gets into comical and ridiculous situations",
        "Shows flashes of kindness and wisdom despite usually appearing lazy and ignorant",
    ],
    moe: [
        "Bartender at Moe's Tavern",
        "Known for his gullible nature and often falling for prank calls",
        "Often showcases a softer side despite his gruff exterior",
        "Struggles with his love life",
    ],
};
```

## 3. Create Agents

Next, create two agents representing the characters. We'll use the `createInstructionPersona`
function to create a persona instruction for the agent. The instruction includes details like the
name, age, characteristics of the persona, and the rules for the AI.

```typescript
const homerSimpson = new Agent(
    new GPTModelAdapter({
        model: "gpt-4",
        historySize: 3,
        systemInstruction: createInstructionPersona(
            {
                name: "Homer Simpson",
                age: 39,
                characteristics: characteristics.homer,
            },
            [
                "NEVER break character",
                "ALWAYS humorously engage with Moe Szyslak",
                "Keep your responses light and comical",
                "Win this debate",
            ],
            {
                thought: "what you think about Moe's message",
                assurance: "stay in character, say why and how",
                answer: "your response to Moe",
            }
        ),
    }),
    {
        verbosity: 1,
        async before(message) {
            return { message: message.answer };
        },
    }
);

const moeSzyslak = new Agent(
    new GPTModelAdapter({
        model: "gpt-4",
        historySize: 3,
        systemInstruction: createInstructionPersona(
            {
                name: "Moe Szyslak",
                age: 45,
                characteristics: characteristics.moe,
            },
            [
                "NEVER break character",
                "ALWAYS humorously engage with Homer Simpson",
                "Keep your responses sarcastic and witty",
                "Win this debate",
            ],
            {
                thought: "what you think about Homer's message",
                assurance: "stay in character, say why and how",
                answer: "your response to Homer",
            }
        ),
    }),
    {
        verbosity: 1,
        async before(message) {
            return { message: message.answer };
        },
    }
);
```

## 4. Simulate a Debate

Now that we have our agents set up, we can start the debate. We'll create a loop where Homer and Moe
exchange messages:

```typescript
// Define the initial message
let message: ModelMessage = {
    answer: "Hey Moe, why are your drinks so expensive?",
};
// Create a loop
let i = 0;
const rounds = 5;
while (i < rounds) {
    // Homer talks to Moe
    message = (await moeSzyslak.assign(message)).message;
    // Moe responds to Homer
    message = (await homerSimpson.assign(message)).message;
    i++;
}
```

And there you have it! A simulated debate between Homer Simpson and Moe Szyslak.
