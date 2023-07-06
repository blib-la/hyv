import type { StoreAdapter } from "@hyv/core";
import type { ModelMessage } from "@hyv/core";
import type {
	ConnectionParams,
	WeaviateClient,
	WhereFilter,
	WeaviateClass,
} from "weaviate-ts-client";
import weaviate from "weaviate-ts-client";

/**
 * Represents a Weaviate adapter for storing and retrieving messages.
 */
export class WeaviateAdapter implements StoreAdapter {
	#client: WeaviateClient;

	/**
	 * Constructs a new instance of WeaviateAdapter.
	 *
	 * @param {ConnectionParams} options - The connection parameters to establish a connection with Weaviate.
	 */
	constructor(options: ConnectionParams) {
		// https://github.com/weaviate/typescript-client/issues/43
		this.#client = (weaviate as unknown as typeof weaviate.default).client(options);
	}

	/**
	 * Creates a new class in the Weaviate schema.
	 *
	 * @async
	 * @param {WeaviateClass} schemaClass - The configuration for the class to be created.
	 * @param {boolean} [force=false] - If set to `true`, will attempt to delete the class if it already exists before creating it.
	 *
	 * @throws {Error} Throws an error if there was an issue creating the class and it's not a 422 error.
	 *
	 * @example
	 * const myClass: WeaviateClass = {
	 * 	class: "MyClass",
	 * 	vectorizer: "text2vec-openai",
	 * 	moduleConfig: {
	 * 		"text2vec-openai": {
	 * 			model: "ada",
	 * 			modelVersion: "002",
	 * 			type: "text",
	 * 		},
	 * 	},
	 * };
	 *
	 * await weaviate.createClass(myClass);
	 */
	async createClass(schemaClass: WeaviateClass, force = false) {
		if (force) {
			try {
				// Delete the class
				await this.#client.schema.classDeleter().withClassName(schemaClass.class).do();
			} catch (error) {
				console.log(error);
			}
		}

		try {
			await this.#client.schema.classCreator().withClass(schemaClass).do();
		} catch (error) {
			if (error instanceof Error && error.message.includes("(422)")) {
				// Ignore the error if it's a 422 error, as this just means that the schema already exists
			} else {
				// Throw the error for other non-422 errors
				throw error;
			}
		}
	}

	/**
	 * Stores a ModelMessage and returns a Promise that resolves with the messageId.
	 *
	 * @param {ModelMessage} message - The message to be stored.
	 * @param {string} className - The class name of the message to set
	 * @returns {Promise<string>} The ID of the stored message.
	 */
	async set(message: ModelMessage, className: string): Promise<string> {
		try {
			const result = await this.#client.data
				.creator()
				.withClassName(className)
				.withProperties(message)
				.do();

			return result.id;
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Retrieves a ModelMessage by its messageId, returning a Promise that resolves with the ModelMessage.
	 *
	 * @param {string} messageId - The ID of the message to retrieve.
	 * @param {string} className - The class name of the message to retrieve.
	 * @returns {Promise<ModelMessage>} The retrieved message.
	 */
	async get(messageId: string, className: string): Promise<ModelMessage> {
		try {
			return (
				await this.#client.data.getterById().withClassName(className).withId(messageId).do()
			).properties;
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Searches for objects based on a class name and a field, returning a Promise that resolves with the search results.
	 *
	 * @param {string} className - The name of the class of objects to search.
	 * @param {string} fields - A space-separated string of the names of the fields to retrieve.
	 * @returns {Promise<ModelMessage>} The search results.
	 */
	async searchObjects(className: string, fields: string): Promise<{ data: any }> {
		try {
			return await this.#client.graphql
				.get()
				.withClassName(className)
				.withFields(fields)
				.do();
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * This function allows you to search for data in Weaviate using a where filter.
	 *
	 * @param className - The name of the class to search within.
	 * @param fields - The fields to return in the search results.
	 * @param where - A filter object specifying the conditions for the search, see https://weaviate.io/developers/weaviate/api/graphql/filters
	 *
	 * @returns A Promise that resolves with the result of the search operation.
	 * If an error occurs during the search, the Promise will reject with the error.
	 *
	 * @example
	 *
	 * const whereFilter = {
	 *     operator: 'Equal',
	 *     path: ['name'],
	 *     valueText: "YourFriendlyUser"
	 * };
	 *
	 * search(client, 'User', 'name', whereFilter)
	 *     .then(result => console.log(result))
	 *     .catch(error => console.error(error));
	 */
	async search(className: string, fields: string, where: WhereFilter): Promise<{ data: any }> {
		try {
			return await this.#client.graphql
				.get()
				.withClassName(className)
				.withFields(fields)
				.withWhere(where)
				.do();
		} catch (error) {
			console.error(error);
			return error;
		}
	}

	/**
	 * Searches for text near the specified concepts within a Weaviate class.
	 *
	 * @async
	 *
	 * @param {string} className - The name of the class to search in.
	 * @param {string} fields - The fields to return in the search results.
	 * @param {string[]} near - The concepts to search near.
	 * @param {Object} [options] - Optional parameters for the search.
	 * @param {number} [options.distance=0.2] - The distance from the specified concepts to search.
	 * @param {number} [options.limit=5] - The maximum number of results to return.
	 *
	 * @returns {Promise<{data: any}>} A promise that resolves with the search results.
	 *
	 * @throws {Error} Logs the error to the console and returns it if there is an issue with the search.
	 *
	 * @example
	 * const className = "Message";
	 * const fields = "content, author";
	 * const nearText = ["greetings", "hello"];
	 * const options = { distance: 0.1, limit: 10 };
	 *
	 * const results = await weaviate.searchNearText(className, fields, nearText, options);
	 * console.log(results.data);
	 */
	async searchNearText(
		className: string,
		fields: string,
		near: string[],
		options?: {
			distance?: number;
			limit?: number;
		}
	): Promise<{ data: any }> {
		const defaultOptions = {
			distance: 0.2,
			limit: 5,
		};

		const { distance, limit } = { ...defaultOptions, ...options };

		try {
			return await this.#client.graphql
				.get()
				.withClassName(className)
				.withFields(fields)
				.withNearText({ concepts: near, distance })
				.withLimit(limit)
				.do();
		} catch (error) {
			console.error(error);
			return error;
		}
	}

	get client() {
		return this.#client;
	}
}
