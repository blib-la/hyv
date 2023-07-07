# Guide to Making Precise Calculations with Hyv

In Hyv, the GPT-4 AI model can be leveraged to perform detailed mathematical calculations. To make
Hyv do precise calculations, follow the steps below:

## Import Necessary Modules

Start by importing the necessary modules. This includes `Agent` from `@hyv/core` and
`createInstructionTemplate` and `GPTModelAdapter` from `@hyv/openai`.

```typescript
import { Agent } from "@hyv/core";
import { createInstructionTemplate, GPTModelAdapter } from "@hyv/openai";
```

## Create a Mathematical Model

Next, define a `GPTModelAdapter` that is specialized for mathematical calculations. To do this,
create a new `GPTModelAdapter` and specify a custom `systemInstruction`. The
`createInstructionTemplate` function is used to generate a `systemInstruction` that instructs the AI
to solve mathematical problems.

```typescript
const mathModel = new GPTModelAdapter({
    model: "gpt-4",
    systemInstruction: createInstructionTemplate(
        "Mathematician",
        "think about the problem, reason your thoughts, solve the problems step by step",
        {
            thought: "detailed string",
            reason: "detailed string",
            steps: ["detailed calculation step"],
            solution: "concise answer",
        }
    ),
});
```

In the above code, `"Mathematician"` is the role that the AI is instructed to take on. The AI is
asked to think about the problem, reason its thoughts, and solve the problem step by step.

## Create an Agent

After defining the model, create a new `Agent` with the `mathModel`:

```typescript
const mathAgent = new Agent(mathModel, { verbosity: 1 });
```

The `verbosity` option is set to `1`, which means that the agent will provide detailed output.

## Assign a Problem

Finally, assign a mathematical problem to the agent using the `assign` method:

```typescript
try {
    const answer = await mathAgent.assign({ problem: "(10 * 4 + 2) / (10 * 2 + 11 * 2) = x" });
    console.log(answer.message);
} catch (error) {
    console.error("Error:", error);
}
```

In the above code, the `assign` method is called with a `problem` object, which specifies the
mathematical problem to solve. The answer is then logged to the console.

With these steps, you can use Hyv to make precise calculations. The agent will approach the problem
like a mathematician, thinking about the problem, reasoning its thoughts, and solving the problem
step by step.
