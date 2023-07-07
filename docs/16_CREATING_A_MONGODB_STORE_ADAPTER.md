# Creating a MongoDB Store Adapter for Hyv

A store adapter in Hyv is a custom implementation of the `StoreAdapter` interface, which defines two
methods: `set` for storing messages and `get` for retrieving them. You can create a store adapter
for any database or storage system. Here, we'll guide you through the process of creating a MongoDB
store adapter using the Mongoose library.

## Prerequisites

Before you begin, you should have Node.js and npm installed on your computer. You also need to have
a MongoDB database set up and the connection details at hand.

First, create a new project directory and initialize a new Node.js project:

```shell
mkdir hyv-mongodb-adapter && cd hyv-mongodb-adapter
npm init -y
```

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

Inside the class, define the `set` method for storing messages. This method takes a message as a
parameter, generates a unique ID for the message using `nanoid`, and then saves the message in the
MongoDB database using the `MessageModel`:

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

Finally, define the `get` method for retrieving messages. This method takes a message ID as a
parameter, retrieves the corresponding message from the MongoDB database using the `MessageModel`,
and returns the message:

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

If no message with the given ID is found, the method throws an error.

## Connecting to MongoDB

Before using the `MongoDBStoreAdapter`, make sure to connect to your MongoDB database using
Mongoose. You can do this in your main application file:

```typescript
mongoose.connect("mongodb://localhost:27017/mydb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
```

Replace `'mongodb://localhost:27017/mydb'` with the connection string for your MongoDB database.

You can now use the `MongoDBStoreAdapter` as the store for an `Agent` in Hyv:

```typescript
import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";
import { MongoDBStoreAdapter } from "./MongoDBStoreAdapter";

const store = new MongoDBStoreAdapter();
const agent = new Agent(new GPTModelAdapter(), { store });

// Now you can use the agent to assign and retrieve messages...
```

And there you have it! You've created a custom MongoDB store adapter for Hyv. This guide
demonstrates the process for MongoDB, but you can use a similar approach to create store adapters
for any other database or storage system. Just implement the `StoreAdapter` interface according to
the requirements of your specific database or storage system.
