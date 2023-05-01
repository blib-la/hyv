import { Agent } from "../src/index.js";
import { GPTModelAdapter } from "../src/openai/index.js";
import type { GPT3Options } from "../src/openai/types.js";
import { FSAdapter } from "../src/store/index.js";
import type { ModelMessage } from "../src/types.js";
import { createInstruction, sprint } from "../src/utils.js";

const sharedStore = new FSAdapter("out/translation");

const translate = new Agent(
	new GPTModelAdapter<GPT3Options>({
		model: "gpt-3.5-turbo",
		temperature: 0.5,
		maxTokens: 256,
		historySize: 1,
		systemInstruction: createInstruction("AI", "Translate English text to German.", {
			translation: "",
		}),
	}),
	sharedStore
);

const paraphrase = new Agent(
	new GPTModelAdapter<GPT3Options>({
		model: "gpt-3.5-turbo",
		temperature: 0.5,
		maxTokens: 256,
		historySize: 1,
		systemInstruction: createInstruction("AI", "Paraphrase the summarized text.", {
			paraphrase: "",
		}),
	}),
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
