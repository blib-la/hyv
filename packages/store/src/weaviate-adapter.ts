import type { ModelMessage } from "@hyv/core";
import type { ConnectionParams, WeaviateClient } from "weaviate-ts-client";
import weaviate from "weaviate-ts-client";

/**
 * Represents a Weaviate message.
 */
export type WeaviateMessage = ModelMessage & {
	className: string;
	properties: Record<string, unknown>;
};

/**
 * Represents a Weaviate adapter for storing and retrieving messages.
 */
export class WeaviateAdapter {
	private client: WeaviateClient;

	/**
	 * Constructs a new instance of WeaviateAdapter.
	 *
	 * @param {ConnectionParams} options - The connection parameters to establish a connection with Weaviate.
	 */
	constructor(options: ConnectionParams) {
		// https://github.com/weaviate/typescript-client/issues/43
		this.client = (weaviate as unknown as typeof weaviate.default).client(options);
	}

	/**
	 * Stores a WeaviateMessage and returns a Promise that resolves with the messageId.
	 *
	 * @param {WeaviateMessage} message - The message to be stored.
	 * @returns {Promise<string>} The ID of the stored message.
	 */
	async set(message: WeaviateMessage): Promise<string> {
		try {
			const result = await this.client.data
				.creator()
				.withClassName(message.className)
				.withProperties(message.properties)
				.do();

			return result.id;
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Retrieves a WeaviateMessage by its messageId, returning a Promise that resolves with the WeaviateMessage.
	 *
	 * @param {string} messageId - The ID of the message to retrieve.
	 * @param {string} className - The class name of the message to retrieve.
	 * @returns {Promise<any>} The retrieved message.
	 */
	async get(messageId: string, className: string): Promise<any> {
		try {
			const result = await this.client.data
				.getterById()
				.withClassName(className)
				.withId(messageId)
				.do();

			return result;
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Searches for objects based on a class name and a field, returning a Promise that resolves with the search results.
	 *
	 * @param {string} className - The name of the class of objects to search.
	 * @param {string} fields - A space-separated string of the names of the fields to retrieve.
	 * @returns {Promise<any>} The search results.
	 */
	async search(className: string, fields: string): Promise<any> {
		try {
			const result = await this.client.graphql
				.get()
				.withClassName(className)
				.withFields(fields)
				.do();

			return result;
		} catch (error) {
			console.error(error);
		}
	}
}
