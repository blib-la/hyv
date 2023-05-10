import type { ModelMessage } from "@hyv/core";
import { Agent, memoryStore } from "@hyv/core";
import { createInstruction, GPTModelAdapter } from "@hyv/openai";
import type { FileContentWithPath } from "@hyv/utils";
import { minify } from "@hyv/utils";
const systemInstruction = createInstruction(
	"Author",
	minify`
	Do tasks.
	think, reason, decide.
	`,
	{
		thoughts: "your thoughts",
		reason: "your reasoning",
		decision: "your decision",
		story: {
			name: "name of story",
			content: "the story …",
		},
	}
);

const systemInstruction2 = createInstruction(
	"Competition Jury",
	minify`
	Do tasks.
	think, reason, decide.
	`,
	{
		thoughts: "your thoughts",
		reason: "your reasoning",
		decision: "your decision",
		winnerStory: "name of story",
	}
);

const agent3 = new Agent(
	new GPTModelAdapter({ model: "gpt-4", maxTokens: 1024, systemInstruction: systemInstruction2 }),
	{
		verbosity: 2,
	}
);

async function doAndGetResult(task: ModelMessage) {
	const agent = new Agent(
		new GPTModelAdapter({
			model: "gpt-4",
			maxTokens: 1024,
			systemInstruction,
		}),
		{
			verbosity: 2,
		}
	);
	const taskId = await memoryStore.set(task);
	const resultId = await agent.do(taskId);
	return (await memoryStore.get(resultId)).story;
}

try {
	const mainTask = { task: "Write a fun story for a competition" };

	const stories = (await Promise.all(
		Array.from({ length: 2 }, async () => doAndGetResult(mainTask))
	)) as FileContentWithPath[];

	const mergeTask = {
		task: "Read the stories and pick a winner",
		stories,
	};

	console.log("mergedResults", mergeTask);

	const task3Id = await memoryStore.set(mergeTask);
	const result3Id = await agent3.do(task3Id);
	const result3 = await memoryStore.get(result3Id);

	console.log("result3", result3);
} catch (error) {
	console.error("Error:", error);
}
