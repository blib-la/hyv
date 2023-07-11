# Establishing a MongoDB Store Adapter for Your Hyv Project

## Overview

In Hyv, a store adapter is a custom rendition of the `StoreAdapter` interface, which outlines two
essential methods: `set` (for storing messages) and `get` (for retrieving messages). This guide is
designed to assist you in constructing a MongoDB store adapter, utilizing the Mongoose library.

## Prerequisites

Prior to initiating, ensure that Node.js and npm are installed on your system. Additionally, it is
required to have a MongoDB database configured and the corresponding connection details available.

## Guide

### Installing Necessary Dependencies

Start by installing the required dependencies. Mongoose is used to interact with MongoDB, Hyv
provides the `StoreAdapter` interface and `ModelMessage` type, and `nanoid` is utilized to generate
unique IDs.

```shell
npm install mongoose @hyv/core nanoid
```

### Initiation of the MongoDB Store Adapter

To begin, create a new file titled `MongoDBStoreAdapter.ts`.

```shell
touch MongoDBStoreAdapter.ts
```

Subsequently, open the `MongoDBStoreAdapter.ts` file and import the necessary modules:

```typescript
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import type { ModelMessage, StoreAdapter } from "@hyv/core";
```

### Defining the Mongoose Schema and Model

Proceed to establish the Mongoose schema and model for the messages that will be stored in MongoDB:

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

In this schema, `_id` serves as the unique ID for each message, while `message` holds the content of
the message. The `{ _id: false }` option is set because we will manually assign the `_id` field when
generating a new document.

### Forming the MongoDB Store Adapter Class

Finally, create the MongoDB store adapter class. This class implements the `StoreAdapter` interface:

```typescript
/**
 * Represents a MongoDB store adapter for storing and retrieving messages.
 */
export class MongoDBStoreAdapter implements StoreAdapter {}
```

## Summary

In this guide, we walked through the process of setting up a MongoDB store adapter for a Hyv
project, using the Mongoose library. We have installed the required dependencies, created the
necessary files, and defined the Mongoose schema and model for messages. Finally, we outlined the
MongoDB store adapter class. This provides a solid foundation for adding the `set` and `get` methods
in the next stages of the project.

## Tags

Hyv, StoreAdapter, MongoDB, Mongoose, nanoid, ModelMessage, npm, Node.js
