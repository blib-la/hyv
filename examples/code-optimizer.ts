import { inspect } from "node:util";

import { Agent } from "@hyv/core";
import { createInstructionTemplate, GPTModelAdapter2 } from "@hyv/openai";
import { extractCode, minify } from "@hyv/utils";

inspect.defaultOptions.depth = null;

const developer = new Agent(
	new GPTModelAdapter2({
		maxTokens: 2048,
		model: "gpt-4",
		systemInstruction: createInstructionTemplate(
			"expert JavaScript Developer, expert Canvas2D Developer, **performance expert**",
			minify`
			Achieve the {{goal}}.
			Use the {{boilerplate}}.
			`,
			{
				thoughts: "elaborative thoughts",
				code: "valid JavaScript",
			}
		),
	}),
	{ verbosity: 1 }
);

const optimizer = new Agent(
	new GPTModelAdapter2({
		maxTokens: 2048,
		model: "gpt-4",
		systemInstruction: createInstructionTemplate(
			"expert JavaScript Developer, expert Canvas2D Developer, **performance expert**",
			minify`
			Review the {{code}}.
			Look for potential errors and fix them.
			Optimize the {{code}} as needed.
			`,
			{
				review: "elaborative review and critique",
				code: "valid JavaScript (original or optimized)",
			}
		),
	}),
	{
		verbosity: 1,
		sideEffects: [
			{
				prop: "code",
				async run(value: string) {
					const { code } = extractCode(value);

					console.log("SIDE EFFECT");
					console.log(code);
				},
			},
		],
	}
);

try {
	const raw = await developer.assign({
		goal: "The matrix code",
		boilerplate: minify`
		const canvas = document.getElementById("canvas");
		const ctx = canvas.getContext("2d");

		function setCanvasSize() {
		  canvas.width = window.innerWidth * devicePixelRatio;
		  canvas.height = window.innerHeight * devicePixelRatio;
		}

		setCanvasSize();
		window.addEventListener("resize", setCanvasSize, {passive: true});
		`,
	});
	await optimizer.do(raw.id);
} catch (error) {
	console.error("Error:", error);
}
