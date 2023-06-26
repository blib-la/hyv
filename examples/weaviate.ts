import process from "node:process";

import type { ModelAdapter, ModelMessage } from "@hyv/core";
import { Agent } from "@hyv/core";
import { WeaviateAdapter } from "@hyv/store";
import { config } from "dotenv";
import { ApiKey } from "weaviate-ts-client";

config();

const store = new WeaviateAdapter({
	scheme: "https",
	host: process.env.WEAVIATE_HOST,
	apiKey: new ApiKey(process.env.WEAVIATE_API_KEY),
});

class FooAdapter implements ModelAdapter<ModelMessage, ModelMessage> {
	#options: Record<string, any>;

	constructor(options: Record<string, any> = {}) {
		this.#options = options;
	}

	async assign(): Promise<ModelMessage> {
		return { thoughts: "I want to thank the user", answer: "Thank you so much" };
	}
}

const agent = new Agent(new FooAdapter(), { store });
const message = {
	messages: [
		{
			username: "Fred",
			userId: "123456",
			message: "Hi, I like your setup",
			nested: { object: "example" },
			timestamp: 12345,
		},
		{
			username: "Maria",
			userId: "212132",
			message: "I saw a cool movie yesterday",
			nested: { object: "example" },
			timestamp: 12345,
		},
		{
			username: "Fred",
			userId: "123456",
			message: "Cool Maria, which one?",
			nested: { object: "example" },
			timestamp: 12345,
		},
	],
};

try {
	agent.before = async modelMessage => modelMessage;
	agent.finally = async messageId => {
		await Promise.all(message.messages.map(message_ => store.set(message_, "Message")));
		return messageId;
	};

	const answer = await agent.assign(message, "Answer");
	console.log(answer);

	// // Get a specific message
	const storedMessage = await store.get(answer.id, "Answer");
	console.log(storedMessage);

	// Get messages
	const result = await store.client.graphql
		.get()
		.withClassName("Answer")
		.withNearObject({ id: answer.id })
		.withLimit(2)
		.withOffset(1)
		.withFields("thoughts answer _additional { distance }")
		.do();

	console.log(JSON.stringify(result, null, 2));
} catch (error) {
	console.log(error);
}
