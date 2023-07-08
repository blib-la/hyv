# Setting up a Vector Database with Weaviate for Hyv Agents

## What You Need to Start

To start, make sure you've set up your
[free Weaviate sandbox](https://weaviate.io/developers/weaviate/quickstart#create-a-weaviate-instance).
Keep your **API key** and **API host** at the ready.

## Connecting to the Database

We'll use the `WeaviateAdapter` class to connect to the Weaviate vector database. Be ready to
provide the scheme, host, and API key.

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

## Creating and Saving Data

We'll create two classes: "Answer" and "Message". We'll use these to store and track user
interactions and responses.

Creating the "Answer" class:

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

Creating the "Message" class:

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
