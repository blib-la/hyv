# Creating a Prisma Store Adapter for Hyv

In Hyv, a store adapter is a custom implementation of the `StoreAdapter` interface. It is designed
to work with any database or storage system. In this guide, we will walk you through the process of
creating a Prisma store adapter for a PostgreSQL database.

## Prerequisites

Before you start, make sure you have the following installed:

1. Node.js and npm
2. Prisma CLI: You can install it by running `npm install @prisma/cli --save-dev`.

You also need to have a PostgreSQL database setup and its connection details available.

## Setting up Prisma

After installing the Prisma CLI, initialize Prisma in your project by running the following command:

```shell
npx prisma init
```

This command creates a `prisma` directory in your project, with two files inside: `schema.prisma`
(the Prisma schema file), and `.env` (the environment variables file).

Edit the `.env` file to include your database connection details. It should look something like
this:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

Replace `user`, `password`, `localhost`, `5432`, and `mydb` with your actual PostgreSQL connection
details.

In the `schema.prisma` file, define a `Message` model. For example:

```prisma
model Message {
  id      String   @id @default(cuid())
  content Json
}
```

The `id` field is the unique identifier of each message, and `content` is the field where we will
store the message content. `cuid()` generates a unique ID for each message, and `Json` allows us to
store a JSON object.

Run the following command to generate Prisma Client:

```shell
npx prisma generate
```

Prisma Client is a type-safe database client that's generated from your Prisma schema.

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
