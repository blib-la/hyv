import { Agent } from "@hyv/core";
import { createInstruction, GPTModelAdapter } from "@hyv/openai";

const mathModel = new GPTModelAdapter({
	systemInstruction: createInstruction(
		"Mathematician",
		"think about the problem, reason your thoughts, solve the problems step by step",
		{
			thought: "detailed string",
			reason: "detailed string",
			steps: ["step"],
			solution: "concise answer",
		}
	),
});

const mathAgent = new Agent(mathModel);

try {
	const answer = await mathAgent.assign({ problem: "(10 * 4 + 2) / (10 * 2 + 11 * 2) = ?" });
	console.log(answer.message);
} catch (error) {
	console.error("Error:", error);
}
