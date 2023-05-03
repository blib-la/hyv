import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import type { ModelMessage, StoreAdapter } from "@hyv/core";
import { writeFile } from "@hyv/core";
import { nanoid } from "nanoid";

/**
 * Represents a file system store adapter for storing and retrieving messages.
 *
 * @class FSAdapter
 * @implements StoreAdapter
 * @property {string} #dir - The directory to store messages.
 */
export class FSAdapter implements StoreAdapter {
	readonly dir: string;

	/**
	 * Creates an instance of the FSAdapter class.
	 *
	 * @param {string} dir - The directory to store messages.
	 */
	constructor(dir: string) {
		this.dir = dir;
	}

	/**
	 * Stores a message in the file system and returns the messageId.
	 *
	 * @async
	 * @template Message - A type that extends ModelMessage.
	 * @param {Message} message - The message to store.
	 * @returns {Promise<string>} - A Promise that resolves to the messageId.
	 */
	async set<Message extends ModelMessage>(message: Message): Promise<string> {
		const messageId = nanoid();
		await writeFile(
			path.join(process.cwd(), this.dir, `${messageId}.json`),
			JSON.stringify(message)
		);

		return messageId;
	}

	/**
	 * Retrieves a message by messageId from the file system.
	 *
	 * @async
	 * @param {string} messageId - The messageId of the message to retrieve.
	 * @returns {Promise<ModelMessage>} - A Promise that resolves to the message.
	 * @throws {Error} - If there is an error retrieving the message.
	 */
	async get(messageId: string): Promise<ModelMessage> {
		try {
			return JSON.parse(
				await fs.readFile(path.join(process.cwd(), this.dir, `${messageId}.json`), "utf-8")
			);
		} catch (error) {
			throw new Error(`Error retrieving message with ID ${messageId}: ${error.message}`);
		}
	}
}
