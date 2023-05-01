import { Agent } from "../src/index.js";
import { GPTModelAdapter } from "../src/openai/index.js";
import type { GPT4Options } from "../src/openai/types.js";
import { createFileWriter, FSAdapter } from "../src/store/index.js";
import type { ModelMessage } from "../src/types.js";
import { createInstruction, getResult, sprint } from "../src/utils.js";

const dir = "out/dev-team";
const store = new FSAdapter(dir);

const fileWriter = createFileWriter(dir);

const pmAgent = new Agent(
	new GPTModelAdapter<GPT4Options>({
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
	}),
	store
);

const testAgent = new Agent(
	new GPTModelAdapter<GPT4Options>({
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
	}),
	store,
	[fileWriter]
);

const devAgent = new Agent(
	new GPTModelAdapter<GPT4Options>({
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
	}),
	store,
	[fileWriter]
);

export interface ReviewMessage extends ModelMessage {
	message: string;
	approved: boolean;
	changesRequest: boolean;
	comments: { line: number; column: number; comment: string }[];
}

const reviewAgent = new Agent(
	new GPTModelAdapter<GPT4Options>({
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
				changes: [{ path: "string", line: "number", column: "number", comment: "string" }],
			}
		),
		async next(messageId, data: ReviewMessage) {
			return data.approved
				? messageId
				: getResult(await getResult(messageId, devAgent), reviewAgent);
		},
	}),
	store
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
