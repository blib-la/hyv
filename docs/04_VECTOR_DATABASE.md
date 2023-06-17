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

## Get data by ID from the vector database

How to retrieve data from the vector database using a specific ID. It calls the `get` method of the `WeaviateAdapter` instance, passing in the previously obtained `messageID` and the `className` "User".

```typescript
const messageById = await store.get(messageId, "User");
```

## Get data by class from the vector database

Retrieve data from the vector database based on the `className` and field. It uses the `search` method of the `WeaviateAdapter` instance, passing in the `className` "User" and the field "name". 

```typescript
const messageByClass = await store.search("User", "name")
```
