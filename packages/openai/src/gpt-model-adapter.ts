import type { ModelAdapter, ModelMessage } from "@hyv/core";
import { extractCode } from "@hyv/core";
import type { ChatCompletionRequestMessage, OpenAIApi } from "openai";

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
	#openai: OpenAIApi;
	readonly history: ChatCompletionRequestMessage[];

	/**
	 * Creates an instance of the GPTModelAdapter class.
	 *
	 * @param {Options} options - The GPT model options.
	 * @param {OpenAIApi} openai - A configured openai API instance.
	 */
	constructor(options: Options, openai: OpenAIApi) {
		console.log("systemInstruction");
		console.log(options.systemInstruction);
		this.#options = options;
		this.#openai = openai;
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

			const completion = await this.#openai.createChatCompletion({
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
			console.log("RAW");
			console.log(content);
			const jsonString = extractCode(content);
			this.addMessageToHistory({ role: "assistant", content: jsonString });
			return JSON.parse(jsonString);
		} catch (error) {
			throw new Error(`Error assigning task in GPTModelAdapter: ${error.message}`);
		}
	}
}
