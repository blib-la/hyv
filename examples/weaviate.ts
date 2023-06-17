import type { WeaviateMessage } from "@hyv/store";
import { WeaviateAdapter } from "@hyv/store";
import { ApiKey } from "weaviate-ts-client";

const store = new WeaviateAdapter({
	scheme: "https",
	host: "",
	apiKey: new ApiKey(""),
});

const message: WeaviateMessage = {
	className: "User",
	properties: {
		name: "YourFriendlyUser",
	},
};

// Store a message
const messageId = await store.set(message);
console.log(messageId);

// Get a specific message
const storedMessage = await store.get(messageId, "User");
console.log(storedMessage);

// Get all messages of class "user"
const allMessages = await store.search("User", "name");
console.log(allMessages.data.Get.User);
