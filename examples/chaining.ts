import type { ModelMessage } from "@hyv/core";
import { Agent, sequence } from "@hyv/core";
import { createInstruction, GPTModelAdapter } from "@hyv/openai";
import { minify } from "@hyv/utils";

const systemInstruction = createInstruction(
	"AI",
	minify`
	You have deep thoughts,
	reason your thoughts,
	reflect your reasoning,
	debate your reflection,
	decide base on your debate.
	You then create a new task based on your decision!
	`,
	{
		mainGoal: "={{mainGoal}}",
		thoughts: "detailed string",
		reasoning: "detailed string",
		reflection: "detailed string",
		debate: "detailed string",
		decision: "detailed string",
		task: "full and detailed task without references",
	}
);

async function before({ task, mainGoal }: ModelMessage) {
	return {
		task,
		mainGoal,
	};
}

const agents = Array.from(
	{ length: 3 },
	() =>
		new Agent(new GPTModelAdapter({ model: "gpt-4", systemInstruction }), {
			before,
			verbosity: 1,
		})
);

try {
	await sequence(
		{ task: "Make the world a better place!", mainGoal: "Make the world a better place!" },
		agents
	);
} catch (error) {
	console.error("Error:", error);
}
