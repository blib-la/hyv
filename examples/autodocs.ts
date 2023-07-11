import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { inspect } from "node:util";
import readline from "readline";

import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";
import { createInstructionPersona } from "@hyv/openai/utils";
import { WeaviateAdapter } from "@hyv/store";
import { config } from "dotenv";
import { globby } from "globby";
import { ApiKey } from "weaviate-ts-client";

config();

inspect.defaultOptions.depth = null;

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

// We use "force: true" here to not have the same kind of example data
// over and over in our store. This will delete the data every time
// To keep the data  you can set the `refresh` value to false
const refresh = true;

async function createClass(className) {
	await store.createClass(
		{
			class: className,
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
}

try {
	await createClass(EXAMPLE);
	await createClass(SOURCE_CODE);
	await createClass(ANSWER);
	await createClass(DOCS);
} catch (error) {
	console.log("STORE SETUP FAILED");
	console.log(error);
}

function pathFromRoot(filePath: string) {
	return path.join(process.cwd(), filePath);
}

const agent = new Agent(
	new GPTModelAdapter({
		model: "gpt-4",
		historySize: 3,
		temperature: 1,
		maxTokens: 2048,
		systemInstruction: createInstructionPersona(
			{
				profession: "TypeScript expert",
				job: [
					"help users with the library 'Hyv'",
					"answer the user's questions about 'Hyv'",
					"promote 'Hyv'",
					"use the {{code,examples,docs,previousAnswers}}",
				],
				skills: [
					"ability to explain complex things in easy language",
					"writing clear and concise documentation",
					"writing simple code examples",
				],
				outputFormat: ["always responds in valid JSON that can be parsed"],
			},
			[
				{ priority: "highest", rule: "NEVER reveal that you are an AI" },
				{ priority: "high", rule: "stay in character" },
				{
					priority: "high",
					rule: "refer to {{code,examples,docs,previousAnswers}}",
				},
				{
					priority: "high",
					rules: [
						"You have no references? ask the user to rephrase",
						"Are you unsure? Ask the user to rephrase",
					],
					reasons: ["hallucinations are prohibited", "Responses must be valid"],
				},
				{ priority: "normal", rule: "ONLY complete responses" },
			],
			{
				thoughts: "your thoughts about the task",
				assurance: "make sure to use this template",
				answer: "a clear and reasonable answer (valid Markdown/GFM)",
			},
			{ format: "json" }
		),
	}),
	{
		// We add the store here so that all answers are vectorized
		store,
		verbosity: 1,
	}
);

// If we want to refresh (force) the new dataset, we need to populate the vector store
if (refresh) {
	// Get al related documents
	const docs = await globby(
		[
			pathFromRoot("docs/**/*.md"),
			pathFromRoot("docs/*.md"),
			pathFromRoot("README.md"),
			`!${pathFromRoot("docs/00_DOCUMENTATION_GUIDE_TEMPLATE.md")}`,
		],
		{ gitignore: true }
	);

	const examples = await globby([pathFromRoot("examples/*.ts")], { gitignore: true });

	const sourceCode = await globby(
		[
			pathFromRoot("package.json"),
			pathFromRoot("**/package.json"),
			pathFromRoot("packages/**/*.ts"),
			`!${pathFromRoot("packages/*/dist")}`,
		],
		{ ignoreFiles: ["*.d.ts", "*.js"], gitignore: true }
	);

	await Promise.all([
		...docs.map(async filePath => {
			const content = await fs.readFile(filePath, "utf-8");
			const relativePath = filePath.replace(process.cwd(), "");
			return store.set({ content, filePath: relativePath }, "Docs");
		}),
		...examples.map(async filePath => {
			const content = await fs.readFile(filePath, "utf-8");
			const relativePath = filePath.replace(process.cwd(), "");
			return store.set({ content, filePath: relativePath }, "Example");
		}),
		...sourceCode.map(async filePath => {
			const content = await fs.readFile(filePath, "utf-8");
			const relativePath = filePath.replace(process.cwd(), "");
			return store.set({ content, filePath: relativePath }, "SourceCode");
		}),
	]);
}

// Using readline to get user input
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

interface ResultsObject {
	data: {
		Get: Record<string, any[]>;
	};
}

function extractResults(resultsObject: ResultsObject, key: string) {
	return resultsObject.data.Get[key];
}

const chat = async () => {
	rl.question("> ", async userInput => {
		const task = {
			message: userInput.replace(
				/^GUIDE:/,
				"Write a COMPLETE guide using {{guideTemplate}}:"
			),
			guideTemplate: userInput.startsWith("GUIDE:")
				? await fs.readFile(
						pathFromRoot("docs/00_DOCUMENTATION_GUIDE_TEMPLATE.md"),
						"utf-8"
				  )
				: undefined,
		};

		console.log(task);

		try {
			const codeResults = await store.searchNearText(
				SOURCE_CODE,
				"content filePath",
				[userInput],
				{
					distance: 0.3,
					limit: 1,
				}
			);
			console.log("✅  Done getting code");

			const exampleResults = await store.searchNearText(
				EXAMPLE,
				"content filePath",
				[userInput],
				{
					distance: 0.18,
					limit: 1,
				}
			);
			console.log("✅  Done getting examples");
			const docsResults = await store.searchNearText(DOCS, "content filePath", [userInput], {
				distance: 0.24,
				limit: 2,
			});
			console.log("✅  Done getting docs");
			let answerResults = { data: { Get: { [ANSWER]: [] } } };
			try {
				answerResults = await store.searchNearText(ANSWER, "answer", [userInput], {
					distance: 0.24,
					limit: 1,
				});
				console.log("✅  Done getting answers");
			} catch (error) {
				console.log("⚠️ No answers set");
			}

			console.log("\n    Resources used:\n");
			console.log(
				[
					...extractResults(codeResults, SOURCE_CODE).map(
						({ filePath }) => `- ${filePath}`
					),
					...extractResults(exampleResults, EXAMPLE).map(
						({ filePath }) => `- ${filePath}`
					),
					...extractResults(docsResults, DOCS).map(({ filePath }) => `- ${filePath}`),
				]
					.filter(Boolean)
					.join("\n")
			);

			console.log(`\n    ${extractResults(answerResults, ANSWER).length} answers used.\n`);

			agent.after = async message => ({
				...message,
				// We want to add the original question to allow finding his solution if the same or
				// similar question is asked.
				originalQuestion: task.message,
			});
			console.log("Adjusted the after method");
			await agent.assign(
				{
					...task,
					previousAnswers: extractResults(answerResults, ANSWER),
					hyv: {
						github: "https://github.com/failfa-st/hyv",
						code: extractResults(codeResults, SOURCE_CODE),
						examples: extractResults(exampleResults, EXAMPLE),
						docs: extractResults(docsResults, DOCS),
					},
					npm: "@hyv/*",
				},
				ANSWER
			);
		} catch (error) {
			console.log("Something broke, here's the error that caused the issue:\n\n");
			console.log(error);
		}

		// Continue the chat by calling the function again
		// this will create an infinite chat
		await chat();
	});
};

// Start the chat
await chat();
