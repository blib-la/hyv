import { extractCode } from "../../parsers/code.js";

describe("Code Utils", () => {
	describe("extractCode", () => {
		it("should extract code block correctly", () => {
			const string = "Some text\n```\nconst x = 5;\n```\nMore text";
			const result = extractCode(string);

			expect(result).toEqual({
				language: undefined,
				code: "const x = 5;\n",
				block: true,
			});
		});

		it("should extract language and code block correctly", () => {
			const string = "Some text\n```ts\nconst x: number = 5;\n```\nMore text";
			const result = extractCode(string);

			expect(result).toEqual({
				language: "ts",
				code: "const x: number = 5;\n",
				block: true,
			});
		});

		it("should return original string if no code block found", () => {
			const string = "Some text without a code block";
			const result = extractCode(string);

			expect(result).toEqual({
				code: string,
				block: false,
			});
		});
	});
});
