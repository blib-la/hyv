# Delegating Tasks with Hyv's assign Method

## Overview

This guide explains the usage of the `assign` method in the Hyv library, a fundamental feature of
the `Agent` class. This method enables developers to assign tasks to an `Agent` instance. It answers
questions such as: How do you create an `Agent` in Hyv? How can you assign a task to an `Agent`? How
can you retrieve and handle the `Agent`'s response?

## Prerequisites

Basic understanding of JavaScript or TypeScript, and familiarity with the Hyv library's `Agent` and
`GPTModelAdapter`.

## Guide

### Creating an Agent

Begin by creating an `Agent` object using the `GPTModelAdapter`.

```typescript
const agent = new Agent(new GPTModelAdapter());
```

### Assigning a Task

Then, use the `assign` method to assign a task to the `Agent`. The task is defined as an object with
a `question` property.

```typescript
const answer = await agent.assign({ question: "What is time?" });
```

### Retrieving the Answer

Finally, store the result of the `assign` method in a variable and access the `Agent`'s response via
the `message` property.

```typescript
console.log(answer.message);
```

## Summary

The `assign` method in Hyv presents a simple mechanism for interacting with AI models, allowing
developers to harness the capabilities of sophisticated AI models in an accessible way.

## Tags

Hyv, JavaScript, TypeScript, assign Method, Agent, GPTModelAdapter
