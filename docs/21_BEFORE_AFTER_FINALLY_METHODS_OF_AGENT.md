# Tailoring Hyv Agent Behaviour with `before`, `after`, and `finally` Methods

## Overview

In this guide, we delve into the customization of Hyv's `Agent` class using the `before`, `after`,
and `finally` methods. It addresses questions such as: How can one modify tasks at different stages
of an agent's operation cycle? What are the functionalities and applications of the `before`,
`after`, and `finally` methods? How can these methods be utilized to optimize an agent's operation?

## Prerequisites

Knowledge of Hyv's `Agent` class and understanding of asynchronous functions are necessary.
Familiarity with JavaScript and task processing concepts would be beneficial.

## Guide

### Implementing the `before` Method

The `before` method is an optional asynchronous function called before an agent processes a task. It
allows preprocessing of tasks or setting up required states before task execution.

```typescript
const agent = new Agent(new GPTModelAdapter(), {
    async before(message) {
        // Manipulate the message, for instance, omit properties and/or rename them
        return { task: message.answer };
    },
});
```

### Using the `after` Method

The `after` method is invoked after the agent processes a task. It provides the opportunity to
perform post-processing tasks or clean up any state following task execution.

```typescript
const agent = new Agent(new GPTModelAdapter(), {
    async after(message) {
        // Manipulate the message, for instance, omit properties and/or rename them
        return { task: message.answer };
    },
});
```

### Leveraging the `finally` Method

The `finally` method triggers when the process concludes. It allows for final actions such as
logging or sending notifications to be executed post-task processing.

```typescript
const agent = new Agent(new GPTModelAdapter(), {
    async finally(messageId, message) {
        // Perform some action with the message, for instance, send it to some other agent
        const result = await agent2.assign(message);
        return result.id;
    },
});
```

## Summary

The `before`, `after`, and `finally` methods offer diverse ways to customize an agent's behavior,
thereby enhancing the versatility of the Hyv framework. By understanding and effectively using these
methods, developers can optimize task processing at various stages of an agent's operation cycle.

## Tags

Hyv, Agent Class, before Method, after Method, finally Method, Task Processing, Customization, AI
Framework
