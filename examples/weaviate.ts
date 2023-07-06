import process from "node:process";

import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";
import { WeaviateAdapter } from "@hyv/store";
import { config } from "dotenv";
import type { WeaviateClass } from "weaviate-ts-client";
import { ApiKey } from "weaviate-ts-client";

config();

const store = new WeaviateAdapter({
	scheme: "https",
	host: process.env.WEAVIATE_HOST,
	apiKey: new ApiKey(process.env.WEAVIATE_API_KEY),
	headers: { "X-OpenAI-Api-Key": process.env.OPENAI_API_KEY },
});
const className = "Answer";
const className2 = "Message";

const messageClass: WeaviateClass = {
	class: className,
	vectorizer: "text2vec-openai",
	moduleConfig: {
		"text2vec-openai": {
			model: "ada",
			modelVersion: "002",
			type: "text",
		},
	},
};

const messageClass2: WeaviateClass = {
	class: className2,
	vectorizer: "text2vec-openai",
	moduleConfig: {
		"text2vec-openai": {
			model: "ada",
			modelVersion: "002",
			type: "text",
		},
	},
};

// We use "force: true" here to not have the same kind of example data
// over and over in our store. This will delete the data every time
await store.createClass(messageClass, true);
await store.createClass(messageClass2, true);

const agent = new Agent(new GPTModelAdapter({ model: "gpt-4" }), { store });

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
			username: "Andre",
			userId: "654121",
			message: "Movies are stupid",
		},
		{
			username: "Alex",
			userId: "165434",
			message: "Don't be mean Andre",
		},
		{
			username: "Fred",
			userId: "123456",
			message: "Cool Maria, which one?",
		},
		{
			username: "Maria",
			userId: "212132",
			message: "Rangers of the Matrix. I loved it, you gotta watch it",
		},
	],
};

try {
	agent.finally = async messageId => {
		await Promise.all(message.messages.map(message_ => store.set(message_, className2)));
		return messageId;
	};

	const answer = await agent.assign(message, className);
	console.log(answer);

	// Get messages
	const result = await store.searchNearText(
		className2,
		"message username userId _additional { distance }",
		["Maria"]
	);

	console.log("\n\n------\n\n");
	console.log(JSON.stringify(result.data.Get.Message, null, 2));
} catch (error) {
	console.log(error);
}
