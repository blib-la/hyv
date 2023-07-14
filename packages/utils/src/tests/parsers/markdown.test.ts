import camelcase from "camelcase";

import { parseMarkdown } from "../../parsers/markdown.js";

describe("Markdown Utils", () => {
	describe("parseMarkdown", () => {
		it("should parse markdown correctly", () => {
			const markdown = "# Title\nThis is some text.\n\n## Subtitle\nThis is some more text.";
			const result = parseMarkdown(markdown);

			expect(result).toEqual({
				[camelcase("Title")]: "This is some text.",
				[camelcase("Subtitle")]: "This is some more text.",
			});
		});

		it("should handle an empty string", () => {
			const markdown = "";
			const result = parseMarkdown(markdown);

			expect(result).toEqual({});
		});

		it("should handle markdown without headings", () => {
			const markdown = "This is some text.";
			const result = parseMarkdown(markdown);

			expect(result).toEqual({});
		});

		it("should handle custom pattern correctly", () => {
			const markdown = "- Title\nThis is some text.\n\n- Subtitle\nThis is some more text.";
			const pattern = /^- /m;
			const result = parseMarkdown(markdown, pattern);

			expect(result).toEqual({
				[camelcase("Title")]: "This is some text.",
				[camelcase("Subtitle")]: "This is some more text.",
			});
		});
	});
});
