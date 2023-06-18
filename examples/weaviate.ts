import type { WeaviateMessage } from "@hyv/store";
import { WeaviateAdapter } from "@hyv/store";
import { ApiKey } from "weaviate-ts-client";
import "dotenv/config";

const store = new WeaviateAdapter({
	scheme: "https",
	host: process.env.WEAVIATE_HOST,
	apiKey: new ApiKey(process.env.WEAVIATE_API_KEY),
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

// Get messages from the "User" where the "name" equals "YourFriendlyUser"
const allMessages = await store.search("User", "name", {
	operator: "Equal",
	path: ["name"],
	valueText: "YourFriendlyUser",
});
console.log(allMessages.data.Get.User);
