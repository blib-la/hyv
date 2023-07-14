import { MemoryAdapter } from "../memory-adapter.js";

describe("MemoryAdapter", () => {
	let memoryAdapter: MemoryAdapter;

	beforeEach(() => {
		memoryAdapter = new MemoryAdapter();
	});

	describe("set", () => {
		it("should store a message and return its ID", async () => {
			const message = { text: "Test message", createdAt: new Date().toISOString() };

			const id = await memoryAdapter.set(message);

			expect(id).toBeDefined();
			const storedMessage = await memoryAdapter.get(id);
			expect(storedMessage).toEqual(message);
		});
	});

	describe("get", () => {
		it("should retrieve a message by its ID", async () => {
			const message = { text: "Test message", createdAt: new Date().toISOString() };

			const id = await memoryAdapter.set(message);

			const retrievedMessage = await memoryAdapter.get(id);
			expect(retrievedMessage).toEqual(message);
		});

		it("should throw an error if the message does not exist", async () => {
			const id = "nonexistentID";

			await expect(memoryAdapter.get(id)).rejects.toThrow(
				`Error retrieving message with ID ${id}`
			);
		});
	});
});
