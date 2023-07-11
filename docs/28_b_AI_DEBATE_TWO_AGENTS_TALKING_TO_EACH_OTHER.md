# Simulating a Debate with Hyv Agents

## Overview

In this guide, the second part of the two-part process, we'll focus on how to simulate a debate
between the two agents (representing Homer Simpson and Moe Szyslak) that we set up in the previous
guide.

## Prerequisites

Ensure that you have followed the first part of this guide series - "Preparing for a Hyv-Based
Debate - Setting up Characters" and have two functioning Hyv agents representing your characters.

## Guide

### Initiating the Debate

With our agents prepared, we can commence the debate. We'll construct a loop wherein Homer and Moe
engage in a back-and-forth exchange.

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

## Summary

By following this guide, we've successfully simulated a dynamic debate between Homer Simpson and Moe
Szyslak, leveraging the capabilities of the Hyv library and the GPT-4 model.

## Tags

hyv, gpt-4, artificial-intelligence, debate-simulation, character-interaction
