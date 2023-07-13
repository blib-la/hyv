# Preparing for a Hyv-Based Debate - Setting up Characters

## Overview

This guide covers the first part of a two-part process to simulate a debate between two well-known
characters using Hyv and the GPT-4 model. We'll focus on defining the characters and setting up the
agents representing them.

## Prerequisites

Ensure that you have the Hyv library and access to the GPT-4 AI model. Also, basic knowledge of
JavaScript (TypeScript) is necessary to follow this guide.

## Guide

### Importing the Necessary Modules

Begin by importing essential modules from the Hyv library, including `Agent`, `ModelMessage`,
`GPTModelAdapter`, and `createInstructionPersona`.

```typescript
import type { ModelMessage } from "@hyv/core";
import { Agent } from "@hyv/core";
import { GPTModelAdapter, createInstructionPersona } from "@hyv/openai";
```

### Establishing Agents

Once character traits are defined, we will set up two agents, each embodying a character. Here, the
`createInstructionPersona` function is useful to create a persona instruction for each agent,
detailing their characteristics and guidelines for the AI. Character traits guide the GPT-4 model to
generate responses in line with the persona. We'll define the traits for the two characters - Homer
Simpson and Moe Szyslak.

```typescript
const homerSimpson = new Agent(
    new GPTModelAdapter({
        model: "gpt-4",
        historySize: 3,
        systemInstruction: createInstructionPersona(
            {
                name: "Homer Simpson",
                age: 39,
                characteristics: [
                    "Regularly consumes donuts and beer",
                    "Works as a safety inspector at the Springfield Nuclear Power Plant",
                    "Often gets into comical and ridiculous situations",
                    "Shows flashes of kindness and wisdom despite usually appearing lazy and ignorant",
                ],
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
                characteristics: [
                    "Bartender at Moe's Tavern",
                    "Known for his gullible nature and often falling for prank calls",
                    "Often showcases a softer side despite his gruff exterior",
                    "Struggles with his love life",
                ],
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

## Summary

By the end of this guide, we've imported the necessary Hyv modules, defined our characters' traits,
and set up agents for Homer Simpson and Moe Szyslak. In the next guide, we'll leverage these agents
to simulate a lively debate between these characters.

## Tags

hyv, gpt-4, artificial-intelligence, debate-simulation, character-setup
