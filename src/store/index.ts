import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { nanoid } from "nanoid";

import type { ModelMessage, Tool } from "../types.js";
import { writeFile } from "../utils.js";

import type { StoreAdapter } from "./types.js";

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

/**
 * Creates a file writer tool for writing output files.
 *
 * @param {string} dir - The directory where the output files should be written.
 * @param {BufferEncoding} [encoding="utf-8"] - the encoding that should vbe used when writing files
 * @returns {Tool} - The file writer tool instance.
 */
export function createFileWriter(dir: string, encoding: BufferEncoding = "utf-8"): Tool {
	return {
		prop: "files",
		async run(message: ModelMessage) {
			await Promise.all(
				message.files.map(async file =>
					writeFile(path.join(dir, "output", file.path), file.content, encoding)
				)
			);
		},
	};
}
