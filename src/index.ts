import type { StoreAdapter } from "./store/types.js";
import type { AgentOptions, ModelAdapter, ModelMessage, Tool } from "./types.js";

/**
 * Represents an agent that manages a model, a store, and a set of tools.
 * The agent can assign tasks, find tools, retrieve messages, and return results.
 *
 * @template Model - A type that extends ModelAdapter<ModelMessage>.
 * @template Store - A type that extends StoreAdapter.
 * @class Agent
 * @property {Model} #model - The model instance.
 * @property {Store} #store - The store instance.
 * @property {AgentOptions["tool"]} #tools - An array of tools.
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
	#store: Store;
	#tools: Tool[] = [];
	readonly before: AgentOptions["before"] = async <Message>(message): Promise<Message> => message;
	readonly after: AgentOptions["after"] = async <Message>(message): Promise<Message> => message;
	readonly finally: AgentOptions["finally"] = async messageId => messageId;
	#task: Promise<ModelMessage>;

	/**
	 * Creates an instance of the Agent class.
	 *
	 * @param {Model} model - The model instance.
	 * @param {Store} store - The store instance.
	 * @param {AgentOptions<ModelMessage, ModelMessage>} options - The configuration for the agent
	 */
	constructor(
		model: Model,
		store: Store,
		options: AgentOptions<ModelMessage, ModelMessage> = {}
	) {
		this.#model = model;
		this.#store = store;

		if (options.tools) {
			this.#tools = options.tools;
		}

		if (options.before) {
			this.before = options.before;
		}

		if (options.after) {
			this.after = options.after;
		}

		if (options.finally) {
			this.finally = options.finally;
		}
	}

	/**
	 * Assigns a message to the model and runs the appropriate tools.
	 *
	 * @private
	 * @async
	 * @param {Promise<ModelMessage>} messagePromise - The message to be assigned.
	 * @returns {Promise<string>} - A Promise that resolves to the next messageId.
	 */
	async #assign(messagePromise: Promise<ModelMessage>) {
		const preparedMessage = await this.before(await messagePromise);
		const message = await this.#model.assign(preparedMessage);
		await Promise.all(
			Object.entries(message).map(async ([prop, value]) => {
				const tool = this.findTool(prop);

				if (tool) {
					console.log(`Using tool: ${prop}`);
					return tool.run({ [prop]: value });
				}

				return Promise.resolve();
			})
		);
		const modifiedMessage = await this.after(message);
		console.log("modifiedMessage");
		console.log(modifiedMessage);

		const messageId = await this.#store.set(modifiedMessage);
		return this.finally(messageId, modifiedMessage);
	}

	/**
	 * Finds a tool with the specified property.
	 *
	 * @param {string} prop - The property to search for.
	 * @returns {Tool | undefined} - The found tool or undefined if not found.
	 */
	findTool(prop: string): Tool | undefined {
		return this.#tools.find(tool => tool.prop === prop);
	}

	/**
	 * Retrieves a message from the store using the messageId.
	 *
	 * @private
	 * @async
	 * @param {string} messageId - The messageId to retrieve the message.
	 * @returns {Promise<ModelMessage>} - A Promise that resolves to the retrieved message.
	 */
	async #retrieve(messageId: string) {
		return this.#store.get(messageId);
	}

	/**
	 * Sets the current task using the provided messageId.
	 *
	 * @param {string} messageId - The messageId to set the task.
	 */
	// eslint-disable-next-line accessor-pairs
	set task(messageId: string) {
		this.#task = this.#retrieve(messageId);
	}

	/**
	 * Gets the result of the current task assignment.
	 *
	 * @returns {Promise<string>} - A Promise that resolves to the next messageId.
	 */
	get result() {
		return this.#assign(this.#task);
	}
}
