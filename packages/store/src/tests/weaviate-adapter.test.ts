import type { WeaviateClass, WhereFilter } from "weaviate-ts-client";
import weaviate from "weaviate-ts-client";

import { WeaviateAdapter } from "../weaviate-adapter.js";

jest.mock("weaviate-ts-client", () => ({
	client: jest.fn().mockReturnValue({
		schema: {
			classCreator: jest.fn().mockReturnThis(),
			classDeleter: jest.fn().mockReturnThis(),
			withClassName: jest.fn().mockReturnThis(),
			withClass: jest.fn().mockReturnThis(),
			do: jest.fn(),
		},
		data: {
			creator: jest.fn().mockReturnThis(),
			getterById: jest.fn().mockReturnThis(),
			withClassName: jest.fn().mockReturnThis(),
			withProperties: jest.fn().mockReturnThis(),
			withId: jest.fn().mockReturnThis(),
			do: jest.fn(),
		},
		graphql: {
			get: jest.fn().mockReturnThis(),
			withClassName: jest.fn().mockReturnThis(),
			withFields: jest.fn().mockReturnThis(),
			withWhere: jest.fn().mockReturnThis(),
			withNearText: jest.fn().mockReturnThis(),
			withLimit: jest.fn().mockReturnThis(),
			do: jest.fn(),
		},
	}),
}));

describe("WeaviateAdapter", () => {
	let adapter: WeaviateAdapter;

	beforeEach(() => {
		adapter = new WeaviateAdapter({ host: "localhost", scheme: "https" });
		jest.spyOn(console, "log").mockImplementation(() => {
			/**/
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should set a message", async () => {
		const message = { text: "Test message" };
		const className = "Test";
		const id = "test-id";

		(weaviate as any)
			.client()
			.data.creator()
			.withClassName()
			.withProperties()
			.do.mockResolvedValue({ id });

		const result = await adapter.set(message, className);

		expect(result).toEqual(id);
		expect((weaviate as any).client().data.creator().withClassName).toHaveBeenCalledWith(
			className
		);
		expect(
			(weaviate as any).client().data.creator().withClassName().withProperties
		).toHaveBeenCalledWith(message);
		expect(
			(weaviate as any).client().data.creator().withClassName().withProperties().do
		).toHaveBeenCalled();
	});

	it("should get a message", async () => {
		const className = "Test";
		const id = "test-id";
		const message = { text: "Test message" };

		(weaviate as any)
			.client()
			.data.getterById()
			.withClassName()
			.withId()
			.do.mockResolvedValue({ properties: message });

		const result = await adapter.get(id, className);

		expect(result).toEqual(message);
		expect((weaviate as any).client().data.getterById().withClassName).toHaveBeenCalledWith(
			className
		);
		expect(
			(weaviate as any).client().data.getterById().withClassName().withId
		).toHaveBeenCalledWith(id);
		expect(
			(weaviate as any).client().data.getterById().withClassName().withId().do
		).toHaveBeenCalled();
	});

	it("should search objects", async () => {
		const className = "Test";
		const fields = "text";
		const data = [{ text: "Test message 1" }, { text: "Test message 2" }];

		(weaviate as any)
			.client()
			.graphql.get()
			.withClassName()
			.withFields()
			.do.mockResolvedValue({ data });

		const result = await adapter.searchObjects(className, fields);

		expect(result).toEqual({ data });
		expect((weaviate as any).client().graphql.get().withClassName).toHaveBeenCalledWith(
			className
		);
		expect(
			(weaviate as any).client().graphql.get().withClassName().withFields
		).toHaveBeenCalledWith(fields);
		expect(
			(weaviate as any).client().graphql.get().withClassName().withFields().do
		).toHaveBeenCalled();
	});

	it("should search with where filter", async () => {
		const className = "Test";
		const fields = "text";
		const where: WhereFilter = {
			path: ["text"],
			operator: "Equal",
			valueString: "Test message",
		};
		const data = [{ text: "Test message 1" }, { text: "Test message 2" }];

		(weaviate as any)
			.client()
			.graphql.get()
			.withClassName()
			.withFields()
			.withWhere()
			.do.mockResolvedValue({ data });

		const result = await adapter.search(className, fields, where);

		expect(result).toEqual({ data });
		expect((weaviate as any).client().graphql.get().withClassName).toHaveBeenCalledWith(
			className
		);
		expect(
			(weaviate as any).client().graphql.get().withClassName().withFields
		).toHaveBeenCalledWith(fields);
		expect(
			(weaviate as any).client().graphql.get().withClassName().withFields().withWhere
		).toHaveBeenCalledWith(where);
		expect(
			(weaviate as any).client().graphql.get().withClassName().withFields().withWhere().do
		).toHaveBeenCalled();
	});

	it("should search near text", async () => {
		const className = "Test";
		const fields = "text";
		const near = ["greetings", "hello"];
		const options = { distance: 0.1, limit: 10 };
		const data = [{ text: "Hello world!" }, { text: "Greetings, planet!" }];

		(weaviate as any)
			.client()
			.graphql.get()
			.withClassName()
			.withFields()
			.withNearText()
			.withLimit()
			.do.mockResolvedValue({ data });

		const result = await adapter.searchNearText(className, fields, near, options);

		expect(result).toEqual({ data });
		expect((weaviate as any).client().graphql.get().withClassName).toHaveBeenCalledWith(
			className
		);
		expect(
			(weaviate as any).client().graphql.get().withClassName().withFields
		).toHaveBeenCalledWith(fields);
		expect(
			(weaviate as any).client().graphql.get().withClassName().withFields().withNearText
		).toHaveBeenCalledWith({ concepts: near, distance: options.distance });
		expect(
			(weaviate as any).client().graphql.get().withClassName().withFields().withNearText()
				.withLimit
		).toHaveBeenCalledWith(options.limit);
		expect(
			(weaviate as any)
				.client()
				.graphql.get()
				.withClassName()
				.withFields()
				.withNearText()
				.withLimit().do
		).toHaveBeenCalled();
	});

	it("should create class", async () => {
		const schemaClass = { class: "Test", vectorizer: "text2vec-contextionary" };

		(weaviate as any).client().schema.classCreator().withClass().do.mockResolvedValue({});
		(weaviate as any).client().schema.classDeleter().withClassName().do.mockResolvedValue({});

		await adapter.createClass(schemaClass, true);

		expect((weaviate as any).client().schema.classDeleter().withClassName).toHaveBeenCalledWith(
			schemaClass.class
		);
		expect(
			(weaviate as any).client().schema.classDeleter().withClassName().do
		).toHaveBeenCalled();
		expect((weaviate as any).client().schema.classCreator().withClass).toHaveBeenCalledWith(
			schemaClass
		);
	});

	it("should handle errors during class deletion", async () => {
		const dummyClass = {
			class: "DummyClass",
			vectorizer: "text2vec-openai",
		};
		// Make the mocked classDeleter and classCreator throw an error
		(weaviate as any)
			.client()
			.schema.classDeleter()
			.do.mockImplementation(() => {
				throw new Error("Deletion failed");
			});
		// Mock console.log to check if the error is logged
		const consoleSpy = jest.spyOn(console, "log");

		try {
			// Act
			await adapter.createClass(dummyClass, true);
		} catch (error) {
			// Assert
			expect(consoleSpy).toHaveBeenCalledWith(new Error("Deletion failed")); // Ensure error during deletion was logged
		}
	});

	it("should ignore a 422 error when creating a class", async () => {
		const errorClass: WeaviateClass = {
			class: "ErrorClass",
			vectorizer: "text2vec-openai",
			moduleConfig: {
				"text2vec-openai": {
					model: "ada",
					modelVersion: "002",
					type: "text",
				},
			},
		};

		// Make the mocked classCreator throw a 422 error
		(weaviate as any)
			.client()
			.schema.classCreator()
			.withClass()
			.do.mockImplementation(() => {
				throw new Error("Some error (422)");
			});

		await expect(adapter.createClass(errorClass, false)).resolves.not.toThrow();
	});

	it("should access the client", () => {
		// Assert
		expect(adapter.client).toEqual((weaviate as any).client());
	});
});
