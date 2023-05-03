/**
 * Represents a model message with an optional array of files.
 * Each file has a path and content.
 *
 * @interface ModelMessage
 * @property {Array<{ path: string; content: string }>} [files] - An optional array of files.
 */
export interface ModelMessage {
	files?: { path: string; content: string }[];
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
 * Represents a tool with a property and a run method.
 *
 * @interface Tool
 * @property {string} prop - A string property.
 * @property {(message: ModelMessage) => Promise<void>} run - A function that takes a ModelMessage and returns
 *   a Promise that resolves to void.
 */
export interface Tool {
	prop: string;

	run(message: ModelMessage): Promise<void>;
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
export interface AgentOptions<
	InMessage extends ModelMessage = ModelMessage,
	OutMessage extends ModelMessage = ModelMessage
> {
	/**
	 * A function that transforms the input message before it is passed to the model.
	 *
	 * @param {InMessage} message - The input message.
	 * @returns {Promise<Message>} - A Promise that resolves to the transformed message.
	 */
	before?<Message>(message: InMessage): Promise<Message>;

	/**
	 * A function that transforms the output message after it has been processed by the model.
	 *
	 * @param {OutMessage} message - The output message.
	 * @returns {Promise<Message>} - A Promise that resolves to the transformed message.
	 */
	after?<Message>(message: OutMessage): Promise<Message>;

	/**
	 * A function that runs after the Agent has processed the output message.
	 *
	 * @param {string} messageId - The ID of the message that has been processed.
	 * @param {OutMessage} message - The output message that has been processed.
	 * @returns {Promise<string>} - A Promise that resolves to the ID of the next message to be processed.
	 */
	finally?(messageId: string, message: OutMessage): Promise<string>;

	/**
	 * An array of tools that the Agent can use.
	 */
	tools?: Tool[];
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
