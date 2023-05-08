import type { SideEffect } from "@hyv/utils";
import chalk from "chalk";

import type { MemoryAdapter } from "./memory-adapter.js";
import { memoryStore } from "./memory-adapter.js";
import type { AgentOptions, ModelAdapter, ModelMessage, StoreAdapter } from "./types.js";

/**
 * Represents an agent that manages a model, a store, and a set of sideEffects.
 * The agent can assign tasks, find sideEffects, retrieve messages, and return results.
 *
 * @template Model - A type that extends ModelAdapter<ModelMessage>.
 * @template Store - A type that extends StoreAdapter.
 * @property #model - The model instance.
 * @property #store - The store instance.
 * @property #sideEffects - An array of sideEffects.
 * @property #before - A function that runs before the model.
 * @property #after - A function that runs after the model.
 * @property #finally - A function that runs when the process is done.
 * @property verbosity - Enables verbose logging to a certain degree.
 */
export class Agent<
	Model extends ModelAdapter<ModelMessage, ModelMessage> = ModelAdapter<
		ModelMessage,
		ModelMessage
	>,
	Store extends StoreAdapter = StoreAdapter
> {
	#model: Model;
	#store: Store | MemoryAdapter;
	#sideEffects: SideEffect[] = [];
	#before: AgentOptions["before"] = async message => message;
	#after: AgentOptions["after"] = async message => message;
	#finally: AgentOptions["finally"] = async messageId => messageId;
	private readonly verbosity: number = 0;
	/**
	 * Creates an instance of the Agent class.
	 *
	 * @param model - The model instance.
	 * @param options - The configuration for the agent
	 */
	constructor(model: Model, options: AgentOptions<Store> = {}) {
		this.#model = model;

		this.#store = options.store ?? memoryStore;
		this.verbosity = options.verbosity ?? 0;

		if (options.sideEffects) {
			this.#sideEffects = options.sideEffects;
		}

		if (options.before) {
			this.#before = options.before;
		}

		if (options.after) {
			this.#after = options.after;
		}

		if (options.finally) {
			this.#finally = options.finally;
		}
	}

	/**
	 * Assigns a message to the model and runs the appropriate sideEffects.
	 *
	 * @private
	 * @async
	 * @param inputMessage - The message to be assigned.
	 * @returns - A Promise that resolves to the next messageId.
	 */
	async #assign(inputMessage: ModelMessage) {
		if (this.verbosity > 1) {
			console.log("Input Message:");
			console.log(inputMessage);
		}

		const modifiedInput = await this.#before(inputMessage);
		if (this.verbosity > 1) {
			console.log("Modified Input Message:");
			console.log(modifiedInput);
		}

		const outputMessage = await this.#model.assign(modifiedInput);
		if (this.verbosity > 1) {
			console.log("Output Message:");
			console.log(outputMessage);
		}

		const modifiedOutputMessage = await this.#after(outputMessage);
		if (this.verbosity > 1) {
			console.log("Modified Output Message:");
			console.log(modifiedOutputMessage);
		}

		Object.entries(modifiedOutputMessage).forEach(([prop, value]) => {
			const sideEffect = this.findSideEffect(prop);
			if (sideEffect) {
				if (this.verbosity > 0) {
					console.log(`Using side effect on: ${prop}`);
				}

				sideEffect.run(value);
			}
		});

		if (this.verbosity > 0) {
			Object.entries(modifiedOutputMessage).forEach(([key, value], index) => {
				console.log(
					`${index === 0 ? "\n" : ""}${chalk.bgYellow.black(
						` ${key} `.toLocaleUpperCase()
					)}\n\n${typeof value === "object" ? JSON.stringify(value, null, 4) : value}\n`
				);
			});
		}

		const messageId = await this.#store.set(modifiedOutputMessage);
		return this.#finally(messageId, modifiedOutputMessage);
	}

	/**
	 * Finds a side effect with the specified property.
	 *
	 * @param prop - The property to search for.
	 * @returns - The found side effect or undefined if not found.
	 */
	findSideEffect(prop: string): SideEffect | undefined {
		return this.#sideEffects.find(sideEffect => sideEffect.prop === prop);
	}

	/**
	 * Performs the current task using the provided messageId.
	 *
	 * @param messageId - The messageId to the task.
	 * @returns - The id to the next message
	 */
	async do(messageId: string) {
		return this.#assign(await this.#store.get(messageId));
	}

	get sideEffects() {
		return this.#sideEffects;
	}

	set sideEffects(sideEffects) {
		this.#sideEffects = sideEffects;
	}

	get before() {
		return this.#before;
	}

	set before(callback) {
		this.#before = callback;
	}

	get after() {
		return this.#after;
	}

	set after(callback) {
		this.#after = callback;
	}

	get finally() {
		return this.#finally;
	}

	set finally(callback) {
		this.#finally = callback;
	}

	get model() {
		return this.#model;
	}
}
