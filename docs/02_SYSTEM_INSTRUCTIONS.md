# System Instructions Guide

With a system instruction in place, you can guide the language model to generate more relevant and
structured responses. You can learn more about system instructions in this
[article by OpenAI](https://platform.openai.com/docs/guides/chat/instructing-chat-models).

Hyv is designed to work seamlessly with JSON, and it includes a powerful helper that delivers
reliable output.

## Creating a System Instruction

A system instruction is set on a ModelAdapter (not all adapters require or support system
instructions).

```typescript
import { Agent } from "@hyv/core";
import { createInstruction, GPTModelAdapter } from "@hyv/openai";

const mathModel = new GPTModelAdapter({
  systemInstruction: createInstruction(
    "Mathematician",
    "think about the problem, reason your thoughts, solve the problems step by step",
    {
      thought: "detailed string",
      reason: "detailed string",
      steps: ["step"],
      solution: "concise answer",
    }
  ),
});

const mathAgent = new Agent(mathModel);

try {
  const answer = await mathAgent.assign({ problem: "(10 * 4 + 2) / (10 * 2 + 11 * 2) = ?" });
  console.log(answer.message);
} catch (error) {
  console.error("Error:", error);
}
```

Run the script and review the console output:

```shell
{
  thought: 'This is a simple arithmetic problem involving multiplication and division of integers.',
  reason: 'We need to use the order of operations (PEMDAS) to solve the problem. First, we need to perform the multiplication in the numerator and denominator before dividing.',
  steps: [
    '10 * 4 = 40',
    '40 + 2 = 42',
    '10 * 2 = 20',
    '11 * 2 = 22',
    '20 + 22 = 42',
    '42 / 42 = 1'
  ],
  solution: '1'
}

```

Next:

- [Creating a sequence](03_CREATING_A_SEQUENCE.md)
