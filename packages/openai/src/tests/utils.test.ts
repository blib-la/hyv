import {
	ensurePunctuation,
	createInstruction,
	createInstructionTemplate,
	createInstructionPersona,
} from "../utils.js"; // Replace with the actual path to your file

describe("Utility functions", () => {
	describe("ensurePunctuation", () => {
		it("should append period if no punctuation", () => {
			const result = ensurePunctuation("Hello");
			expect(result).toEqual("Hello.");
		});

		it("should not append period if punctuation exists", () => {
			const result = ensurePunctuation("Hello!");
			expect(result).toEqual("Hello!");
		});
	});

	describe("createInstruction", () => {
		it("should create correct instruction", () => {
			const instruction = createInstruction("helper", "do something", { a: 1, b: 2 });
			expect(instruction.systemInstruction).toContain("You are a helper.");
			expect(instruction.systemInstruction).toContain("Your tasks: do something.");
			expect(instruction.template).toEqual(JSON.stringify({ a: 1, b: 2 }));
			expect(instruction.format).toEqual("json");
		});
	});

	describe("createInstructionTemplate", () => {
		it("should create correct instruction template", () => {
			// You will have to replace createTemplateFromJSON with the actual implementation or mock it
			const instruction = createInstructionTemplate("helper", "do something", { a: 1, b: 2 });
			expect(instruction.systemInstruction).toContain("You are a helper.");
			expect(instruction.systemInstruction).toContain("Your tasks: do something.");
			expect(instruction.template).toEqual("## A\n\n1\n\n## B\n\n2");
			expect(instruction.format).toEqual("markdown");
		});
	});

	describe("createInstructionPersona", () => {
		it("should create correct instruction persona with JSON", () => {
			const instruction = createInstructionPersona(
				{ name: "AI" },
				[{ rule1: "rule 1" }],
				{
					a: 1,
					b: 2,
				},
				{ format: "json" }
			);
			expect(instruction.systemInstruction).toContain("PRECISELY act as this persona");
			expect(instruction.systemInstruction).toContain("STRICTLY follow these rules");
			expect(instruction.template).toEqual(JSON.stringify({ a: 1, b: 2 }));
			expect(instruction.format).toEqual("json");
		});
		it("should create correct instruction persona with Markdown", () => {
			const instruction = createInstructionPersona({ name: "AI" }, [{ rule1: "rule 1" }], {
				a: 1,
				b: 2,
			});
			expect(instruction.systemInstruction).toContain("PRECISELY act as this persona");
			expect(instruction.systemInstruction).toContain("STRICTLY follow these rules");
			expect(instruction.template).toEqual("## A\n\n1\n\n## B\n\n2");
			expect(instruction.format).toEqual("markdown");
		});
	});
});
