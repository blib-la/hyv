# Task Execution with Hyv's do Method

## Overview

This guide introduces the use of the `do` method, a vital feature of the `Agent` class in the Hyv
library. This method allows developers to execute tasks already assigned to an `Agent` instance.
This guide will help you answer: How to create an `Agent` in Hyv? How to execute a task with an
`Agent` using a messageId? And how to handle the `Agent`'s response?

## Prerequisites

A basic understanding of JavaScript or TypeScript and familiarity with the Hyv library's `Agent` and
`GPTModelAdapter` are prerequisites.

## Guide

### Creating an Agent

Begin by creating an `Agent` object using the `GPTModelAdapter`.

```typescript
const agent = new Agent(new GPTModelAdapter());
```

### Assigning a Task

First, use the `assign` method to assign a task to the `Agent`. The task is defined as an object
with a `question` property. Store the messageId returned by the `assign` method.

```typescript
const assigned = await agent.assign({ question: "What is time?" });
const messageId = assigned.id;
```

### Executing the Task

Next, use the `do` method to execute the task associated with the messageId.

```typescript
const nextMessageId = await agent.do(messageId);
```

### Retrieving the Answer

Finally, use the messageId returned by the `do` method to retrieve the `Agent`'s response from the
store.

```typescript
const answer = await agent._store.get(nextMessageId);
console.log(answer.message);
```

## Summary

The `do` method in the Hyv library provides an efficient mechanism for executing tasks with AI
models. Developers can thus interact with sophisticated AI models in a straightforward and
accessible way.

## Tags

Hyv, JavaScript, TypeScript, do Method, Agent, GPTModelAdapter
