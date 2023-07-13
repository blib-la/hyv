# Preparing the AI Persona for Writing a Book - Setting up the J.R.R. Tolkien AI Persona

## Overview

This guide, the first part of a two-part series, will walk you through the process of creating an AI
persona representing the renowned author J.R.R. Tolkien using the Hyv library and GPT-4 AI model.

## Prerequisites

Ensure that you have the Hyv library and access to the GPT-4 AI model. You will also need basic
knowledge of JavaScript (TypeScript) to follow this guide.

## Guide

### Importing the Necessary Modules

The first step is to import the necessary modules from the Hyv library:

```typescript
import { Agent } from "@hyv/core";
import { createInstructionPersona, GPTModelAdapter } from "@hyv/openai";
import { createFileWriter } from "@hyv/utils";
```

### Defining the Persona Characteristics

To capture the essence of J.R.R. Tolkien's writing style, we need to define his persona in terms of
his professional characteristics:

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

### Creating Persona Instructions

After defining the characteristics, the next step is to guide the AI on how to write like J.R.R.
Tolkien. We do this by creating the system instructions for the AI persona:

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

## Summary

At the end of this guide, we have successfully imported the required Hyv modules, defined the
characteristics of J.R.R. Tolkien, and set up the system instructions for the AI persona. In the
next guide, we will utilize this persona to generate an intriguing story.

## Tags

hyv, gpt-4, artificial-intelligence, ai-persona, book-writing, J.R.R. Tolkien
