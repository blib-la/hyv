import slugify from "@sindresorhus/slugify";

import { Agent } from "../src/index.js";
import { DallEModelAdapter, GPTModelAdapter } from "../src/openai/index.js";
import type { DallEOptions, GPT4Options } from "../src/openai/types.js";
import { createFileWriter, FSAdapter } from "../src/store/index.js";
import type { StoreAdapter } from "../src/store/types.js";
import type { ModelMessage } from "../src/types.js";
import type { AgentOptions } from "../src/types.js";
import type { ModelAdapter } from "../src/types.js";
import { createInstruction, minify, sprint } from "../src/utils.js";

import { openai } from "./config.js";

const title = "Wonderland";
const genre = "Fantasy Novel";
const illustrationStyle = "flat illustration";
const writingStyle = "William Shakespeare";
const context = "A universe in which all humans are treated equally";

const dir = `out/stories/${slugify(title)}`;
const store = new FSAdapter(dir);
const fileWriter = createFileWriter(dir);
const imageWriter = createFileWriter(dir, "base64");

const book: ModelMessage & {
	title: string;
	context: string;
	genre: string;
	maxImages: number;
	illustrationStyle: string;
	writingStyle: string;
} = {
	title,
	context,
	genre,
	maxImages: 3,
	illustrationStyle,
	writingStyle,
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
	new GPTModelAdapter<GPT4Options>(
		{
			model: "gpt-4",
			temperature: 0.7,
			maxTokens: 4096,
			historySize: 1,
			systemInstruction: createInstruction(
				"Author",
				minify`
				1. Write a long bestseller story with several long paragraphs!
				2. Write a Markdown document WITH IMAGE TAGS and short alt text!
				3. INLINE all images (as Markdown) **as part of the story**!
				4. All images should be LOCAL FILES!
				5. Add a DETAILED, CLEAR and very DESCRIPTIVE prompt with "illustrationStyle" for each image to be generated.
				`,
				{
					images: [{ path: "string", prompt: "string" }],
					files: [{ path: "story.md", content: "markdown" }],
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
