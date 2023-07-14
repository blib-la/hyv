import axios from "axios";

import { Automatic1111ModelAdapter } from "../automatic1111.js";

// Mocking axios module
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Automatic1111ModelAdapter", () => {
	let adapter: Automatic1111ModelAdapter;

	beforeEach(() => {
		adapter = new Automatic1111ModelAdapter();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should assign tasks and return files", async () => {
		// Define a mock ImageMessage
		const mockTask = {
			images: [
				{ prompt: "An image of a cat", path: "/path/to/cat.png" },
				{ prompt: "An image of a dog", path: "/path/to/dog.png" },
			],
		};

		// Mocking axios post responses
		mockedAxios.post.mockImplementation(url => {
			if (url.includes("options")) {
				return Promise.resolve({ status: 200 });
			}

			if (url.includes("txt2img")) {
				return Promise.resolve({ data: { images: ["mockImageData"] } });
			}
		});

		// Call assign on the adapter
		const result = await adapter.assign(mockTask);

		// Check the result
		expect(result).toEqual({
			files: [
				{ path: "/path/to/cat.png", content: "mockImageData" },
				{ path: "/path/to/dog.png", content: "mockImageData" },
			],
		});

		// Check that axios.post was called correctly
		expect(mockedAxios.post).toHaveBeenCalledTimes(mockTask.images.length * 2);
		expect(mockedAxios.post).toHaveBeenCalledWith(
			"http://127.0.0.1:7861/sdapi/v1/options",
			expect.any(Object)
		);
		expect(mockedAxios.post).toHaveBeenCalledWith(
			"http://127.0.0.1:7861/sdapi/v1/txt2img",
			expect.any(Object)
		);
	});

	it("should throw an error when requests fail", async () => {
		// Mocking axios post to throw an error
		mockedAxios.post.mockImplementation(() => Promise.reject(new Error("axios post error")));

		// Define a mock ImageMessage
		const mockTask = {
			images: [{ prompt: "An image of a cat", path: "/path/to/cat.png" }],
		};

		// Call assign on the adapter and check that it rejects with the thrown error
		await expect(adapter.assign(mockTask)).rejects.toThrow(
			"Error assigning task in Automatic1111ModelAdapter: axios post error"
		);
	});

	it("should update _rootUrl if provided in constructor", () => {
		// Define a custom root URL
		const customRootUrl = "http://custom-url:1234";

		// Create a new instance of the Automatic1111ModelAdapter with the custom root URL
		const adapterWithCustomRootUrl = new Automatic1111ModelAdapter({}, customRootUrl);

		expect(adapterWithCustomRootUrl.rootUrl).toBe(customRootUrl);
	});
});
