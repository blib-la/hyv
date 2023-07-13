# Tailoring Hyv Models and Agent Configuration

## Overview

The guide presents comprehensive steps on how to utilize Hyv's flexible configuration setup to
customize the behavior of your models and agents. Questions such as "How can I adjust the options of
the `GPTModelAdapter` model and the `Agent`?" or "How can I modify the `temperature` or other model
options?" will be answered throughout this guide.

## Prerequisites

To successfully follow this guide, you should have the Hyv library installed in your project. If not
already installed, you can do so using the following command:

```shell
npm install @hyv/core @hyv/openai
```

## Guide

### Modifying the GPTModelAdapter

Hyv's `GPTModelAdapter` class permits you to adjust various properties such as `temperature`,
`model`, `maxTokens`, `historySize`, `format`, and `systemInstruction`.

#### Adjusting the Temperature

The `temperature` property controls the randomness of the model's output. A higher value will result
in increased randomness, while a lower value leans towards a more deterministic outcome. To tweak
the `temperature`, utilize the `temperature` setter in the `GPTModelAdapter` class.

```typescript
import { GPTModelAdapter } from "@hyv/openai";

// Instantiate the GPTModelAdapter class
const gptAdapter = new GPTModelAdapter();

// Modify the temperature of the GPT model
gptAdapter.temperature = 0.7; // Adjust the temperature to your preferred value
```

### Tailoring the Agent

Although the `Agent` class doesn't provide a direct method to adjust the temperature or other model
options, you can access the model instance from the agent and then set the properties.

```typescript
import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";

// Instantiate the GPTModelAdapter class
const gptAdapter = new GPTModelAdapter();

// Instantiate the Agent class
const agent = new Agent(gptAdapter);

// Access the model instance from the agent and set the temperature
(agent.model as GPTModelAdapter).temperature = 0.7; // Adjust the temperature to your preferred value
```

Apart from `temperature`, you can also adjust the following properties:

-   `model`: The model ID (default is 'gpt-3').
-   `maxTokens`: The maximum number of tokens in the response (default is 2048).
-   `historySize`: The number of previous messages to retain in memory (default is 1).
-   `format`: The output format, which can be either 'markdown' or 'json' (default is 'markdown').
-   `systemInstruction`: An instruction that's always prepended to the message given to the model.

These properties allow you to fine-tune the behavior of your models and agents according to your
specific needs.

## Summary

The guide provides a detailed walkthrough on adjusting Hyv's models and agent configuration,
offering extensive flexibility and adaptability to meet your specific requirements.

## Tags

Hyv, GPTModelAdapter, Agent, Configuration, Customization, Model Options, Temperature
