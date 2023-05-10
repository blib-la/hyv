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
		winner: "name of story",
	}
);

const finalJury = new Agent(
	new GPTModelAdapter({ model: "gpt-4", maxTokens: 1024, systemInstruction: systemInstruction2 }),
	{
		verbosity: 2,
	}
);

async function doAndGetResult(task: ModelMessage, systemInstruction: string) {
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
	return memoryStore.get(resultId);
}

try {
	const mainTask = { task: "Write a fun story for a competition" };

	const stories = (await Promise.all(
		Array.from(
			{ length: 2 },
			async () => (await doAndGetResult(mainTask, systemInstruction)).story
		)
	)) as FileContentWithPath[];

	const juryTask = {
		task: "Read the stories and pick a winner",
		stories,
	};
	console.log("juryTask", juryTask);

	const votes = (await Promise.all(
		Array.from(
			{ length: 3 },
			async () => (await doAndGetResult(juryTask, systemInstruction2)).winner
		)
	)) as FileContentWithPath[];

	const resultTask = {
		task: "Count the votes and determine the winner",
		votes,
	};
	console.log("resultTask", resultTask);

	const winnerId = await memoryStore.set(resultTask);
	const resultWinnerId = await finalJury.do(winnerId);
	const resultWinner = await memoryStore.get(resultWinnerId);

	console.log("resultWinner", resultWinner);
} catch (error) {
	console.error("Error:", error);
}
