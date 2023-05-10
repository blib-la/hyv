import type { ModelMessage } from "@hyv/core";
import { Agent, memoryStore } from "@hyv/core";
import { createInstruction, GPTModelAdapter } from "@hyv/openai";
import type { FileContentWithPath } from "@hyv/utils";
import { minify } from "@hyv/utils";
const systemInstruction = createInstruction(
	"TypeScript Developer",
	minify`
	Do tasks. Never ask back.
	Provide a TypeScript function and export it as named export.
	Use DECLARATIVE names.
	ONLY VALID and COMPLETE code.
	Use ESNext/ESM with 'import/export'.
	Create TypeScript files with the solution.
	`,
	{
		thoughts: "your thoughts",
		decision: "your decision",
		functionNames: ["string"],
		files: [
			{
				path: "src/[path/to/filename].ts",
				content: "// Valid TypeScript code",
			},
		],
	}
);

const systemInstruction2 = createInstruction(
	"Expert TypeScript Developer, Code Merging expert",
	minify`
	Do tasks.
	Think about the task.
	Find duplicates and analyze.
	Merge files in the best way possible.
	Ensure that no duplicate logic is implemented.
	Ensure the same coding style;
	Use ESNext/ESM with 'import/export'.
	Create TypeScript files with the solution.
	`,
	{
		thoughts: "your thoughts",
		analysis: "your analysis",
		potentialDuplicates: ["string"],
		decision: "your decision",
		files: [
			{
				path: "src/[path/to/filename].ts",
				content: "// Valid TypeScript code",
			},
		],
	}
);

const agent3 = new Agent(
	new GPTModelAdapter({ model: "gpt-4", maxTokens: 4096, systemInstruction: systemInstruction2 }),
	{
		verbosity: 2,
	}
);

async function doAndGetResult(task: ModelMessage) {
	const agent = new Agent(
		new GPTModelAdapter({
			model: "gpt-4",
			maxTokens: 2048,
			systemInstruction,
		}),
		{
			verbosity: 2,
		}
	);
	const taskId = await memoryStore.set(task);
	const resultId = await agent.do(taskId);
	return (await memoryStore.get(resultId)).files;
}

try {
	const mainTask = { task: "Write a simple React todo-list app, be creative" };

	const files = (
		await Promise.all(Array.from({ length: 2 }, async () => doAndGetResult(mainTask)))
	).flat() as FileContentWithPath[];

	const mergeTask = {
		task: "merge the code from the pull requests",
		files: files.map(file => ({
			path: file.path,
			content: minify`${file.content}`,
		})),
	};

	console.log("mergedResults", mergeTask);

	const task3Id = await memoryStore.set(mergeTask);
	const result3Id = await agent3.do(task3Id);
	const result3 = await memoryStore.get(result3Id);

	console.log("result3", result3);
} catch (error) {
	console.error("Error:", error);
}
