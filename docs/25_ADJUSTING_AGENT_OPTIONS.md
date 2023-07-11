# Tailoring Hyv Agent Configurations

## Overview

This guide provides a comprehensive overview of how to exploit various getters and setters available
in Hyv's `Agent` class to fine-tune your agent's settings and modify its behavior. The guide answers
questions such as "How can I change the side effects for an agent?" or "How can I customize
`before`, `after`, and `finally` functions?" or "How can I switch the model for an agent?".

## Prerequisites

To follow this guide successfully, you need to have the Hyv library installed in your project. If
not installed already, you can do so using the following command:

```shell
npm install @hyv/core @hyv/openai
```

## Guide

### Modifying Side Effects

Side effects are additional actions carried out based on the properties of the output message. The
`sideEffects` setter in the `Agent` class permits you to alter these for your agent.

```typescript
import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";
import { createFileWriter } from "@hyv/utils";
import path from "path";

const agent = new Agent(new GPTModelAdapter());

// Assigning new side effects to the agent
agent.sideEffects = [createFileWriter(path.join(process.cwd(), "output"))];
```

In this example, the agent is assigned a `createFileWriter` side effect which writes the output to a
file located in the "output" directory.

### Customizing `before`, `after` and `finally` Functions

The `Agent` class allows you to provide your custom functions for preprocessing, post-processing,
and finalizing the task using `before`, `after`, and `finally` setters.

```typescript
import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";

const agent = new Agent(new GPTModelAdapter());

// Adjusting the before function
agent.before = async message => {
    console.log("About to process the following message:", message);
    return message;
};

// Adjusting the after function
agent.after = async message => {
    console.log("Processed the following message:", message);
    return message;
};

// Adjusting the finally function
agent.finally = async (messageId, message) => {
    console.log("Finished processing the message with id:", messageId);
    return messageId;
};
```

In this example, the `before`, `after`, and `finally` functions are modified to log the input and
output messages and the final message id.

### Switching the Model

You can use the `model` setter to switch the model for an agent.

```typescript
import { Agent } from "@hyv/core";
import { DallEModelAdapter, GPTModelAdapter } from "@hyv/openai";

const agent = new Agent(new GPTModelAdapter());

// Switching to a different model
agent.model = new DallEModelAdapter();
```

In the given example, the agent's model initially set to `GPTModelAdapter` is later switched to a
`DallEModelAdapter`.

These settings provide a potent toolkit to tweak your agent's behavior to align with your specific
requirements.

## Summary

The guide provides a detailed walkthrough on modifying Hyv's agent configurations, offering you the
flexibility to tailor the agent's behavior according to your specific needs.

## Tags

Hyv, Agent, Configuration, Side Effects, Model Switching, Customization, before, after, finally
