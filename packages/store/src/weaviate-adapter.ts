import type { ModelMessage } from "@hyv/core";
import type { ConnectionParams, WeaviateClient, WhereFilter } from "weaviate-ts-client";
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
	async searchObjects(className: string, fields: string): Promise<any> {
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
	async search(className: string, fields: string, where: WhereFilter): Promise<any> {
		try {
			const result = await this.client.graphql
				.get()
				.withClassName(className)
				.withFields(fields)
				.withWhere(where)
				.do();

			return result;
		} catch (error) {
			console.error(error);
			return error;
		}
	}
}
