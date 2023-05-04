import { Agent, createFileWriter, createInstruction, minify, sequence } from "@hyv/core";
import { DallEModelAdapter, GPTModelAdapter } from "@hyv/openai";
import slugify from "@sindresorhus/slugify";

const title = "Greg the Hero";
const genre = "Adventure";
const illustrationStyle = "flat";
const context = "Greg writes the best AI libraries";

const dir = `out/stories/${slugify(title)}`;
const fileWriter = createFileWriter(dir);
const imageWriter = createFileWriter(dir, "base64");

const author = new Agent(
	new GPTModelAdapter({
		model: "gpt-4",
	}),
	{
		sideEffects: [fileWriter],
	}
);

const illustrator = new Agent(new DallEModelAdapter(), { sideEffects: [imageWriter] });

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
	return text.split(" ").length;
}

// Give the agent some tools
author.after = async message => ({
	...message,
	files: message.files.map(file => ({
		...file,
		readingTime: getReadingTime(file.content),
		words: getWordCount(file.content),
	})),
});

// Adjust the agent's model
author.model.maxTokens = 1024;
author.model.systemInstruction = createInstruction(
	"Author",
	minify`
				1. Write a long("approximateWordCount") story!
				2. Write a VALID Markdown document WITH IMAGE TAGS and SHORT alt text!
				3. INLINE all images (as VALID Markdown) **within the story**!
				4. All images should be LOCAL FILES!
				5. Add a DETAILED, CLEAR, DESCRIPTIVE prompt("illustrationStyle") for each image to be generated.
				`,
	{
		images: [{ path: "path/to/file.jpg", prompt: "string" }],
		files: [{ path: "story.md", content: "Markdown" }],
	}
);

try {
	await sequence(
		{
			title,
			context,
			genre,
			approximateWordCount: 100,
			imageCount: 2,
			chapterCount: 2,
			illustrationStyle,
		},
		[author, illustrator]
	);
} catch (error) {
	console.error("Error:", error);
}
