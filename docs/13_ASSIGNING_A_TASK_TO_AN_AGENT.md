# Using the assign Method in Hyv

The `assign` method is a central part of the `Agent` class in the Hyv library. It allows developers
to delegate tasks to an Agent instance.

## How to use the assign Method

Consider the following example:

```typescript
const agent = new Agent(new GPTModelAdapter());
const answer = await agent.assign({ question: "What is time?" });
console.log(answer.message);
```

Here's a breakdown of each part:

1. **Creating an Agent**: The first line of code creates a new `Agent` object. This Agent is
   constructed using a `GPTModelAdapter`. The `GPTModelAdapter` serves as an interface for the GPT-4
   language model, essentially "adapting" it for use within the Hyv ecosystem.

2. **Assigning a Task**: The `assign` method is called to give a task to the Agent. This task is
   defined as an object with a `question` property. In this example, the question is "What is
   time?". Note that the `assign` method is asynchronous; it returns a Promise that fulfills once
   the task is done.

3. **Receiving the Answer**: The result of the `assign` method is stored in the `answer` variable.
   This `answer` object has a `message` property, which contains the Agent's response to the
   provided task.

## Summary

The `assign` method in Hyv provides a simple, straightforward mechanism for interacting with AI
models. By assigning tasks and retrieving responses, developers can harness the power of advanced AI
models in a user-friendly and accessible manner.
