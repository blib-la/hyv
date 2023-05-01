import type { ChatCompletionRequestMessage } from "openai";

import type { ModelAdapter, ModelMessage } from "../types.js";
import { extractCode } from "../utils.js";

import { openai } from "./openai.js";
import type { GPTOptions } from "./types.js";

/**
 * Represents a GPT model adapter that can assign tasks and move to the next task.
 *
 * @template Options - A type that extends GPTOptions.
 * @class GPTModelAdapter
 * @implements ModelAdapter<ModelMessage>
 * @property {Options} #options - The GPT model options.
 * @property {ChatCompletionRequestMessage[]} history - An array of chat completion request messages.
 */
export class GPTModelAdapter<Options extends GPTOptions> implements ModelAdapter<ModelMessage> {
	#options: Options;
	readonly history: ChatCompletionRequestMessage[];

	/**
	 * Creates an instance of the GPTModelAdapter class.
	 *
	 * @param {Options} options - The GPT model options.
	 */
	constructor(options: Options) {
		this.#options = options;
		this.history = [];
	}

	/**
	 * Adds a message to the history.
	 *
	 * @private
	 * @param {ChatCompletionRequestMessage} message - The message to add to the history.
	 */
	private addMessageToHistory(message: ChatCompletionRequestMessage) {
		this.history.push(message);
		// The history size is doubled internally to maintain an odd number of elements
		// in the history. This ensures that the structure alternates between user and
		// assistant messages, regardless of the history size specified by the user.
		while (this.history.length >= this.#options.historySize * 2) {
			this.history.shift();
		}
	}

	/**
	 * Moves to the next task, if the next function is defined in options.
	 *
	 * @async
	 * @param {string} messageId - The messageId to move to the next task.
	 * @param {ModelMessage} message - The message of type ModelMessage.
	 * @returns {Promise<string>} - A Promise that resolves to the next messageId.
	 */
	async next(messageId: string, message: ModelMessage): Promise<string> {
		if (this.#options.next) {
			return this.#options.next(messageId, message);
		}

		return messageId;
	}

	/**
	 * Assigns a task to the GPT model adapter and returns the result.
	 *
	 * @async
	 * @param {ModelMessage} task - The task of type ModelMessage to assign.
	 * @returns {Promise<ModelMessage>} - A Promise that resolves to the result of the assigned task.
	 * @throws {Error} - If there is an error assigning the task.
	 */
	async assign(task: ModelMessage): Promise<ModelMessage> {
		try {
			this.addMessageToHistory({ role: "user", content: JSON.stringify(task) });

			const completion = await openai.createChatCompletion({
				model: this.#options.model,
				// eslint-disable-next-line camelcase
				max_tokens: this.#options.maxTokens,
				temperature: this.#options.temperature,
				messages: [
					{ role: "system", content: this.#options.systemInstruction },
					...this.history,
				],
			});

			const { content } = completion.data.choices[0].message;
			console.log("content");
			console.log(content);
			const jsonString = extractCode(content);
			this.addMessageToHistory({ role: "assistant", content: jsonString });
			const result = JSON.parse(jsonString);
			console.log("result");
			console.log(result);
			return result;
		} catch (error) {
			throw new Error(`Error assigning task in GPTModelAdapter: ${error.message}`);
		}
	}
}
