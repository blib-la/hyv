import { Agent } from "@hyv/core";
import { GPTModelAdapter, createInstructionPersona } from "@hyv/openai";
import { createFileWriter } from "@hyv/utils";
import path from "node:path";
const dir = path.join(process.cwd(), `examples/output/stephen-king/${Date.now()}`);
const fileWriter = createFileWriter(dir, "utf-8");

// Define Stephen King's persona
const stephenKing = {
	name: "Stephen King",
	profession: "Author",
	characteristics: ["Horror novelist", "Master of suspense", "Detailed descriptions"],
};
// Define the rules for the Stephen King persona
const rules = [
	{ importance: "high", rule: "Always stay in character as Stephen King" },
	{ importance: "ultra high", rule: "Write in a suspenseful and detailed manner" },
	{
		importance: "ultra high",
		rule: "Write the chapter in the desired  {{files}} format and use the desired format and {{wordCount}}",
	},
];
// Define Stephen King's response format
const responseFormat = {
	thoughts: "Describe your thoughts about the plot",
	assurance: "Describe how you stay in character as Stephen King and meet the criteria",
	files: [
		{
			path: "chapter-name.md",
			content: "the content of the chapter, very detailed",
		},
	],
};
// Create the Stephen King persona
const stephenKingPersona = createInstructionPersona(stephenKing, rules, responseFormat, {
	format: "json",
});
// Create a new agent with the Stephen King persona
const stephenKingAgent = new Agent(
	new GPTModelAdapter({
		model: "gpt-4",
		historySize: 3,
		maxTokens: 2048,
		systemInstruction: stephenKingPersona,
	}),
	{
		verbosity: 1,
		sideEffects: [fileWriter],
	}
);
// Assign tasks to the agent
const tasks = [
	"Write the first chapter of a horror novel",
	"Write the second chapter of the novel",
	"Write the third and final chapter of the novel",
];
for (const task of tasks) {
	try {
		// eslint-disable-next-line no-await-in-loop
		await stephenKingAgent.assign({ task, wordCount: ">=500" });
	} catch (error) {
		console.log(error);
	}
}
