import type { SideEffect } from "@hyv/utils";

import type { MemoryAdapter } from "./memory-adapter.js";
import { memoryStore } from "./memory-adapter.js";
import type { AgentOptions, ModelAdapter, ModelMessage, StoreAdapter } from "./types.js";

/**
 * Represents an agent that manages a model, a store, and a set of sideEffects.
 * The agent can assign tasks, find sideEffects, retrieve messages, and return results.
 *
 * @template Model - A type that extends ModelAdapter<ModelMessage>.
 * @template Store - A type that extends StoreAdapter.
 * @class Agent
 * @property {Model} #model - The model instance.
 * @property {Store} #store - The store instance.
 * @property {AgentOptions["sideEffect"]} #sideEffects - An array of sideEffects.
 * @property {AgentOptions["before"]} #before - A function that runs before the model.
 * @property {AgentOptions["after"]} #after - A function that runs after the model.
 * @property {AgentOptions["finally"]} #finally - A function that runs when the process is done.
 * @property {Promise<ModelMessage>} #task - A task of type ModelMessage.
 */
export class Agent<
	Model extends ModelAdapter<ModelMessage> = ModelAdapter<ModelMessage>,
	Store extends StoreAdapter = StoreAdapter
> {
	#model: Model;
	#store: Store | MemoryAdapter;
	#sideEffects: SideEffect[] = [];
	#before: AgentOptions["before"] = async <Message>(message): Promise<Message> => message;
	#after: AgentOptions["after"] = async <Message>(message): Promise<Message> => message;
	#finally: AgentOptions["finally"] = async messageId => messageId;

	/**
	 * Creates an instance of the Agent class.
	 *
	 * @param {Model} model - The model instance.
	 * @param {AgentOptions<ModelMessage, ModelMessage>} options - The configuration for the agent
	 */
	constructor(model: Model, options: AgentOptions<Store> = {}) {
		this.#model = model;

		this.#store = options.store ?? memoryStore;

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
	 * @param {ModelMessage} inputMessage - The message to be assigned.
	 * @returns {Promise<string>} - A Promise that resolves to the next messageId.
	 */
	async #assign(inputMessage: ModelMessage) {
		const preparedMessage = await this.#before(inputMessage);
		const message = await this.#model.assign(preparedMessage);
		const modifiedMessage = await this.#after(message);
		Object.entries(modifiedMessage).forEach(([prop, value]) => {
			const sideEffect = this.findSideEffect(prop);
			if (sideEffect) {
				console.log(`Using side effect on: ${prop}`);
				sideEffect.run(value);
			}
		});
		console.log("modifiedMessage");
		console.log(modifiedMessage);

		const messageId = await this.#store.set(modifiedMessage);
		return this.#finally(messageId, modifiedMessage);
	}

	/**
	 * Finds a side effect with the specified property.
	 *
	 * @param {string} prop - The property to search for.
	 * @returns {SideEffect | undefined} - The found side effect or undefined if not found.
	 */
	findSideEffect(prop: string): SideEffect | undefined {
		return this.#sideEffects.find(sideEffect => sideEffect.prop === prop);
	}

	/**
	 * Performs the current task using the provided messageId.
	 *
	 * @param {string} messageId - The messageId to the task.
	 * @returns {string} - The id to the next message
	 */
	async do(messageId: string) {
		return this.#assign(await this.#store.get(messageId));
	}

	get sideEffects() {
		return this.#sideEffects;
	}

	set sideEffects(sideEffects: SideEffect[]) {
		this.#sideEffects = sideEffects;
	}

	get before() {
		return this.#before;
	}

	set before(callback: AgentOptions["before"]) {
		this.#before = callback;
	}

	get after() {
		return this.#after;
	}

	set after(callback: AgentOptions["after"]) {
		this.#after = callback;
	}

	get finally() {
		return this.#finally;
	}

	set finally(callback: AgentOptions["finally"]) {
		this.#finally = callback;
	}

	get model() {
		return this.#model;
	}
}
