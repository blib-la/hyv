import type { SideEffect } from "@hyv/utils";
import chalk from "chalk";
import humanizeString from "humanize-string";

import type { MemoryAdapter } from "./memory-adapter.js";
import { memoryStore } from "./memory-adapter.js";
import type { AgentOptions, ModelAdapter, ModelMessage, StoreAdapter } from "./types.js";

/**
 * Represents an agent that manages a model, a store, and a set of sideEffects.
 * The agent can assign tasks, find sideEffects, retrieve messages, and return results.
 *
 * @template Model - A type that extends ModelAdapter<ModelMessage>.
 * @template Store - A type that extends StoreAdapter.
 * @property _model - The model instance.
 * @property _store - The store instance.
 * @property _sideEffects - An array of sideEffects.
 * @property _before - A function that runs before the model.
 * @property _after - A function that runs after the model.
 * @property _finally - A function that runs when the process is done.
 * @property verbosity - Enables verbose logging to a certain degree.
 */
export class Agent<
	Model extends ModelAdapter<ModelMessage> = ModelAdapter<ModelMessage>,
	Store extends StoreAdapter = StoreAdapter
> {
	private _model: Model;
	private _store: Store | MemoryAdapter;
	private _sideEffects: SideEffect[] = [];
	private _before: AgentOptions["before"] = async message => message;
	private _after: AgentOptions["after"] = async message => message;
	private _finally: AgentOptions["finally"] = async <T extends ModelMessage>(id, message) => ({
		id,
		message: message as T,
	});

	private readonly _verbosity: number = 0;
	/**
	 * Creates an instance of the Agent class.
	 *
	 * @param model - The model instance.
	 * @param options - The configuration for the agent
	 */
	constructor(model: Model, options: Partial<AgentOptions<Store>> = {}) {
		this._model = model;
		this._store = options.store ?? memoryStore;
		this._verbosity = options.verbosity ?? 0;

		if (options.sideEffects) {
			this._sideEffects = options.sideEffects;
		}

		if (options.before) {
			this._before = options.before;
		}

		if (options.after) {
			this._after = options.after;
		}

		if (options.finally) {
			this._finally = options.finally;
		}
	}

	/**
	 * Assigns a message to the model and runs the appropriate sideEffects.
	 *
	 * @private
	 * @async
	 * @param inputMessage - The message to be assigned.
	 * @param args - optional additional args
	 * @returns - A Promise that resolves to the next messageId and the message.
	 */
	async _assign<T extends ModelMessage>(inputMessage: ModelMessage, ...args: unknown[]) {
		if (this._verbosity > 1) {
			console.log("Input Message:");
			console.log(inputMessage);
		}

		const modifiedInput = await this._before(inputMessage);
		if (this._verbosity > 1) {
			console.log("Modified Input Message:");
			console.log(modifiedInput);
		}

		const outputMessage = await this._model.assign(modifiedInput);
		if (this._verbosity > 1) {
			console.log("Output Message:");
			console.log(outputMessage);
		}

		const modifiedOutputMessage = await this._after(outputMessage);
		if (this._verbosity > 1) {
			console.log("Modified Output Message:");
			console.log(modifiedOutputMessage);
		}

		// For every property-value pair in the modifiedOutputMessage,
		// if a side effect exists for the property, it is invoked with the value.
		Object.entries(modifiedOutputMessage).forEach(([prop, value]) => {
			const sideEffect = this.findSideEffect(prop);
			if (sideEffect) {
				if (this._verbosity > 1) {
					console.log(`Using side effect on: ${prop}`);
				}

				sideEffect.run(value);
			}
		});

		// If verbosity level is more than 0, all the modifiedOutputMessage properties and their
		// values are logged.
		if (this._verbosity > 0) {
			Object.entries(modifiedOutputMessage).forEach(([key, value], index) => {
				console.log(
					`${index === 0 ? "\n" : ""}${chalk.bgYellow.black(
						` ${humanizeString(key)} `
					)}\n\n${typeof value === "object" ? JSON.stringify(value, null, 4) : value}\n`
				);
			});
		}

		const messageId = await this._store.set(modifiedOutputMessage, ...args);
		return this._finally<T>(messageId, modifiedOutputMessage);
	}

	/**
	 * Finds a side effect with the specified property.
	 *
	 * @param prop - The property to search for.
	 * @returns - The found side effect or undefined if not found.
	 */
	findSideEffect(prop: string): SideEffect | undefined {
		return this._sideEffects.find(sideEffect => sideEffect.prop === prop);
	}

	/**
	 * The do method performs the current task using the provided messageId.
	 *
	 * @param messageId - The messageId to the task.
	 * @param args - optional additional args
	 * @returns - The id to the next message
	 */
	async do(messageId: string, ...args: unknown[]) {
		const { id } = await this._assign(await this._store.get(messageId, ...args));
		return id;
	}

	/**
	 * The assign method performs the current task using the provided message.
	 *
	 * @param message - The message to the task.
	 * @param args - optional additional args
	 * @returns - The next message and its id
	 */
	async assign<T extends ModelMessage>(
		message: ModelMessage,
		...args: unknown[]
	): Promise<{ id: string; message: T }> {
		return this._assign(message, ...args);
	}

	/**
	 * Gets the side effects.
	 * @returns - The side effects array.
	 */
	get sideEffects() {
		return this._sideEffects;
	}

	/**
	 * Sets the side effects.
	 * @param sideEffects - The new side effects array.
	 */
	set sideEffects(sideEffects) {
		this._sideEffects = sideEffects;
	}

	/**
	 * Gets the "before" function.
	 * @returns - The before function.
	 */
	get before() {
		return this._before;
	}

	/**
	 * Sets the "before" function.
	 * @param callback - The new before function.
	 */
	set before(callback) {
		this._before = callback;
	}

	/**
	 * Gets the "after" function.
	 * @returns - The after function.
	 */
	get after() {
		return this._after;
	}

	/**
	 * Sets the "after" function.
	 * @param callback - The new after function.
	 */
	set after(callback) {
		this._after = callback;
	}

	/**
	 * Gets the "finally" function.
	 * @returns - The finally function.
	 */
	get finally() {
		return this._finally;
	}

	/**
	 * Sets the "finally" function.
	 * @param callback - The new finally function.
	 */
	set finally(callback) {
		this._finally = callback;
	}

	/**
	 * Gets the model.
	 * @returns - The model instance.
	 */
	get model() {
		return this._model;
	}

	/**
	 * Sets the model.
	 * @param model - The new model.
	 */
	set model(model) {
		this._model = model;
	}
}
