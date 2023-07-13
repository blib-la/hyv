# Building Out the Prisma Store Adapter for Your Hyv Project

## Overview

Having set up the project and generated our Prisma client, we can now progress to building out our
Prisma store adapter. This guide will detail the creation and implementation of the adapter.

## Prerequisites

In addition to the prerequisites from the first part, you'll need a running PostgreSQL database that
the Prisma store adapter can interact with.

## Guide

### Initiating the Prisma Store Adapter

To begin, create a new file titled `PrismaStoreAdapter.ts` and open it.

```shell
touch PrismaStoreAdapter.ts
```

Start by importing the necessary modules:

```typescript
import { PrismaClient } from "@prisma/client";
import type { ModelMessage, StoreAdapter } from "@hyv/core";
```

Subsequently, define the Prisma store adapter class, which implements the `StoreAdapter` interface:

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

### Implementing the Set Method

Inside the class, define the `set` method. This method is responsible for storing a message in the
database and returning its ID:

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

### Implementing the Get Method

Finally, define the `get` method, which retrieves a message by its ID from the database:

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

Upon successful implementation, the `PrismaStoreAdapter` can now be utilized as a store for an
`Agent` within Hyv:

```typescript
import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";
import { PrismaStoreAdapter } from "./PrismaStoreAdapter";

const store = new PrismaStoreAdapter();
const agent = new Agent(new GPTModelAdapter(), { store });

// Now you can use the agent to assign and retrieve messages...
```

## Summary

In this guide, we have detailed the process of building out the Prisma store adapter for a Hyv
project. We initiated the Prisma store adapter, implemented the `set` and `get` methods, and
finally, employed the adapter in a Hyv `Agent`. This illustrates how a Prisma store adapter
interacts with a PostgreSQL database in a Hyv project. The same approach can be used to create store
adapters for other databases or storage systems. It only requires the implementation of the
`StoreAdapter` interface according to the specifications of your chosen database or storage system.

## Tags

Hyv, StoreAdapter, Prisma, PostgreSQL, Node.js, npm, Prisma CLI, Message model, Prisma Client,
Agent, GPTModelAdapter
