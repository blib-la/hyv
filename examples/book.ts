import slugify from "@sindresorhus/slugify";

import { Agent } from "../packages/core/src/agent.js";
import type { ModelMessage } from "../packages/core/src/types.js";
import type { AgentOptions } from "../packages/core/src/types.js";
import type { ModelAdapter } from "../packages/core/src/types.js";
import type { StoreAdapter } from "../packages/core/src/types.js";
import { createInstruction, minify, sprint } from "../packages/core/src/utils.js";
import { GPTModelAdapter } from "../packages/openai/src/gpt-model-adapter.js";
import { DallEModelAdapter } from "../packages/openai/src/index.js";
import type { GPT4Options } from "../packages/openai/src/types.js";
import { createFileWriter, FSAdapter } from "../packages/store/src/index.js";

import { openai } from "./config.js";

const title = "The AIgent";
const genre = "Science Fiction";
const illustrationStyle = "watercolor illustration";
const context = "AGI has become reality";

const dir = `out/stories/${slugify(title)}`;
const store = new FSAdapter(dir);
const fileWriter = createFileWriter(dir);
const imageWriter = createFileWriter(dir, "base64");

const book: ModelMessage & {
	title: string;
	context: string;
	genre: string;
	imageCount: number;
	chapterCount: number;
	illustrationStyle: string;
} = {
	title,
	context,
	genre,
	imageCount: 3,
	chapterCount: 3,
	illustrationStyle,
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
				1. Write a long bestseller story (500-600 words long)!
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
	new DallEModelAdapter(
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
