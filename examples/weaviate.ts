import process from "node:process";

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

const messageClass: WeaviateClass = {
	class: "Message",
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

//
// class FooAdapter implements ModelAdapter<ModelMessage, ModelMessage> {
// 	#options: Record<string, any>;

// 	constructor(options: Record<string, any> = {}) {
// 		this.#options = options;
// 	}

// 	async assign(): Promise<ModelMessage> {
// 		return { thoughts: "I want to show the user some love", answer: "Thank you so much" };
// 	}
// }
// const agent = new Agent(new FooAdapter(), { store });

const message = {
	messages: [
		{
			username: "Fred",
			userId: 123456,
			message: "Hi, I like your setup",
		},
		{
			username: "Maria",
			userId: 212132,
			message: "I saw a cool movie yesterday",
		},
		{
			username: "Fred",
			userId: 123456,
			message: "Cool Maria, which one?",
		},
	],
};

// Insert messages
try {
	await Promise.all(message.messages.map(message_ => store.set(message_, "Message")));
} catch (error) {
	console.log(error);
}

// Get messages with nearText
console.log(
	JSON.stringify(
		await store.searchNearText("Message", "message username", ["I love a good movie"])
	)
);

// Get messages with nearText and making sure that the result is far away
// from the search vector by specifiying a distance of 0.5
console.log(
	JSON.stringify(
		await store.searchNearText("Message", "message username", ["I love a good movie"], {
			distance: 0.5,
		})
	)
);

//
// try {
// 	//
// 	// agent.before = async modelMessage => modelMessage;
// 	// agent.finally = async messageId => {
// 	//	await Promise.all(message.messages.map(message_ => store.set(message_, "Message")));
// 	//	return messageId;
// 	// };
// 	const className = "Answer";
// 	// CAN ONLY BE DONE ONCE
// 	// Store.client.schema
// 	// 	.classCreator()
// 	// 	.withClass({
// 	// 		class: className,
// 	// 		properties: [
// 	// 			{
// 	// 				dataType: ["text"],
// 	// 				name: "thoughts",
// 	// 			},
// 	// 		],
// 	// 		vectorizer: "text2vec-openai", // This could be any vectorizer
// 	// 	})
// 	// 	.do()
// 	// 	.then(response => {
// 	// 		console.log(response);
// 	// 	})
// 	// 	.catch(error => {
// 	// 		console.error(error);
// 	// 	});
// 	const answer = await agent.assign(message, className);
// 	console.log(answer);

// 	// // Get a specific message
// 	const storedMessage = await store.get(answer.id, className);
// 	console.log(storedMessage);

// 	// Get messages
// 	const result = await store.client.graphql
// 		.get()
// 		.withClassName(className)
// 		.withHybrid({
// 			query: "showing gratitude",
// 			alpha: 0.5, // Optional, defaults to 0.75
// 		})
// 		.withFields("thoughts answer _additional { distance }")
// 		.do();
// 	console.log("\n\n------\n\n");
// 	console.log(JSON.stringify(result, null, 2));
// } catch (error) {
// 	console.log(error);
// }
