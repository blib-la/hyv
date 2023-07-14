import type { OpenAIApi } from "openai";

import { DallEModelAdapter } from "../dall-e-model-adapter.js";

describe("DallEModelAdapter", () => {
	let adapter: DallEModelAdapter;
	let mockOpenAI: OpenAIApi;

	beforeEach(() => {
		// Mock the OpenAI API instance
		mockOpenAI = {
			createImage: jest.fn(),
		} as unknown as OpenAIApi;
		adapter = new DallEModelAdapter(undefined, mockOpenAI);
	});

	it("should assign tasks and return files", async () => {
		// Define a mock ImageMessage
		const mockTask = {
			images: [
				{ prompt: "An image of a cat", path: "/path/to/cat/image" },
				{ prompt: "An image of a dog", path: "/path/to/dog/image" },
			],
		};

		// Define a mock response for the createImage call
		// eslint-disable-next-line camelcase
		const mockResponse = { data: { data: [{ b64_json: "mockImageData" }] } };
		(mockOpenAI.createImage as jest.Mock).mockResolvedValue(mockResponse);

		// Call assign on the adapter
		const result = await adapter.assign(mockTask);

		// Check the result
		expect(result).toEqual({
			files: [
				{ path: "/path/to/cat/image", content: "mockImageData" },
				{ path: "/path/to/dog/image", content: "mockImageData" },
			],
		});

		// Check that createImage was called with the correct arguments for each image
		expect(mockOpenAI.createImage).toHaveBeenCalledTimes(2);
		expect(mockOpenAI.createImage).toHaveBeenCalledWith({
			size: "256x256",
			n: 1,
			prompt: "An image of a cat",
			// eslint-disable-next-line camelcase
			response_format: "b64_json",
		});
		expect(mockOpenAI.createImage).toHaveBeenCalledWith({
			size: "256x256",
			n: 1,
			prompt: "An image of a dog",
			// eslint-disable-next-line camelcase
			response_format: "b64_json",
		});
	});

	it("should throw an error when createImage fails", async () => {
		// Mock createImage to throw an error
		(mockOpenAI.createImage as jest.Mock).mockRejectedValue(new Error("createImage error"));

		// Define a mock ImageMessage
		const mockTask = {
			images: [{ prompt: "An image of a cat", path: "/path/to/cat/image" }],
		};

		// Call assign on the adapter and check that it rejects with the thrown error
		await expect(adapter.assign(mockTask)).rejects.toThrow(
			"Error assigning task in DallEModelAdapter: createImage error"
		);
	});
});
