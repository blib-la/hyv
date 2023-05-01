// Shared Store for all agents
import { GPTModelAdapter } from "../src/gpt/index.js";
import type { GPT4Options } from "../src/gpt/types.js";
import { Agent } from "../src/hive.js";
import { FSAdapter } from "../src/store/index.js";
import type { ModelMessage, Tool } from "../src/types.js";
import { createInstruction, getResult } from "../src/utils.js";

const sharedStore = new FSAdapter("shared_storage");

// Agent 1
const agent1Options: GPT4Options = {
	model: "gpt-4",
	temperature: 0.5,
	maxTokens: 50,
	historySize: 1,
	systemInstruction: createInstruction("AI", "Translate English text to French.", {
		translation: "",
	}),
};

const agent1Model = new GPTModelAdapter(agent1Options);

const agent1 = new Agent(agent1Model, sharedStore);

// Agent 2
const agent2Options: GPT4Options = {
	model: "gpt-4",
	temperature: 0.5,
	maxTokens: 50,
	historySize: 1,
	systemInstruction: createInstruction("AI", "Summarize the translated text.", { summary: "" }),
};

const agent2Model = new GPTModelAdapter(agent2Options);

// Tool for Agent 2
const loggingTool: Tool = {
	prop: "summary",
	async run(message) {
		console.log("Agent 2 Message Content:", message);
	},
};

const agent2 = new Agent(agent2Model, sharedStore, [loggingTool]);

// Agent 3
const agent3Options: GPT4Options = {
	model: "gpt-4",
	temperature: 0.5,
	maxTokens: 50,
	historySize: 1,
	systemInstruction: createInstruction("AI", "Paraphrase the summarized text.", {
		paraphrase: "",
	}),
};

const agent3Model = new GPTModelAdapter(agent3Options);

const agent3 = new Agent(agent3Model, sharedStore);

// Example Process
// Task for Agent 1
const agent1Task: ModelMessage & { translation: string } = {
	translation:
		"Hello, my name is Hive. I am a AI Agent colony. I can create things using multiple agents with unique skills and responsibilities",
};

const agent1MessageId = await sharedStore.set(agent1Task);

// Execute tasks in sequence, passing the output (messageId) from one agent to the next
getResult(agent1MessageId, agent1)
	.then(messageId => getResult(messageId, agent2))
	.then(messageId => getResult(messageId, agent3))
	.then(result => {
		console.log("Final Result:", result);
	})
	.catch(error => {
		console.error("Error:", error);
	});
