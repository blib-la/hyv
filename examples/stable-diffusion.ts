import { Automatic1111ModelAdapter } from "@hyv/stable-diffusion";
import { Agent, createFileWriter, sequence } from "@hyv/utils";

const imageWriter = createFileWriter(`out/stable-diffusion/${Date.now()}`, "base64");

const agent = new Agent(new Automatic1111ModelAdapter({ steps: 20, cfgScale: 7 }), {
	sideEffects: [imageWriter],
});

try {
	await sequence(
		{
			images: [
				{
					path: "image.png",
					prompt: "portrait of a clown",
					negativePrompt: "worst quality",
				},
			],
		},
		[agent]
	);
} catch (error) {
	console.error("Error:", error);
}
