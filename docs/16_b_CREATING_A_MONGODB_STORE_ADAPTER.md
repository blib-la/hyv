# Building Out the MongoDB Store Adapter for Your Hyv Project

## Overview

Having outlined our MongoDB store adapter class, the next stage involves the implementation of `set`
and `get` methods, as mandated by the `StoreAdapter` interface. This guide will direct you through
this process.

## Prerequisites

In addition to the prerequisites from the first part, you will need a running MongoDB database that
the MongoDB store adapter can interact with.

## Guide

### Implementing the Set Method

The `set` method is used for storing messages. It accepts a message as a parameter, generates a
unique ID for it using `nanoid`, and then preserves the message in the MongoDB database via the
`MessageModel`.

```typescript
class MongoDBStoreAdapter {
    /**
     * Stores a message in MongoDB and returns the messageId.
     * @async
     * @template Message - A type that extends ModelMessage.
     * @param message - The message to store.
     * @returns - A Promise that resolves to the messageId.
     */
    async set<Message extends ModelMessage>(message: Message): Promise<string> {
        const messageId = nanoid();
        await new MessageModel({ _id: messageId, message }).save();

        return messageId;
    }
}
```

### Implementing the Get Method

Subsequently, the `get` method is defined for retrieving messages. It takes a message ID as an
input, fetches the corresponding message from the MongoDB database using `MessageModel`, and then
returns the message.

```typescript
class MongoDBStoreAdapter {
    /**
     * Retrieves a message by messageId from MongoDB.
     * @async
     * @param messageId - The messageId of the message to retrieve.
     * @returns - A Promise that resolves to the message.
     * @throws - If there is an error retrieving the message.
     */
    async get(messageId: string): Promise<ModelMessage> {
        const doc = await MessageModel.findById(messageId);
        if (doc) {
            return doc.message;
        }

        throw new Error(`Error retrieving message with ID ${messageId}`);
    }
}
```

If no message matching the provided ID is found, the method will throw an error.

## Connecting to MongoDB

Before employing the `MongoDBStoreAdapter`, it is essential to establish a connection to your
MongoDB database using Mongoose. This can be done in your main application file:

```typescript
mongoose.connect("mongodb://localhost:27017/mydb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
```

Make sure to replace `'mongodb://localhost:27017/mydb'` with your MongoDB database's connection
string.

Following successful connection, the `MongoDBStoreAdapter` can now be used as a store for an `Agent`
within Hyv:

```typescript
import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";
import { MongoDBStoreAdapter } from "./MongoDBStoreAdapter";

const store = new MongoDBStoreAdapter();
const agent = new Agent(new GPTModelAdapter(), { store });

// Now you can use the agent to assign and retrieve messages...
```

## Summary

This guide led you through the process of building out the MongoDB store adapter for your Hyv
project. We implemented the `set` and `get` methods, connected to MongoDB, and incorporated the
adapter into a Hyv `Agent`. This tutorial demonstrated the process for MongoDB; however, you can
apply a similar approach to establish store adapters for any other database or storage system.
Simply implement the `StoreAdapter` interface according to your specific database or storage
system's requirements.

## Tags

Hyv, StoreAdapter, MongoDB, Mongoose, nanoid, ModelMessage, Node.js, npm, Agent, GPTModelAdapter
