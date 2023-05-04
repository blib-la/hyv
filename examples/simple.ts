import { Agent, sequence } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";

const agent = new Agent(new GPTModelAdapter());

try {
	await sequence({ question: "What is life?" }, [agent]);
} catch (error) {
	console.error("Error:", error);
}
