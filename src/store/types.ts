import type { ModelMessage } from "../types.js";

/**
 * Represents a store adapter for storing and retrieving messages.
 *
 * @interface StoreAdapter
 * @property {Function} set - Stores a message and returns a Promise that resolves to the messageId.
 * @property {Function} get - Retrieves a message by messageId and returns a Promise that resolves to the message.
 */
export interface StoreAdapter {
	set(message: ModelMessage): Promise<string>;

	get(messageId: string): Promise<ModelMessage>;
}
