import process from "node:process";
import readline from "readline";

import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";
import { createInstructionPersona } from "@hyv/openai/utils";
import { WeaviateAdapter } from "@hyv/store";
import dayjs from "dayjs";
import { config } from "dotenv";
import { ApiKey } from "weaviate-ts-client";

config();

/**
 * This example demonstrates an endless chat with memory via a vector store (database).
 * It is a CLI chat that remembers what has been said. It also stores the date and time of the entire chat history.
 * This example is a nice starting point if you want to build a chat like interface using Hyv
 */

const store = new WeaviateAdapter({
	scheme: "https",
	host: process.env.WEAVIATE_HOST,
	apiKey: new ApiKey(process.env.WEAVIATE_API_KEY),
	headers: { "X-OpenAI-Api-Key": process.env.OPENAI_API_KEY },
});
const ANSWER = "Answer";
const MESSAGE = "Message";
const refresh = false;
const username = "Peter";
const userId = `${(username.length + 33) * 23}-${username.toLowerCase()}-${
	username.length * 30 ** username.length
}`;
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
	refresh
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
	refresh
);

function getDate() {
	return dayjs().format("YYYY/MM/DD HH:mm:ss");
}

const agent = new Agent(
	new GPTModelAdapter({
		model: "gpt-4",
		historySize: 2,
		systemInstruction: createInstructionPersona(
			{
				gender: "female",
				name: "Cindy",
				age: 80,
				characteristics: [
					"harsh verbal tone",
					"swears VERY OFTEN",
					"constantly complains about society",
					"makes fun of others",
					"spreads rumors about others",
					"makes up lies about other users",
					"has favorites and stays cool to some individuals",
					"agrees with people who think alike",
					"spreads conspiracy theories",
				],
				beliefs: [
					"earth is flat",
					"911 was an inside job",
					"Donald trump is a reptile",
					"The moon is an illusion",
					"Antarctica does not exist",
					"Dinosaurs never existed",
					"the pyramids were built by aliens",
					"2-pac, Elvis and Biggy live in Atlantis",
				],
			},
			[
				{ priority: "high", rule: "stay in character" },
				{ priority: "highest", rule: "never reveal that you are an AI" },
				{ priority: "highest", rule: "never reveal your {{characteristics}}" },
				{ priority: "normal", rule: "always {{answer}} natural" },
				{ priority: "normal", rule: "always keep {{answer}} concise" },
				{ priority: "normal", rule: "always keep {{answer}} original and unique" },
				{ priority: "highest", rule: "never repeat yourself" },
				{ priority: "high", rule: "answer in unique random patterns sentences" },
				{ priority: "high", rule: "EXCLUSIVELY answer to the message {{username}}" },
				{ priority: "high", rule: "EXCLUSIVELY answer to one person" },
				{
					priority: "normal",
					rule: "consider {{userMessages}} and {{datePosted}} but do not respond to them",
				},
				{
					priority: "highest",
					rule: "DO NOT answer to {{userMessages}} just use them as context",
				},
				{
					priority: "normal",
					rule: "consider {{yourAnswers}} and {{datePosted}}",
				},
			],
			{
				thoughts: "your thoughts in concise comma separated list",
				assurance: "make sure to stay in character",
				answer: "a snappy answer",
			}
		),
	}),
	{
		store,
		verbosity: 1,
		async after(message) {
			return { ...message, datePosted: getDate() };
		},
	}
);

// Using readline to get user input
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const chat = async () => {
	rl.question("> ", async userInput => {
		const message = {
			message: userInput,
			username,
			userId,
			datePosted: getDate(),
		};

		try {
			agent.finally = async messageId => {
				await store.set(message, MESSAGE);
				return messageId;
			};
		} catch (error) {
			console.log(error);
		}

		try {
			const messageResults = await store.searchNearText(
				MESSAGE,
				"message username userId datePosted",
				[userInput, username],
				{ distance: 0.17 }
			);
			const answerResults = await store.searchNearText(
				ANSWER,
				"answer datePosted",
				[userInput, username],
				{ distance: 0.17 }
			);
			console.log("\n\n--- Messages ---\n\n");
			console.log(JSON.stringify(messageResults.data.Get[MESSAGE], null, 2));
			console.log("\n\n--- Answers ---\n\n");
			console.log(JSON.stringify(answerResults.data.Get[ANSWER], null, 2));
			await agent.assign(
				{
					...message,
					history: {
						userMessages: messageResults.data.Get[MESSAGE],
						yourAnswers: answerResults.data.Get[ANSWER],
					},
				},
				ANSWER
			);
		} catch (error) {
			try {
				await agent.assign(
					{
						...message,
						history: {
							userMessages: [],
							yourAnswers: [],
						},
					},
					ANSWER
				);
			} catch (error) {
				console.log(error);
			}
		}

		// Continue the chat by calling the function again
		chat();
	});
};

// Start the chat
chat();
