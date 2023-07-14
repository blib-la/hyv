import { createTemplateFromJSON, minify, splitBy, wrapCode } from "../string.js";

describe("String Utils", () => {
	describe("minify", () => {
		it("should remove leading and trailing whitespace from template literal", () => {
			const minified = minify`      Hello,
      World!       `;

			expect(minified).toEqual("Hello, World!");
		});

		it("should handle interpolations correctly", () => {
			const world = "World";
			const minified = minify`      Hello,
      ${world}!       `;

			expect(minified).toEqual("Hello, World!");
		});
	});

	describe("wrapCode", () => {
		it("should wrap code in markdown code block", () => {
			const code = "const x = 5;";
			const wrapped = wrapCode(code, "ts");

			expect(wrapped).toEqual("\n```ts\nconst x = 5;\n```\n");
		});
	});

	describe("createTemplateFromJSON", () => {
		it("should convert JSON to a string template", () => {
			const json = {
				name: "John Doe",
				age: 25,
				address: {
					city: "New York",
					country: "USA",
				},
			};

			const template = createTemplateFromJSON(json);

			expect(template).toEqual(
				`## Name\n\nJohn Doe\n\n## Age\n\n25\n\n## Address\n\n\n\`\`\`json\n${JSON.stringify(
					json.address
				)}\n\`\`\`\n`
			);
		});
	});

	describe("splitBy", () => {
		it("should split text by pattern", () => {
			const text = "apple, banana, cherry, date";
			const pattern = /,/;

			const splitted = splitBy(text, pattern);

			expect(splitted).toEqual(["apple", "banana", "cherry", "date"]);
		});
	});
});
