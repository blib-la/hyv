# Implementing the Prisma Store Adapter for Hyv

Now that we have our project set up and our Prisma client generated, we can move on to implementing
our Prisma store adapter.

## Creating the Prisma Store Adapter

Create a new file named `PrismaStoreAdapter.ts` and open it:

```shell
touch PrismaStoreAdapter.ts
```

Start by importing the necessary modules:

```typescript
import { PrismaClient } from "@prisma/client";
import type { ModelMessage, StoreAdapter } from "@hyv/core";
```

Next, define the Prisma store adapter class, which implements the `StoreAdapter` interface:

```typescript
/**
 * Represents a Prisma store adapter for storing and retrieving messages.
 */
export class PrismaStoreAdapter implements StoreAdapter {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }
}
```

Inside the class, define the `set` method, which stores a message in the database and returns its
ID:

```typescript
export class PrismaStoreAdapter implements StoreAdapter {
    /**
     * Stores a message in the database and returns the messageId.
     * @async
     * @template Message - A type that extends ModelMessage.
     * @param message - The message to store.
     * @returns - A Promise that resolves to the messageId.
     */
    async set<Message extends ModelMessage>(message: Message): Promise<string> {
        const createdMessage = await this.prisma.message.create({
            data: {
                content: JSON.stringify(message),
            },
        });

        return createdMessage.id;
    }
}
```

Define the `get` method, which retrieves a message by its ID from the database:

```typescript
export class PrismaStoreAdapter implements StoreAdapter {
    /**
     * Retrieves a message by messageId from the database.
     * @async
     * @param messageId - The messageId of the message to retrieve.
     * @returns - A Promise that resolves to the message.
     * @throws - If there is an error retrieving the message.
     */
    async get(messageId: string): Promise<ModelMessage> {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });

        if (!message) {
            throw new Error(`Error retrieving message with ID ${messageId}`);
        }

        return JSON.parse(message.content);
    }
}
```

## Using the Prisma Store Adapter

You can now use the `PrismaStoreAdapter` as the store for an `Agent` in Hyv:

```typescript
import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";
import { PrismaStoreAdapter } from "./PrismaStoreAdapter";

const store = new PrismaStoreAdapter();
const agent = new Agent(new GPTModelAdapter(), { store });

// Now you can use the agent to assign and retrieve messages...
```

And that's it! You've created a custom Prisma store adapter for Hyv. You can use a similar process
to create store adapters for any other database or storage system. Just make sure to implement the
`StoreAdapter` interface according to the specifications of your particular database or storage
system.
