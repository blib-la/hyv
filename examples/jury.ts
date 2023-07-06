import type { AgentOptions, ModelMessage } from "@hyv/core";
import { Agent } from "@hyv/core";
import { createInstruction, GPTModelAdapter } from "@hyv/openai";
import type { FileContentWithPath } from "@hyv/utils";
import { minify } from "@hyv/utils";

const authorInstruction = createInstruction(
	"Author, Competitor",
	minify`
	Do tasks. Respect rules and rating criteria.
	Think deeply, reason your thoughts, decide based on your reasoning.
	`,
	{
		thoughts: "deep thoughts",
		reason: "critical reasoning",
		decision: "detailed decision",
		story: {
			name: "name of story",
			content: "the story …",
		},
	}
);

const juryInstruction = createInstruction(
	"Competition Jury",
	minify`
	Do tasks. Respect rules and rating criteria.
	Think deeply, reason your thoughts, decide based on your reasoning.
	`,
	{
		thoughts: "deep thoughts",
		reason: "critical reasoning",
		decision: "detailed decision",
		winner: "name of story",
	}
);

/**
 * Gets the word count for a text
 * @param text
 */
function getWordCount(text: string) {
	return text.split(" ").filter(Boolean).length;
}

const finalJury = new Agent(
	new GPTModelAdapter({
		model: "gpt-4",
		maxTokens: 1024,
		format: "json",
		systemInstruction: juryInstruction,
	}),
	{
		verbosity: 1,
	}
);

async function createAndAssign<T>(
	task: ModelMessage,
	systemInstruction: string,
	options: AgentOptions = {}
) {
	return (await new Agent(
		new GPTModelAdapter({
			model: "gpt-4",
			maxTokens: 1024,
			temperature: 0.9,
			format: "json",
			systemInstruction,
		}),
		{
			verbosity: 1,
			...options,
		}
	).assign(task)) as { id: string; message: ModelMessage & T };
}

const rules = ["minimum 300 words long", "must be unique and original"];
const ratingCriteria = ["unique story", "detail", "engaging"];

try {
	const stories = (await Promise.all(
		Array.from(
			{ length: 3 },
			async () =>
				(
					await createAndAssign(
						{ task: "Write a UNIQUE story for a competition", rules, ratingCriteria },
						authorInstruction,
						{
							async after(
								message: ModelMessage & { story: { name: string; content: string } }
							): Promise<
								ModelMessage & {
									story: { name: string; content: string; wordCount: number };
								}
							> {
								return {
									...message,
									story: {
										...message.story,
										wordCount: getWordCount(message.story.content),
									},
								};
							},
						}
					)
				).message.story
		)
	)) as FileContentWithPath[];

	const votes = (await Promise.all(
		Array.from(
			{ length: 3 },
			async () =>
				(
					await createAndAssign(
						{
							task: "Read the stories and pick a winner",
							rules,
							ratingCriteria,
							stories,
						},
						juryInstruction
					)
				).message.winner
		)
	)) as FileContentWithPath[];

	await finalJury.assign({
		task: "Count the votes and determine the winner",
		votes,
	});
} catch (error) {
	console.error("Error:", error);
}
