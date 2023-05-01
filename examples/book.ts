import { Agent } from "../src/index.js";
import { GPTModelAdapter } from "../src/openai/index.js";
import type { GPT3Options } from "../src/openai/types.js";
import { createFileWriter, FSAdapter } from "../src/store/index.js";
import type { ModelMessage } from "../src/types.js";
import { createInstruction, sprint } from "../src/utils.js";

import { openai } from "./config.js";

const dir = "out/book";
const store = new FSAdapter(dir);
const fileWriter = createFileWriter(dir);
const book: ModelMessage & { title: string } = {
	title: "The future and beyond",
};

const author = new Agent(
	new GPTModelAdapter<GPT3Options>(
		{
			model: "gpt-3.5-turbo",
			temperature: 0.5,
			maxTokens: 512,
			historySize: 1,
			systemInstruction: createInstruction(
				"Scientific Author",
				"Write a story and describe required illustrations in detail",
				{
					illustrations: "string[]",
					files: [{ path: "string", content: "markdown" }],
				}
			),
		},
		openai
	),
	store,
	[fileWriter]
);

/*
// Future API
const illustrator = new Agent(
	new DallEModelAdapter<DallEOptions>({
		size: "1024x1024",
		n: 1,
		systemInstruction: createInstruction("Illustrator", "Create illustrations for the chapter.", {
			files: [{ path: "string", content: "string" }],
		}),
	}),
	store,
	[fileWriter]
);
*/

try {
	const messageId = await store.set(book);
	await sprint(messageId, [author]);
	console.log("Done");
} catch (error) {
	console.error("Error:", error);
}
