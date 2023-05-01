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
 * Represents options for a model with a next function.
 *
 * @interface ModelOptions
 * @property {(messageId: string, data: ModelMessage) => Promise<string>} [next] - An optional function that takes
 *   a messageId and a ModelMessage, and returns a Promise that resolves to a string.
 */
export interface ModelOptions {
	next?(messageId: string, data: ModelMessage): Promise<string>;
}

/**
 * Represents a model adapter that can assign tasks and move to the next task.
 *
 * @interface ModelAdapter
 * @template Message - A type that extends ModelMessage.
 * @property {(task: Message) => Promise<Message>} assign - A function that takes a task of type Message and returns
 *   a Promise that resolves to a Message.
 * @property {(messageId: string, message: Message) => Promise<string>} next - A function that takes a messageId and
 *   a message of type Message, and returns a Promise that resolves to a string.
 */
export interface ModelAdapter<Message extends ModelMessage> {
	assign(task: Message): Promise<Message>;

	next(messageId: string, message: Message): Promise<string>;
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
