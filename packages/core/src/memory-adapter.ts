import { LRUCache } from "lru-cache";
import { nanoid } from "nanoid";

import type { ModelMessage, StoreAdapter } from "./types.js";

/**
 * Represents a memory store adapter for storing and retrieving messages.
 */
export class MemoryAdapter implements StoreAdapter {
	#store: LRUCache<string, ModelMessage> = new LRUCache({ max: 50 });
	/**
	 * Stores a message in the memory and returns the messageId.
	 *
	 * @async
	 * @template Message - A type that extends ModelMessage.
	 * @param message - The message to store.
	 * @returns - A Promise that resolves to the messageId.
	 */
	async set<Message extends ModelMessage>(message: Message): Promise<string> {
		const messageId = nanoid();
		this.#store.set(messageId, message);

		return messageId;
	}

	/**
	 * Retrieves a message by messageId from the file system.
	 *
	 * @async
	 * @param messageId - The messageId of the message to retrieve.
	 * @returns - A Promise that resolves to the message.
	 * @throws - If there is an error retrieving the message.
	 */
	async get(messageId: string): Promise<ModelMessage> {
		const message = this.#store.get(messageId);
		if (message) {
			return message;
		}

		throw new Error(`Error retrieving message with ID ${messageId}`);
	}
}

export const memoryStore = new MemoryAdapter();
