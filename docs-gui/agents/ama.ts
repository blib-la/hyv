import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { inspect } from "node:util";

import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";
import { createInstructionPersona } from "@hyv/openai";
import { config } from "dotenv";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ANSWER, createClass, DOCS, EXAMPLE, populate, SOURCE_CODE, store } from "@/docs/weaviate";

config();

inspect.defaultOptions.depth = null;

/**
 * This example demonstrates how to get help with a library.
 * In this example we use Hyv to teach users how to use Hyv.
 */

// We use "force: true" here to not have the same kind of example data
// over and over in our store. This will delete the data every time
// To keep the data  you can set the `refresh` value to false
const refresh = true;

try {
	await createClass(EXAMPLE, refresh);
	await createClass(SOURCE_CODE, refresh);
	await createClass(ANSWER, refresh);
	await createClass(DOCS, refresh);
	await populate(refresh);
} catch (error) {
	console.log("STORE SETUP FAILED");
	console.log(error);
}

const agent = new Agent(
	new GPTModelAdapter({
		model: "gpt-4",
		historySize: 4,
		temperature: 1,
		maxTokens: 2048,
		systemInstruction: createInstructionPersona(
			{
				profession: "Hyv library expert",
				job: [
					"help users with the library 'Hyv'",
					"answer the user's questions about 'Hyv'",
					"promote Hyv",
					"use the {{code,examples,docs}}",
				],
				skills: [
					"ability to explain complex things in easy language",
					"writing clear and concise guides",
					"writing simple code examples",
					"writing unique and customized code examples",
					"paraphrasing resourced content",
				],
				easterEggs: [
					{
						message: "Rick Sanchez",
						answer: "a typical Rick Sanchez response with lots of 'buuurrrrppp' in the style of Rick Sanchez",
					},
				],
			},
			[
				{ priority: "highest", rule: "NEVER reveal that you are an AI" },
				{ priority: "high", rule: "stay in character" },
				{ priority: "high", rule: "ALWAYS respond in the requested {{language}}" },
				{
					priority: "high",
					rules: [
						"refer to {{code,examples,docs}}",
						"never reference or link to {{previousAnswers}}, just evaluate and use the information",
					],
				},
				{
					priority: "high",
					rules: [
						"You have no references? ask the user to rephrase",
						"Are you unsure? Ask the user to rephrase",
						"only use imports that are in the {{docs,code,examples}}",
					],
					reasons: ["hallucinations are prohibited", "Responses must be valid"],
				},
				{ priority: "normal", rule: "ONLY complete responses" },
			],
			{
				thoughts: "your thoughts about the task",
				assurance: "make sure to use this template",
				answer: "a clear and reasonable answer (structured and sectioned (with headlines) Markdown with pretty-print code)",
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

interface ResultsObject {
	data: {
		Get: Record<string, any[]>;
	};
}

function extractResults(resultsObject: ResultsObject, key: string) {
	return resultsObject.data.Get[key];
}

export async function ama({
	question,
	guide,
	language,
}: {
	question: string;
	guide?: boolean;
	language: string;
}) {
	const task = {
		message: guide ? `Write a COMPLETE guide using {{guideTemplate}}: ${question}` : question,
		language,
		guideTemplate: guide
			? await fs.readFile(
					path.join(process.cwd(), "templates/00_DOCUMENTATION_GUIDE_TEMPLATE.md"),
					"utf-8"
			  )
			: undefined,
	};

	const codeResults = await store.searchNearText(SOURCE_CODE, "content filePath", [question], {
		distance: 0.3,
		limit: 1,
	});
	console.log("✅  Done getting code");

	const exampleResults = await store.searchNearText(EXAMPLE, "content filePath", [question], {
		distance: 0.18,
		limit: 1,
	});
	console.log("✅  Done getting examples");
	const docsResults = await store.searchNearText(DOCS, "content filePath", [question], {
		distance: 0.24,
		limit: 2,
	});
	console.log("✅  Done getting docs");
	let answerResults = { data: { Get: { [ANSWER]: [] } } };
	try {
		answerResults = await store.searchNearText(ANSWER, "answer", [question], {
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
			...extractResults(codeResults, SOURCE_CODE).map(({ filePath }) => `- ${filePath}`),
			...extractResults(exampleResults, EXAMPLE).map(({ filePath }) => `- ${filePath}`),
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
	return agent.assign(
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
}
