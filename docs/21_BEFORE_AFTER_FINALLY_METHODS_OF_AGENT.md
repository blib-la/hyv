# Customizing Hyv Agent Behavior with `before`, `after`, and `finally` Methods

Hyv's `Agent` class provides several mechanisms for tailoring the behavior of an agent. Among these
are the `before`, `after`, and `finally` methods, which can modify tasks at various stages of the
agent's operation cycle.

## The `before` Method

The `before` method is an optional asynchronous function that is invoked before an agent processes
the task. This method receives the task as a parameter and must return an object that includes the
updated task. This proves essential for preprocessing tasks or setting up any required state before
executing the task.

### Example usage of the `before` Method

```typescript
const agent = new Agent(new GPTModelAdapter(), {
    async before(message) {
        // Manipulate the message, for instance, omit properties and/or rename them
        return { task: message.answer };
    },
});
```

## The `after` Method

Similarly, the `after` method is an optional asynchronous function that is invoked after the task
processing by the agent. It also takes the task as a parameter and should return an object that
encapsulates the updated task. The `after` method can be particularly useful for tasks that require
post-processing or cleaning up any state following the task execution.

### Example usage of the `after` Method

```typescript
const agent = new Agent(new GPTModelAdapter(), {
    async after(message) {
        // Manipulate the message, for instance, omit properties and/or rename them
        return { task: message.answer };
    },
});
```

## The `finally` Method

Lastly, the `finally` method is an optional asynchronous function that gets triggered when the
process concludes. It receives the messageId and the processed message, and it should return the
messageId. This method can be highly advantageous for executing any final actions post-task
processing, such as logging or sending notifications.

### Example usage of the `finally` Method

```typescript
const agent = new Agent(new GPTModelAdapter(), {
    async finally(messageId, message) {
        // Perform some action with the message, for instance, send it to some other agent
        const result = await agent2.assign(message);
        return result.id;
    },
});
```

These methods are part of the options object that is passed to the `Agent` constructor when creating
a new agent. By offering ways to customize an agent's behavior, these methods cater to a wide range
of use cases, extending the versatility of the Hyv framework.
