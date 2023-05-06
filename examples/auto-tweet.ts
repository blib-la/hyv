import type { ModelMessage } from "@hyv/core";
import { Agent, createInstruction, minify, sequence, createFileWriter } from "@hyv/core";
import type { GPT4Options } from "@hyv/openai";
import { GPTModelAdapter } from "@hyv/openai";
import { Automatic1111ModelAdapter } from "@hyv/stable-diffusion";

const dir = `out/auto-tweet/${Date.now()}`;
const fileWriter = createFileWriter(dir);
const imageWriter = createFileWriter(dir, "base64");

const bookAgent = new Agent(
	new GPTModelAdapter<GPT4Options>({
		model: "gpt-4",
		maxTokens: 1024,
		temperature: 0.7,
		systemInstruction: createInstruction(
			"mastermind, random term creator, very funny, hilarious",
			minify`
			Think deeply.
			Reason your thoughts.
			Reflect on your reasons.
			Provide several ideas based on your reasons.
			Decide on ONE of your your ideas.
			Provide two absolutely random, uncommon and unrelated terms and pair them in a **RIDICULOUS comparison**.
			NEVER use terms from the {{example}}!
			`,
			{
				thought: "very detailed elaborative string",
				reasoning: "very detailed elaborative string",
				reflection: "very detailed elaborative string",
				ideas: ["{{comparison}}"],
				decision: "very detailed elaborative string",
				instructions: {
					term1: "one word",
					term2: "one word",
					comparator: "is * than",
					comparison: "{{term1}} {{comparator}} {{term2}}",
				},
			}
		),
	})
);

const author = new Agent(
	new GPTModelAdapter<GPT4Options>({
		model: "gpt-4",
		maxTokens: 1024,
		systemInstruction: createInstruction(
			"Comedic Writer, Twitter trend expert",
			minify`\
				Follow instructions closely!
				Think deeply.
				Reason your thoughts.
				Reflect on your reasons.
				Make a decision based on your reflection.
				Write a tweet with hashtags and emojis.
				Provide meta-data for images, based on your tweet.
				**Acceptance Criteria**:
				1. Write a UNIQUE hilarious tweet WITH characters:length(~{{characterCount}}) AND hashtags:length(~{{hashtagCount}}), emojis:length(~{{emojiCount}}), images:length(={{imageCount}})!
				2. Tweet compares 2 terms and add proof/reason!!
				3. Add a prompt(+{{illustrationStyle}})!
				4. Add a negativePrompt for each image!
				5. Add an alt text for each image!
				`,
			{
				thought: "very detailed elaborative string",
				reasoning: "very detailed elaborative string",
				reflection: "very detailed elaborative string",
				decision: "very detailed elaborative string",
				hashtags: ["string"],
				emojis: ["🤦‍"],
				tweet: "Did you know {(comparison)}, because {{term1}} … {{term2}} ?",
				images: [
					{
						path: "[filename].jpg",
						prompt: "vey detailed description(term1 + term2) + keywords + {{illustrationStyle}}, comma separated",
						negativePrompt: "keywords, comma separated",
						alt: "concise string",
					},
				],
				files: [
					{
						path: "tweet.md",
						content:
							"markdown: ![image.alt](image.path)\n\n # {{tweet}} {{emojis}} {{hashtags}}",
					},
				],
			}
		),
	}),
	{
		sideEffects: [fileWriter],
		async before(message: ModelMessage & { instructions: Record<string, unknown> }) {
			return {
				...message,
				instructions: {
					...message.instructions,
					imageCount: 1,
					characterCount: 250,
					hashtagCount: "<=5",
					emojiCount: "<=3",
					style: "slapstick comedy, dad jokes, fun facts",
					illustrationStyle: "flat illustration, simple shapes, simplified",
				},
			};
		},
	}
);

const illustrator = new Agent(new Automatic1111ModelAdapter(), {
	sideEffects: [imageWriter],
});

try {
	await sequence(
		{
			ideaCount: "2-4",
			example: {
				term1: "pudding",
				term2: "microphone",
				comparator: "is louder than",
				comparison: "pudding is louder than a microphone",
			},
		},
		[bookAgent, author, illustrator]
	);
	console.log("Done");
} catch (error) {
	console.error("Error:", error);
}
