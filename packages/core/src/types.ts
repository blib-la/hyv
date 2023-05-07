import type { FileContentWithPath, SideEffect } from "@hyv/utils";

/**
 * Represents a model message with an optional array of files.
 * Each file has a path and content.
 *
 * @interface ModelMessage
 * @property {Array<{ path: string; content: string }>} [files] - An optional array of files.
 */
export interface ModelMessage extends Record<string, unknown> {
	files?: FileContentWithPath[];
}

/**
 * Represents a model adapter that can assign tasks and move to the next task.
 *
 * @interface ModelAdapter
 * @template Message - A type that extends ModelMessage.
 * @property {(task: Message) => Promise<Message>} assign - A function that takes a task of type Message and returns
 *   a Promise that resolves to a Message.
 */
export interface ModelAdapter<Message extends ModelMessage> {
	assign(task: Message): Promise<Message>;
}

/**
 * Represents a reasonable temperature value.
 *
 * @typedef {0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9} ReasonableTemperature
 */
export type ReasonableTemperature = 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9;

/**
 * The configuration options for an Agent.
 *
 * @template InMessage - The input message type.
 * @template OutMessage - The output message type.
 */
export interface AgentOptions<Store extends StoreAdapter = StoreAdapter> {
	/**
	 * A function that transforms the input message before it is passed to the model.
	 *
	 * @param {ModelMessage} message - The input message.
	 * @returns {Promise<ModelMessage>} - A Promise that resolves to the transformed message.
	 */
	before?(message: ModelMessage): Promise<ModelMessage>;

	/**
	 * A function that transforms the output message after it has been processed by the model.
	 *
	 * @param {ModelMessage} message - The output message.
	 * @returns {Promise<ModelMessage>} - A Promise that resolves to the transformed message.
	 */
	after?(message: ModelMessage): Promise<ModelMessage>;

	/**
	 * A function that runs after the Agent has processed the output message.
	 *
	 * @param {string} messageId - The ID of the message that has been processed.
	 * @param {ModelMessage} message - The output message that has been processed.
	 * @returns {Promise<string>} - A Promise that resolves to the ID of the next message to be processed.
	 */
	finally?(messageId: string, message: ModelMessage): Promise<string>;

	/**
	 * An array of sideEffects that the Agent can use.
	 */
	sideEffects?: SideEffect[];

	store?: Store;
}

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
