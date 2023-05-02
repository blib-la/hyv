import { Agent } from "../src/index.js";
import { DallEModelAdapter, GPTModelAdapter } from "../src/openai/index.js";
import type { DallEOptions, GPT3Options } from "../src/openai/types.js";
import { createFileWriter, FSAdapter } from "../src/store/index.js";
import type { StoreAdapter } from "../src/store/types.js";
import type { ModelMessage } from "../src/types.js";
import type { AgentOptions } from "../src/types.js";
import type { ModelAdapter } from "../src/types.js";
import { createInstruction, sprint } from "../src/utils.js";

import { openai } from "./config.js";

const dir = "out/book";
const store = new FSAdapter(dir);
const fileWriter = createFileWriter(dir);
const imageWriter = createFileWriter(dir, "base64");
const book: ModelMessage & { title: string } = {
	title: "Mysteries of the pyramids",
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
				"Write a brief story with inline images in markdown. Add a descriptive prompt for each images to be created",
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

const illustrator = new Agent(
	new DallEModelAdapter<DallEOptions>(
		{
			size: "256x256",
			n: 1,
		},
		openai
	),
	store,
	{ tools: [imageWriter] }
);

try {
	const messageId = await store.set(book);
	await sprint<ModelAdapter<ModelMessage>, StoreAdapter>(messageId, [author, illustrator]);
	console.log("Done");
} catch (error) {
	console.error("Error:", error);
}
