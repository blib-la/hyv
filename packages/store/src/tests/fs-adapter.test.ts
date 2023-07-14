import fs from "node:fs/promises";
import path from "node:path";

import { FSAdapter } from "../fs-adapter.js"; // Replace with actual path to FSAdapter

// We'll create a dummy ModelMessage for the tests
const testMessage = {
	text: "Test message",
};

jest.mock("node:fs/promises", () => ({
	mkdir: jest.fn(),
	readFile: jest.fn(),
	writeFile: jest.fn(),
}));

describe("FSAdapter", () => {
	let adapter: FSAdapter;

	beforeEach(() => {
		// Instantiate the adapter before each test
		adapter = new FSAdapter("test-dir");

		// Clear all instances and calls to constructor and all methods:
		jest.clearAllMocks();
	});

	it("should store a message", async () => {
		await adapter.set(testMessage);
		expect(fs.writeFile).toHaveBeenCalled();
	});

	it("should retrieve a message", async () => {
		(fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(testMessage));
		const messageId = "test-id";
		const retrievedMessage = await adapter.get(messageId);
		expect(fs.readFile).toHaveBeenCalledWith(
			path.join(process.cwd(), "test-dir", `${messageId}.json`),
			"utf-8"
		);
		expect(retrievedMessage).toEqual(testMessage);
	});

	it("should throw an error when retrieving a nonexistent message", async () => {
		const messageId = "nonexistent-id";
		(fs.readFile as jest.Mock).mockRejectedValueOnce(new Error());
		await expect(adapter.get(messageId)).rejects.toThrow();
		expect(fs.readFile).toHaveBeenCalledWith(
			path.join(process.cwd(), "test-dir", `${messageId}.json`),
			"utf-8"
		);
	});
});
