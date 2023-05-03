import { Agent } from "../packages/core/src/agent.js";
import type { ModelMessage } from "../packages/core/src/types.js";
import { createInstruction, getResult, sprint } from "../packages/core/src/utils.js";
import { GPTModelAdapter } from "../packages/openai/src/gpt-model-adapter.js";
import type { GPT4Options } from "../packages/openai/src/types.js";
import { createFileWriter, FSAdapter } from "../packages/store/src/index.js";

import { openai } from "./config.js";

const dir = "out/dev-team";
const store = new FSAdapter(dir);

const fileWriter = createFileWriter(dir);

const pmAgent = new Agent(
	new GPTModelAdapter<GPT4Options>(
		{
			model: "gpt-4",
			temperature: 0.7,
			maxTokens: 2048,
			historySize: 1,
			systemInstruction: createInstruction(
				"Project Manager, A11y expert",
				"create a small user story, provide a very detailed cucumber feature (Feature,Background?,Scenario(Given?When,Then))",
				{
					feature: "string",
					userStory: "As as User, I want …, so that …",
					cucumber: "string",
				}
			),
		},
		openai
	),
	store
);

const testAgent = new Agent(
	new GPTModelAdapter<GPT4Options>(
		{
			model: "gpt-4",
			temperature: 0.2,
			maxTokens: 2048,
			historySize: 2,
			systemInstruction: createInstruction(
				"Full Stack Test Engineer",
				"write cypress step-definitions for cucumber and feature files, use data-test-id, use valid TypeScript",
				{
					dependencies: "string[]",
					files: [{ path: "string", content: "string" }],
				}
			),
		},
		openai
	),
	store,
	{ tools: [fileWriter] }
);

const devAgent = new Agent(
	new GPTModelAdapter<GPT4Options>(
		{
			model: "gpt-4",
			temperature: 0.2,
			maxTokens: 2048,
			historySize: 2,
			systemInstruction: createInstruction(
				"Full Stack Developer",
				"satisfy the tests with a react component, use valid TypeScript",
				{
					dependencies: "string[]",
					files: [{ path: "string", content: "string" }],
				}
			),
		},
		openai
	),
	store,
	{ tools: [fileWriter] }
);

export interface ReviewMessage extends ModelMessage {
	message: string;
	approved: boolean;
	changesRequest: boolean;
	comments: { line: number; column: number; comment: string }[];
}

const reviewAgent = new Agent(
	new GPTModelAdapter<GPT4Options>(
		{
			model: "gpt-4",
			temperature: 0.7,
			maxTokens: 2048,
			historySize: 1,
			systemInstruction: createInstruction(
				"Full Stack Code Reviewer, A11y expert",
				"review code, be precise and very critical",
				{
					message: "string",
					approved: "boolean",
					changes: [
						{ path: "string", line: "number", column: "number", comment: "string" },
					],
				}
			),
		},
		openai
	),
	store,
	{
		async finally(messageId, message: ReviewMessage) {
			return message.approved
				? messageId
				: getResult(await getResult(messageId, devAgent), reviewAgent);
		},
	}
);

// Example Process

const message: ModelMessage & { feature: string } = {
	feature: "Counter Component",
};

try {
	const messageId = await store.set(message);
	await sprint(messageId, [pmAgent, testAgent, devAgent]);
	console.log("Done");
} catch (error) {
	console.error("Error:", error);
}
