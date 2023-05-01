import { Agent } from "../src/index.js";
import { GPTModelAdapter } from "../src/openai/index.js";
import type { GPT3Options } from "../src/openai/types.js";
import { createFileWriter, FSAdapter } from "../src/store/index.js";
import type { ModelMessage } from "../src/types.js";
import type { AgentOptions } from "../src/types.js";
import { createInstruction, sprint } from "../src/utils.js";

import { openai } from "./config.js";

const dir = "out/book";
const store = new FSAdapter(dir);
const fileWriter = createFileWriter(dir);
const book: ModelMessage & { title: string } = {
	title: "AGI can solve all problems",
};

interface AuthorData extends ModelMessage {
	images: [{ path: string; prompt: string }];
	files: [{ path: string; content: string }];
}

const options: AgentOptions<ModelMessage, AuthorData> = {
	tools: [fileWriter],
	async after<Message>(message) {
		return {
			...message,
			files: message.files.map(file => ({
				...file,
				readingTime: file.content.length / 1000,
			})),
		} as Message;
	},
};

const author = new Agent(
	new GPTModelAdapter<GPT3Options>(
		{
			model: "gpt-3.5-turbo",
			temperature: 0.5,
			maxTokens: 1024,
			historySize: 1,
			systemInstruction: createInstruction(
				"Scientific Author",
				"Write a short story with inline images in markdown. Add a descriptive prompt for each images to be created",
				{
					images: [{ path: "string", prompt: "string" }],
					files: [{ path: "string", content: "markdown" }],
				}
			),
		},
		openai
	),
	store,
	options
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
