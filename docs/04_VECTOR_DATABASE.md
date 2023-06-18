# Vector database

## Before You Begin

Make sure that you have [setup your free Weaviate sandbox]([## Before You Begin](https://weaviate.io/developers/weaviate/quickstart#create-a-weaviate-instance)) and have your **API key** + **API host**.

## Connect to the vector database

Establish a connection to the Weaviate vector database. It uses the WeaviateAdapter class and specifies the connection parameters such as the scheme, host, and API key.

```typescript
import type { WeaviateMessage } from "@hyv/store";
import { WeaviateAdapter } from "@hyv/store";
import { ApiKey } from "weaviate-ts-client";

const store = new WeaviateAdapter({
	scheme: "https",
	host: "<API_HOST>",
	apiKey: new ApiKey("<API_KEY"),
});
```

## Save data into the vector database

It defines a "User" object with the property "name" and uses the `set` method of the `WeaviateAdapter` instance to store the data, which returns a unique `messageID`.

```typescript
const message: WeaviateMessage = {
	className: "User",
	properties: {
		name: "YourFriendlyUser",
	},
};

const messageId = await store.set(message);
```

## Get data by ID

How to retrieve data from the vector database using a specific ID. It calls the `get` method of the `WeaviateAdapter` instance, passing in the previously obtained `messageID` and the `className` "User".

```typescript
const messageById = await store.get(messageId, "User");
```

## Get data by class and where condition

This demonstrates how to query data from the vector database using a specific `className` and a `where` condition. The `where` condition allows you to specify precise criteria that the retrieved data needs to meet.

The `className` "User", the field "name", and a `where` condition object are passed as arguments. This `where` condition specifies that we are interested in `User` objects where the `name` is "YourFriendlyUser".

```typescript
const where = {
	operator: "Equal",
	path: ["name"],
	valueText: "YourFriendlyUser",
}

const allMessages = await store.search("User", "name", where);
```
