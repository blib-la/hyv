# Guide: Language Model with Good System Instructions

## Overview

This guide aims to help developers understand how to guide a language model with good system
instructions using the Hyv library. It addresses questions such as how to set up a language model,
how to create effective system instructions, and how to use these instructions to guide the model's
responses.

## Prerequisites

To successfully execute this guide, you should have basic knowledge of TypeScript and be familiar
with the Hyv library. You can find the library on [GitHub](https://github.com/failfa-st/hyv) and
install it via npm using `npm install @hyv/*`.

## Guide

### Setting Up a Language Model

First, import the necessary modules from the Hyv library.

```typescript
import { Agent } from "@hyv/core";
import { createInstruction, GPTModelAdapter } from "@hyv/openai";
```

### Creating a System Instruction

Next, create a system instruction to guide the language model's responses. Here's an example of how
to create a system instruction for a mathematician model.

```typescript
const mathModel = new GPTModelAdapter({
    format: "json",
    systemInstruction: createInstruction(
        "Mathematician",
        "think about the problem, reason your thoughts, solve the problems step by step",
        {
            thought: "detailed string",
            reason: "detailed string",
            steps: ["calculation step"],
            solution: "concise answer",
        }
    ),
});
```

### Guiding the Model's Responses

Finally, assign a problem to the model and it will respond according to the system instruction.

```typescript
const mathAgent = new Agent(mathModel);

try {
    const answer = await mathAgent.assign({ problem: "(10 * 4 + 2) / (10 * 2 + 11 * 2) = x" });
    console.log(answer.message);
} catch (error) {
    console.error("Error:", error);
}
```

## Expected Output

After successfully following this guide, you should be able to guide a language model's responses
using system instructions. The model's responses will be structured and relevant to the instructions
given.

```json
{
    "thought": "My first step will be to simplify the expressions within the parentheses in the numerator and the denominator. Then I will perform the division operation to find the value of x.",
    "reason": "The problem is a simple arithmetic operation involving multiplication, addition and division. The order of operations (PEMDAS/BODMAS) rule states that operations enclosed within parentheses are performed first, followed by Exponents (Powers and Square Roots, etc.), then Multiplication and Division (from left to right), and finally Addition and Subtraction (from left to right).",
    "steps": [
        "Step 1: Simplify the expression within the parentheses in the numerator: 10 * 4 + 2 = 40 + 2 = 42",
        "Step 2: Simplify the expression within the parentheses in the denominator: 10 * 2 + 11 * 2 = 20 + 22 = 42",
        "Step 3: Perform the division operation: 42 / 42 = 1"
    ],
    "solution": "x = 1"
}
```

## Summary

In this guide, we've learned how to set up a language model, create system instructions, and guide
the model's responses using these instructions. This can help in generating more relevant and
structured responses from the model.

## Tags

Hyv, language model, system instructions, TypeScript, guide
