import { Tool, StoreAdapter, ModelMessage } from '@hyv/core';

/**
 * Creates a file writer tool for writing output files.
 *
 * @param {string} dir - The directory where the output files should be written.
 * @param {BufferEncoding} [encoding="utf-8"] - the encoding that should vbe used when writing files
 * @returns {Tool} - The file writer tool instance.
 */
declare function createFileWriter(dir: string, encoding?: BufferEncoding): Tool;

/**
 * Represents a file system store adapter for storing and retrieving messages.
 *
 * @class FSAdapter
 * @implements StoreAdapter
 * @property {string} #dir - The directory to store messages.
 */
declare class FSAdapter implements StoreAdapter {
    readonly dir: string;
    /**
     * Creates an instance of the FSAdapter class.
     *
     * @param {string} dir - The directory to store messages.
     */
    constructor(dir: string);
    /**
     * Stores a message in the file system and returns the messageId.
     *
     * @async
     * @template Message - A type that extends ModelMessage.
     * @param {Message} message - The message to store.
     * @returns {Promise<string>} - A Promise that resolves to the messageId.
     */
    set<Message extends ModelMessage>(message: Message): Promise<string>;
    /**
     * Retrieves a message by messageId from the file system.
     *
     * @async
     * @param {string} messageId - The messageId of the message to retrieve.
     * @returns {Promise<ModelMessage>} - A Promise that resolves to the message.
     * @throws {Error} - If there is an error retrieving the message.
     */
    get(messageId: string): Promise<ModelMessage>;
}

export { FSAdapter, createFileWriter };
