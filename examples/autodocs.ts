import { ANSWER, DOCS, EXAMPLE, SOURCE_CODE, store } from "../docs-gui/weaviate.js";

import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";
import { createInstructionPersona } from "@hyv/openai/utils";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { inspect } from "node:util";
import readline from "readline";
import "../templates/setup-weaviate.js";
/**
 * This example demonstrates how to get help with a library.
 * In this example we use Hyv to teach users how to use Hyv.
 */

inspect.defaultOptions.depth = null;

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
						path.join(process.cwd(), "templates/00_DOCUMENTATION_GUIDE_TEMPLATE.md"),
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
