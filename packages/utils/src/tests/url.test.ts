import { urlJoin } from "../url.js";

describe("URL Utils", () => {
	describe("urlJoin", () => {
		it("should join parts correctly with base URL", () => {
			const base = "https://example.com/";
			const parts = ["path", "to", "resource"];

			const result = urlJoin(base, ...parts);

			expect(result).toEqual("https://example.com/path/to/resource");
		});

		it("should handle parts starting with / correctly", () => {
			const base = "https://example.com/";
			const parts = ["/path", "/to", "/resource"];

			const result = urlJoin(base, ...parts);

			expect(result).toEqual("https://example.com/path/to/resource");
		});

		it("should handle an empty parts array", () => {
			const base = "https://example.com/";
			const parts: string[] = [];

			const result = urlJoin(base, ...parts);

			expect(result).toEqual("https://example.com/");
		});
	});
});
