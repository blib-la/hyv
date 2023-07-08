# Setting Up a Project for a MongoDB Store Adapter for Hyv

A store adapter in Hyv is a custom implementation of the `StoreAdapter` interface, which defines two
methods: `set` for storing messages and `get` for retrieving them. This guide will guide you through
the process of creating a MongoDB store adapter using the Mongoose library.

## Prerequisites

Before you begin, you should have Node.js and npm installed on your computer. You also need to have
a MongoDB database set up and the connection details at hand.

Then install the necessary dependencies:

```shell
npm install mongoose @hyv/core nanoid
```

This will install Mongoose for interacting with MongoDB, Hyv for the `StoreAdapter` interface and
`ModelMessage` type, and `nanoid` for generating unique IDs.

## Creating the MongoDB Store Adapter

Create a new file named `MongoDBStoreAdapter.ts`:

```shell
touch MongoDBStoreAdapter.ts
```

Open the `MongoDBStoreAdapter.ts` file and import the necessary modules:

```typescript
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import type { ModelMessage, StoreAdapter } from "@hyv/core";
```

Next, define the Mongoose schema and model for the messages that you will store in MongoDB:

```typescript
const messageSchema = new mongoose.Schema(
    {
        _id: String,
        message: Object,
    },
    { _id: false }
);

const MessageModel = mongoose.model("Message", messageSchema);
```

In the schema, `_id` is the field for the unique ID of each message, and `message` is the field for
the message content. The option `{ _id: false }` is set because we will manually assign the `_id`
field when creating a new document.

Next, define the MongoDB store adapter class, which implements the `StoreAdapter` interface:

```typescript
/**
 * Represents a MongoDB store adapter for storing and retrieving messages.
 */
export class MongoDBStoreAdapter implements StoreAdapter {}
```
