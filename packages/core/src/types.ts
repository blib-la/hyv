import type { SideEffect } from "@hyv/utils";

export type ModelMessage = Record<string, any>;

/**
 * Represents a model adapter that can assign tasks and move to the next task.
 *
 * @template Input - A type that extends ModelMessage for input tasks.
 * @template Output - A type that extends ModelMessage for output results.
 */
export interface ModelAdapter<Input extends ModelMessage, Output extends ModelMessage> {
	/**
	 * Assigns a task to the model and moves to the next task.
	 *
	 * @param task - A task represented as an Input object.
	 * @returns - A Promise that resolves with the resulting Output object after the task is completed.
	 */
	assign(task: Input): Promise<Output>;
}

/**
 * The configuration options for an Agent, including optional hooks for transforming input and output messages, side effects, and a store adapter for storing and retrieving messages.
 *
 * @template Store - A type that extends the StoreAdapter interface. Defaults to StoreAdapter.
 */
export interface AgentOptions<Store extends StoreAdapter = StoreAdapter> {
	/**
	 * Transforms the input message before it is passed to the model.
	 *
	 * @param message - The input ModelMessage.
	 * @returns - A Promise that resolves with the transformed ModelMessage.
	 */
	before?(message: ModelMessage): Promise<ModelMessage>;

	/**
	 * Transforms the output message after it has been processed by the model.
	 *
	 * @param message - The output ModelMessage.
	 * @returns - A Promise that resolves with the transformed ModelMessage.
	 */
	after?(message: ModelMessage): Promise<ModelMessage>;

	/**
	 * Runs after the Agent has processed the output message.
	 *
	 * @param messageId - The identifier of the processed message.
	 * @param message - The processed ModelMessage.
	 * @returns - A Promise that resolves with the messageId.
	 */
	finally?(messageId: string, message: ModelMessage): Promise<string>;

	/**
	 * An array of sideEffects that the Agent can use.
	 */
	sideEffects?: SideEffect[];

	/**
	 * The store that should be used to save and retrieve messages
	 */
	store?: Store;

	/**
	 * Enables verbose logging to a certain degree
	 */
	verbosity?: number;
}

/**
 * Represents a store adapter for storing and retrieving messages.
 *
 * @method set - Stores a ModelMessage and returns a Promise that resolves with the messageId.
 * @method get - Retrieves a ModelMessage by its messageId, returning a Promise that resolves with the ModelMessage.
 */
export interface StoreAdapter {
	set(message: ModelMessage): Promise<string>;
	get(messageId: string): Promise<ModelMessage>;
}
