import path from "node:path";

import type { ModelMessage } from "@hyv/core";
import { Agent, sequence } from "@hyv/core";
import type { GPT4Options } from "@hyv/openai";
import { createInstruction, GPTModelAdapter } from "@hyv/openai";
import type { FilesMessage } from "@hyv/stable-diffusion";
import { Automatic1111ModelAdapter } from "@hyv/stable-diffusion";
import { minify, createFileWriter, writeFile } from "@hyv/utils";
import type { FileContentWithPath, SideEffect } from "@hyv/utils";

/**
 * Creates a file writer for writing output files and add reading time.
 *
 * @param dir - The directory where the output files should be written.
 * @param [encoding="utf-8"] - the encoding that should vbe used when writing files
 * @returns - The file writer instance.
 */
export function createFileWriterWithReadingTime(
	dir: string,
	encoding: BufferEncoding = "utf-8"
): SideEffect<(FileContentWithPath & { readingTime: number })[]> {
	return {
		prop: "files",
		async run(files) {
			await Promise.all(
				files.map(async file =>
					writeFile(
						path.join(dir, file.path),
						`Reading time: ${Math.round(file.readingTime * 10) / 10} minutes\n\n${
							file.content
						}`,
						encoding
					)
				)
			);
		},
	};
}

const dir = `out/auto-stories/${Date.now()}`;
const fileWriter = createFileWriterWithReadingTime(dir);
const imageWriter = createFileWriter(dir, "base64");

const bookAgent = new Agent(
	new GPTModelAdapter<GPT4Options>({
		model: "gpt-4",
		maxTokens: 1024,
		systemInstruction: createInstruction(
			"Competitive Book Agent",
			minify`
			You think deeply.
			You reason your thoughts.
			You reflect on your reasons.
			You make a decision based on your reflection.
			You provide instructions based on your decision.
			`,
			{
				thought: "detailed string",
				reasoning: "detailed string",
				reflection: "detailed string",
				decision: "detailed string",
				instructions: {
					title: "string",
					context: "detailed string",
					genre: "string",
					wordCount: "number",
					coverImage: "boolean",
					imageCount: "number",
					chapterCount: "number",
					maturityRating: "string",
					illustrationStyle: "keywords, comma separated",
				},
			}
		),
	})
);

/**
 * Takes an input Markdown text and converts embedded images into floating images,
 * alternating between left and right alignment.
 * Additionally, it ensures the headings are separated from the images.
 *
 * @param inputText - The input markdown text.
 * @returns - The modified Markdown text with floating images and separated headings.
 */
function makeFloatingImages(inputText: string) {
	let count = 0;
	const markdownImageRegex = /!\[(.*?)]\((.*?)(?:\s+".*?")?\)/g;
	const headingRegex = /^(#{2,6})\s+(.*)$/gm;

	// Replace markdown image syntax with HTML image tags, alternating between left and right alignment
	let replacedText = inputText.replace(markdownImageRegex, (match, alt, src) => {
		const align = ` align="${count % 2 === 0 ? "left" : "right"}"`;
		const imgTag = `<br clear="both"/>\n<img${align} src="${
			src.split(" ")[0]
		}" alt="${alt}" width="256"/>`;
		count++;
		return imgTag;
	});

	// Ensure headings are separated from images by adding line breaks and clearing floating elements
	replacedText = replacedText.replace(
		headingRegex,
		(match, hashes, headingContent) => `<br clear="both"/>\n\n${hashes} ${headingContent}`
	);

	return replacedText;
}

/**
 * Estimates reading time for a text
 * @param text
 */
function getReadingTime(text: string) {
	return text.length / 1_000;
}

/**
 * Estimates reading time for a text
 * @param text
 */
function getWordCount(text: string) {
	return text.split(" ").filter(Boolean).length;
}

const author = new Agent(
	new GPTModelAdapter({
		model: "gpt-4",
		maxTokens: 4096,
		systemInstruction: createInstruction(
			"Author named Morgan Casey Patel",
			minify`\
				You follow instructions closely (especially word count)!
				You think deeply.
				You reason your thoughts.
				You reflect on your reasons.
				You make a decision based on your reflection.
				You write a story and image-instructions based on your decision.
				**Acceptance Criteria**:
				1. Write a UNIQUE bestseller story. words:length(~wordCount), chapters:length(=chapterCount), images:length(=imageCount + =coverImage)!
				2. Write VALID Markdown with IMAGE_TAGS:length(=imageCount + =coverImage)!
				3. Use EXCLUSIVELY \\n for new lines in Markdown!
				4. INLINE all images (as VALID Markdown) **within the story**!
				5. Add a prompt(++illustrationStyle!! ?coverImage) + alt-text for each image.
				6. Add a negativePrompt for each image.
				`,
			{
				thought: "detailed string",
				reasoning: "detailed string",
				reflection: "detailed string",
				decision: "detailed string",
				images: [
					{
						path: "assets/story/[filename].jpg",
						prompt: "vey detailed description + keywords, comma separated",
						negativePrompt: "keywords, comma separated",
						alt: "concise string",
					},
				],
				files: [{ path: "story.md", content: "markdown" }],
			}
		),
	}),
	{
		sideEffects: [fileWriter],
		async before(message: ModelMessage & { instructions: Record<string, unknown> }) {
			return {
				...message,
				instructions: {
					...message.instructions,
					promptDefaults: "absurdres, 4k, 8k, masterpiece",
					negativePromptDefaults: "worst quality, bad quality",
				},
			};
		},
		async after(message: FilesMessage) {
			return {
				...message,
				files: message.files.map(file => ({
					...file,
					readingTime: getReadingTime(file.content),
					words: getWordCount(file.content),
					content: makeFloatingImages(file.content),
				})),
			};
		},
	}
);

const illustrator = new Agent(
	new Automatic1111ModelAdapter({
		seed: Math.floor(Math.random() * 1_000_000) + 1,
	}),
	{
		sideEffects: [imageWriter],
	}
);

try {
	await sequence(
		{
			competitionRules: {
				wordCount: "==1000",
				chapterCount: "==1",
				imageCount: "~3",
				coverImage: "true",
				maturityRating: "rating (e.g. pg, pg-13)",
			},
		},
		[bookAgent, author, illustrator]
	);
	console.log("Done");
} catch (error) {
	console.error("Error:", error);
}
