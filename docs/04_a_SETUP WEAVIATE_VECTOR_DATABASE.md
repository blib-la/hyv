# Developer Guide: Vector Database Setup with Weaviate for Hyv Agents

## Overview

This guide helps you understand how to set up a vector database with Weaviate for Hyv Agents. It
covers how to connect to the database, and how to create and save data in two classes: "Answer" and
"Message".

## Prerequisites

Before proceeding, ensure you have a
[free Weaviate sandbox](https://weaviate.io/developers/weaviate/quickstart#create-a-weaviate-instance)
setup. Keep your **API key** and **API host** accessible as they will be required in the subsequent
steps.

## Guide

### Connecting to the Vector Database

In this step, we will use the `WeaviateAdapter` class to establish a connection to the Weaviate
vector database. Be ready to provide the scheme, host, and API key.

```typescript
import type { WeaviateMessage } from "@hyv/store";
import { WeaviateAdapter } from "@hyv/store";
import { ApiKey } from "weaviate-ts-client";

const store = new WeaviateAdapter({
    scheme: "https",
    host: process.env.WEAVIATE_HOST,
    apiKey: new ApiKey(process.env.WEAVIATE_API_KEY),
    headers: { "X-OpenAI-Api-Key": process.env.OPENAI_API_KEY },
});
```

### Creating Classes to store Messages

Next, we will create two classes: "Answer" and "Message". These will be used to store and track user
interactions and responses.

Creation of the "Answer" class:

```typescript
const ANSWER = "Answer";
await store.createClass(
    {
        class: ANSWER,
        vectorizer: "text2vec-openai",
        moduleConfig: {
            "text2vec-openai": {
                model: "ada",
                modelVersion: "002",
                type: "text",
            },
        },
    },
    true
);
```

Creation of the "Message" class:

```typescript
const MESSAGE = "Message";
await store.createClass(
    {
        class: MESSAGE,
        vectorizer: "text2vec-openai",
        moduleConfig: {
            "text2vec-openai": {
                model: "ada",
                modelVersion: "002",
                type: "text",
            },
        },
    },
    true
);
```

## Summary

Upon following this guide, you will have established a connection with a Weaviate vector database
and created two classes: "Answer" and "Message". These classes will be used to track and store user
interactions and responses.

## Tags

Weaviate, Vector Database, Hyv Agents, Database Connection, Creating Classes
