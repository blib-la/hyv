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
	headers: { "X-OpenAI-Api-Key": process.env.OPENAI_API_KEY },
});

class FooAdapter implements ModelAdapter<ModelMessage, ModelMessage> {
	#options: Record<string, any>;

	constructor(options: Record<string, any> = {}) {
		this.#options = options;
	}

	async assign(): Promise<ModelMessage> {
		return { thoughts: "I want to show the user some love", answer: "Thank you so much" };
	}
}

const agent = new Agent(new FooAdapter(), { store });
const message = {
	messages: [
		{
			username: "Fred",
			userId: "123456",
			message: "Hi, I like your setup",
		},
		{
			username: "Maria",
			userId: "212132",
			message: "I saw a cool movie yesterday",
		},
		{
			username: "Fred",
			userId: "123456",
			message: "Cool Maria, which one?",
		},
	],
};

try {
	//
	// agent.before = async modelMessage => modelMessage;
	// agent.finally = async messageId => {
	//	await Promise.all(message.messages.map(message_ => store.set(message_, "Message")));
	//	return messageId;
	// };
	const className = "Answer";
	// CAN ONLY BE DONE ONCE
	// Store.client.schema
	// 	.classCreator()
	// 	.withClass({
	// 		class: className,
	// 		properties: [
	// 			{
	// 				dataType: ["text"],
	// 				name: "thoughts",
	// 			},
	// 		],
	// 		vectorizer: "text2vec-openai", // This could be any vectorizer
	// 	})
	// 	.do()
	// 	.then(response => {
	// 		console.log(response);
	// 	})
	// 	.catch(error => {
	// 		console.error(error);
	// 	});
	const answer = await agent.assign(message, className);
	console.log(answer);

	// // Get a specific message
	const storedMessage = await store.get(answer.id, className);
	console.log(storedMessage);

	// Get messages
	const result = await store.client.graphql
		.get()
		.withClassName(className)
		.withHybrid({
			query: "showing gratitude",
			alpha: 0.5, // Optional, defaults to 0.75
		})
		.withFields("thoughts answer _additional { distance }")
		.do();
	console.log("\n\n------\n\n");
	console.log(JSON.stringify(result, null, 2));
} catch (error) {
	console.log(error);
}
