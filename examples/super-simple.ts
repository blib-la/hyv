import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";

const agent = new Agent(new GPTModelAdapter());

try {
	const answer = await agent.assign({ question: "What is time?" });
	console.log(answer.message);
} catch (error) {
	console.error("Error:", error);
}
