import { Agent } from "../packages/core/src/agent.js";
import type { ModelMessage } from "../packages/core/src/types.js";
import { createInstruction, sprint } from "../packages/core/src/utils.js";
import { GPTModelAdapter } from "../packages/openai/src/gpt-model-adapter.js";
import type { GPT3Options } from "../packages/openai/src/types.js";
import { FSAdapter } from "../packages/store/src/index.js";

import { openai } from "./config.js";

const sharedStore = new FSAdapter("out/translation");

const translate = new Agent(
	new GPTModelAdapter<GPT3Options>(
		{
			model: "gpt-3.5-turbo",
			temperature: 0.5,
			maxTokens: 256,
			historySize: 1,
			systemInstruction: createInstruction("AI", "Translate English text to German.", {
				translation: "",
			}),
		},
		openai
	),
	sharedStore
);

const paraphrase = new Agent(
	new GPTModelAdapter<GPT3Options>(
		{
			model: "gpt-3.5-turbo",
			temperature: 0.5,
			maxTokens: 256,
			historySize: 1,
			systemInstruction: createInstruction("AI", "Paraphrase the summarized text.", {
				paraphrase: "",
			}),
		},
		openai
	),
	sharedStore
);

// Example Process

const message: ModelMessage & { content: string } = {
	content: "My name is Hive. I am easy to use",
};

try {
	const messageId = await sharedStore.set(message);
	await sprint(messageId, [translate, paraphrase]);
	console.log("Done");
} catch (error) {
	console.error("Error:", error);
}
