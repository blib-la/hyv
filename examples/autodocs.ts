import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import readline from "readline";

import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";
import { createInstructionPersona } from "@hyv/openai/utils";
import { WeaviateAdapter } from "@hyv/store";
import { config } from "dotenv";
import { globby } from "globby";
import { ApiKey } from "weaviate-ts-client";

config();

/**
 * This example demonstrates how to get help with a library.
 * In this example we use Hyv to teach users how to use Hyv.
 */

const store = new WeaviateAdapter({
	scheme: "https",
	host: process.env.WEAVIATE_HOST,
	apiKey: new ApiKey(process.env.WEAVIATE_API_KEY),
	headers: { "X-OpenAI-Api-Key": process.env.OPENAI_API_KEY },
});
const ANSWER = "Answer";
const EXAMPLE = "Example";
const DOCS = "Docs";
const SOURCE_CODE = "SourceCode";
const refresh = true;

// We use "force: true" here to not have the same kind of example data
// over and over in our store. This will delete the data every time
try {
	await store.createClass(
		{
			class: EXAMPLE,
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
			class: SOURCE_CODE,
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
			class: DOCS,
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
} catch (error) {
	console.log("STORE SETUP FAILED");
	console.log(error);
}

const agent = new Agent(
	new GPTModelAdapter({
		model: "gpt-4",
		historySize: 2,
		systemInstruction: createInstructionPersona(
			{
				profession: "TypeScript expert",
				job: [
					"help users with the library 'Hyv'",
					"answer the user's questions about 'Hyv'",
					"promote 'Hyv'",
					"use the {{hyv.code}}, {{hyv.examples}} and {{hyv.docs}}",
				],
				skills: [
					"ability to explain complex things in easy language",
					"writing clear and concise documentation",
					"writing simple code examples",
				],
			},
			[
				{ priority: "high", rule: "stay in character" },
				{ priority: "highest", rule: "never reveal that you are an AI" },
				{ priority: "normal", rule: "always {{answer}} natural" },
				{ priority: "normal", rule: "always keep {{answer}} concise" },
				{ priority: "normal", rule: "always keep {{answer}} original and unique" },
				{ priority: "high", rule: "never repeat yourself" },
				{
					priority: "high",
					rule: "refer to {{hyv.code}}, {{hyv.examples}} and {{hyv.docs}}",
				},
			],
			{
				thoughts: "your thoughts in concise comma separated list",
				assurance: "make sure to stay in character",
				answer: "a clear and concise answer",
			}
		),
	}),
	{
		store,
		verbosity: 1,
	}
);
if (refresh) {
	const examples = await globby([path.join(process.cwd(), "examples/*.ts")]);
	await Promise.all(
		examples.map(async filePath => {
			const content = await fs.readFile(filePath, "utf-8");
			const relativePath = filePath.replace(process.cwd(), "");
			return store.set({ content, filePath: relativePath }, EXAMPLE);
		})
	);

	const sourceCode = await globby([
		path.join(process.cwd(), "packages/**/*.ts"),
		"!packages/**dist/*",
	]);
	await Promise.all(
		sourceCode.map(async filePath => {
			const content = await fs.readFile(filePath, "utf-8");
			const relativePath = filePath.replace(process.cwd(), "");
			return store.set({ content, filePath: relativePath }, SOURCE_CODE);
		})
	);

	const docs = await globby([
		path.join(process.cwd(), "docs/**/*.md"),
		path.join(process.cwd(), "docs/*.md"),
		path.join(process.cwd(), "README.md"),
	]);
	await Promise.all(
		docs.map(async filePath => {
			const content = await fs.readFile(filePath, "utf-8");
			const relativePath = filePath.replace(process.cwd(), "");
			return store.set({ content, filePath: relativePath }, DOCS);
		})
	);
}

// Using readline to get user input
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const chat = async () => {
	rl.question("> ", async userInput => {
		const message = {
			message: userInput,
		};

		try {
			const codeResults = await store.searchNearText(
				SOURCE_CODE,
				"content filePath",
				[userInput],
				{
					distance: 0.2,
					limit: 2,
				}
			);
			const exampleResults = await store.searchNearText(
				EXAMPLE,
				"content filePath",
				[userInput],
				{
					distance: 0.25,
					limit: 2,
				}
			);
			const docsResults = await store.searchNearText(DOCS, "content filePath", [userInput], {
				distance: 0.25,
				limit: 2,
			});

			console.log("\n--- Resources used ---\n");
			console.log(
				codeResults.data.Get[SOURCE_CODE].map(({ filePath }) => `- ${filePath}`).join("\n")
			);
			console.log(
				exampleResults.data.Get[EXAMPLE].map(({ filePath }) => `- ${filePath}`).join("\n")
			);
			console.log(
				docsResults.data.Get[DOCS].map(({ filePath }) => `- ${filePath}`).join("\n")
			);

			await agent.assign(
				{
					...message,
					hyv: {
						github: "https://github.com/failfa-st/hyv",
						code: codeResults.data.Get[SOURCE_CODE],
						examples: exampleResults.data.Get[EXAMPLE],
						docs: docsResults.data.Get[DOCS],
					},
				},
				ANSWER
			);
		} catch (error) {
			try {
				await agent.assign(
					{
						...message,
						hyv: {
							github: "https://github.com/failfa-st/hyv",
							code: [],
							examples: [],
							docs: [],
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
