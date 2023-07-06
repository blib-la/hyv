import process from "node:process";
import readline from "readline";

import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";
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
const ANSWER = "Answer";
const MESSAGE = "Message";

// We use "force: true" here to not have the same kind of example data
// over and over in our store. This will delete the data every time
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
	false
);
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
	false
);

const agent = new Agent(new GPTModelAdapter({ model: "gpt-4" }), { store, verbosity: 1 });

// Using readline to get user input
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const chat = async () => {
	rl.question("Max: ", async userInput => {
		const message = { message: userInput, username: "Max", userId: "kqw112klj21-kjl123" };

		try {
			agent.finally = async messageId => {
				await store.set(message, MESSAGE);
				return messageId;
			};

			// Get messages
			const messageResults = await store.searchNearText(MESSAGE, "message username", [
				userInput,
				"Max",
			]);
			const answerResults = await store.searchNearText(ANSWER, "answer", [userInput]);
			console.log("\n\n--- Messages ---\n\n");
			console.log(JSON.stringify(messageResults.data.Get.Message, null, 2));
			console.log("\n\n--- Answers ---\n\n");
			console.log(JSON.stringify(answerResults.data.Get.Answer, null, 2));
			await agent.assign(
				{
					...message,
					relatedMessages: messageResults.data.Get.Message,
					yourPreviousRelatedAnswers: answerResults.data.Get.Answer,
				},
				ANSWER
			);
		} catch (error) {
			console.log(error);
		}

		// Continue the chat by calling the function again
		chat();
	});
};

// Start the chat
chat();
