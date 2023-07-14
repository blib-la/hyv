import { defaultOpenAI } from "../config.js";
import { GPTModelAdapter } from "../gpt-model-adapter.js";

jest.mock("../config.js", () => ({
	defaultOpenAI: {
		createChatCompletion: jest.fn(),
	},
}));

describe("GPTModelAdapter", () => {
	let adapter;
	const defaultTask = { content: "dummy content" };
	const completionResponse = {
		data: {
			// eslint-disable-next-line camelcase
			choices: [{ finish_reason: "", message: { content: "## Answer\n\nYes" } }],
		},
	};

	beforeEach(() => {
		(defaultOpenAI.createChatCompletion as any).mockResolvedValue(completionResponse);
		adapter = new GPTModelAdapter();
	});

	it("should assign functions to the _functions property when provided", () => {
		const mockFunction1 = jest.fn();
		const mockFunction2 = jest.fn();

		const options = {
			functions: [
				{ name: "function1", fn: mockFunction1 },
				{ name: "function2", fn: mockFunction2 },
			],
		};

		const adapter = new GPTModelAdapter(options);

		// Now we should expect that the adapter's _functions property has these functions assigned
		expect(adapter.functions.function1).toBe(mockFunction1);
		expect(adapter.functions.function2).toBe(mockFunction2);
	});

	describe("assign()", () => {
		it("should return expected output", async () => {
			const result = await adapter.assign(defaultTask);
			expect(result).toEqual({ answer: "Yes" });
		});

		it("throws an error when OpenAI's createChatCompletion throws an error", async () => {
			// Mock the createChatCompletion to throw an error
			(defaultOpenAI.createChatCompletion as any).mockRejectedValue(
				new Error("OpenAI error")
			);

			// Define a mock message
			const mockMessage = { content: "Test content" };

			// Call assign on the adapter and expect it to reject with the thrown error
			await expect(adapter.assign(mockMessage as any)).rejects.toThrow("OpenAI error");
		});

		it("handles invalid JSON and uses fixJSON", async () => {
			// Set up a JSON system instruction
			const jsonInstruction = {
				systemInstruction: "You are an AI. Your task is to generate a JSON response.",
				template: '{ "key": "<value>" }',
				format: "json" as const,
			};

			// Set up the adapter to return invalid JSON
			const completionResponseInvalidJSON = {
				data: {
					// eslint-disable-next-line camelcase
					choices: [{ finish_reason: "", message: { content: "invalidJSON" } }],
				},
			};

			// Set up the adapter to return valid JSON after fixJSON is called
			const completionResponseValidJSON = {
				data: {
					// eslint-disable-next-line camelcase
					choices: [{ finish_reason: "", message: { content: '{"answer": "Yes"}' } }],
				},
			};

			(defaultOpenAI.createChatCompletion as any)
				.mockResolvedValueOnce(completionResponseInvalidJSON)
				.mockResolvedValueOnce(completionResponseValidJSON);

			// Create a new adapter instance with the JSON system instruction
			const adapterWithJSONInstruction = new GPTModelAdapter({
				systemInstruction: jsonInstruction,
			});

			// Define a mock message
			const mockMessage = { content: "Test content" };

			// Call assign on the adapter
			const result = await adapterWithJSONInstruction.assign(mockMessage as any);

			// Check that the returned result is a valid JSON object
			expect(typeof result).toBe("object");
			expect(result).toEqual({ answer: "Yes" });

			// Check that createChatCompletion was called twice (once for the initial call, and again after fixJSON)
			expect(defaultOpenAI.createChatCompletion).toHaveBeenCalledTimes(2);
		});

		it("handles function calls in response", async () => {
			const mockResponse = {
				data: {
					choices: [
						{
							// eslint-disable-next-line camelcase
							finish_reason: "function_call",
							message: {
								// eslint-disable-next-line camelcase
								function_call: {
									name: "mockFunction",
									arguments: JSON.stringify({ arg1: "value1" }),
								},
								content: "",
							},
						},
					],
				},
			};
			// Mock the createChatCompletion to return a "function_call" finish reason
			(defaultOpenAI.createChatCompletion as any).mockResolvedValueOnce(mockResponse);

			// Set up the mock function in your GPTModelAdapter
			adapter._functions.mockFunction = jest.fn().mockResolvedValue("mockFunctionResult");

			// Call handleResponse and check the result
			const result = await (adapter as any).handleResponse({ messages: [] }, mockResponse);

			// Check that your mock function was called with the correct arguments
			expect(adapter._functions.mockFunction).toHaveBeenCalledWith({ arg1: "value1" });

			// Check that the result is what you expect
			expect(result).toBe("## Answer\n\nYes");
		});

		it("should assign functions to the completion request", async () => {
			// Define a mock function
			const mockFunction = jest.fn();

			// Initialize the adapter with a functions option
			const adapterWithFunctions = new GPTModelAdapter({
				functions: [
					{
						name: "testFunction",
						description: "This is a test function",
						parameters: ["param1", "param2"],
						fn: mockFunction,
					},
				],
			});

			// Define a mock message
			const mockMessage = { content: "Test content" };

			// Call assign on the adapter
			await adapterWithFunctions.assign(mockMessage as any);

			// Check that the mocked OpenAI createChatCompletion method was called with the correct functions
			expect(defaultOpenAI.createChatCompletion).toHaveBeenCalledWith(
				expect.objectContaining({
					functions: [
						{
							name: "testFunction",
							description: "This is a test function",
							parameters: ["param1", "param2"],
						},
					],
				})
			);
		});

		it("should handle JSON system instruction", async () => {
			// Set up a JSON system instruction
			const jsonInstruction = {
				systemInstruction: "You are an AI. Your task is to generate a JSON response.",
				template: '{ "key": "<value>" }',
				format: "json" as const,
			};
			const completionResponse = {
				data: {
					// eslint-disable-next-line camelcase
					choices: [{ finish_reason: "", message: { content: '{"answer": "Yes"}' } }],
				},
			};
			(defaultOpenAI.createChatCompletion as any).mockResolvedValue(completionResponse);
			adapter = new GPTModelAdapter();
			// Create a new adapter instance with the JSON system instruction
			const adapterWithJSONInstruction = new GPTModelAdapter({
				systemInstruction: jsonInstruction,
			});

			// Define a mock message
			const mockMessage = { content: "Test content" };

			// Call assign on the adapter
			const result = await adapterWithJSONInstruction.assign(mockMessage as any);

			// Check that the returned result is a JSON object
			expect(typeof result).toBe("object");

			// Further assertions could be done based on the structure of your expected JSON output.
			// For example, if your AI model is supposed to return a certain structure, you can check that structure here.
		});
	});

	describe("systemInstruction", () => {
		it("should get systemInstruction", () => {
			expect(adapter.systemInstruction).toBeDefined();
		});

		it("should set systemInstruction", () => {
			adapter.systemInstruction = "new instruction";
			expect(adapter.systemInstruction).toBe("new instruction");
		});
	});

	describe("maxTokens", () => {
		it("should get maxTokens", () => {
			expect(adapter.maxTokens).toBeDefined();
		});

		it("should set maxTokens", () => {
			adapter.maxTokens = 100;
			expect(adapter.maxTokens).toBe(100);
		});
	});

	describe("temperature", () => {
		it("should get temperature", () => {
			expect(adapter.temperature).toBeDefined();
		});

		it("should set temperature", () => {
			adapter.temperature = 0.7;
			expect(adapter.temperature).toBe(0.7);
		});
	});

	describe("historySize", () => {
		it("should get historySize", () => {
			expect(adapter.historySize).toBeDefined();
		});

		it("should set historySize", () => {
			adapter.historySize = 3;
			expect(adapter.historySize).toBe(3);
		});
	});
});
