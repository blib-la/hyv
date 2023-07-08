# Implementing the MongoDB Store Adapter for Hyv

Now that we have defined our MongoDB store adapter class, we will implement the `set` and `get`
methods required by the `StoreAdapter` interface.

Define the `set` method for storing messages. This method takes a message as a parameter, generates
a unique ID for the message using `nanoid`, and then saves the message in the MongoDB database using
the `MessageModel`:

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
