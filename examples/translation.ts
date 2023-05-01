import { GPTModelAdapter } from "../src/gpt/index.js";
import type { GPT3Options } from "../src/gpt/types.js";
import { Agent } from "../src/hive.js";
import { FSAdapter } from "../src/store/index.js";
import type { ModelMessage, Tool } from "../src/types.js";
import { createInstruction, sprint } from "../src/utils.js";

const sharedStore = new FSAdapter("out/translation");

// Agent 1
const agent1Options: GPT3Options = {
	model: "gpt-3.5-turbo",
	temperature: 0.5,
	maxTokens: 256,
	historySize: 1,
	systemInstruction: createInstruction("AI", "Translate English text to German.", {
		translation: "",
	}),
};

const agent1Model = new GPTModelAdapter(agent1Options);

const agent1 = new Agent(agent1Model, sharedStore);

// Agent 2
const agent2Options: GPT3Options = {
	model: "gpt-3.5-turbo",
	temperature: 0.5,
	maxTokens: 256,
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
const agent3Options: GPT3Options = {
	model: "gpt-3.5-turbo",
	temperature: 0.5,
	maxTokens: 256,
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
		"It is a sunny day and I want to go outside tio have some fun and do some sports. Maybe we can even get an icecream t cool down a little after our workout?",
};

const agent1MessageId = await sharedStore.set(agent1Task);

const chain = [agent1, agent2, agent3];

try {
	await sprint(agent1MessageId, chain);
	console.log("Done");
} catch (error) {
	console.error("Error:", error);
}
