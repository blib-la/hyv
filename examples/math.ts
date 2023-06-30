import { Agent } from "@hyv/core";
import { createInstructionTemplate, GPTModelAdapter } from "@hyv/openai";

const mathModel = new GPTModelAdapter({
	model: "gpt-4",
	systemInstruction: createInstructionTemplate(
		"Mathematician",
		"think about the problem, reason your thoughts, solve the problems step by step",
		{
			thought: "detailed string",
			reason: "detailed string",
			steps: ["detailed calculation step"],
			solution: "concise answer",
		}
	),
});

const mathAgent = new Agent(mathModel, { verbosity: 1 });

try {
	const answer = await mathAgent.assign({ problem: "(10 * 4 + 2) / (10 * 2 + 11 * 2) = x" });
	console.log(answer.message);
} catch (error) {
	console.error("Error:", error);
}
