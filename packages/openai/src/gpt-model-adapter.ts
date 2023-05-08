import type { ModelAdapter, ModelMessage } from "@hyv/core";
import { extractCode } from "@hyv/utils";
import type { ChatCompletionRequestMessage, CreateChatCompletionRequest, OpenAIApi } from "openai";

import { defaultOpenAI } from "./config.js";
import type {
	GPT3Options,
	GPTModel,
	GPTOptions,
	ModelHistorySize,
	ReasonableTemperature,
} from "./types.js";
import { createInstruction } from "./utils.js";

const defaultOptions: GPT3Options = {
	temperature: 0.5,
	model: "gpt-3.5-turbo",
	historySize: 1,
	maxTokens: 512,
	systemInstruction: createInstruction("AI", "think, reason, reflect, answer", {
		thought: "string",
		reason: "string",
		reflection: "string",
		answer: "string",
	}),
};

/**
 * Represents a GPT model adapter that can assign tasks and move to the next task.
 *
 */
export class GPTModelAdapter<
	Model extends GPTModel = "gpt-3.5-turbo",
	Input extends ModelMessage = ModelMessage,
	Output extends ModelMessage = ModelMessage,
	Options extends GPTOptions<Model> = GPTOptions<Model>
> implements ModelAdapter<ModelMessage, ModelMessage>
{
	#options: Options;
	#openAI: OpenAIApi;
	readonly history: ChatCompletionRequestMessage[];

	/**
	 * Creates an instance of the GPTModelAdapter class.
	 *
	 * @param  options - The GPT model options.
	 * @param  openAI - A configured openAI API instance.
	 */
	constructor(options: Options = defaultOptions as Options, openAI: OpenAIApi = defaultOpenAI) {
		this.#options = { ...defaultOptions, ...options };
		this.#openAI = openAI;
		this.history = [];
	}

	/**
	 * Adds a message to the history.
	 *
	 * @private
	 * @param  message - The message to add to the history.
	 */
	private addMessageToHistory(message: ChatCompletionRequestMessage) {
		this.history.push(message);
		while (this.history.length >= this.#options.historySize * 2) {
			this.history.shift();
		}
	}

	/**
	 * Assigns a task to the GPT model adapter and returns the result.
	 *
	 * @async
	 * @param task - The task of type ModelMessage to assign.
	 * @returns - A Promise that resolves to the result of the assigned task.
	 * @throws - If there is an error assigning the task.
	 */
	async assign(task: Input): Promise<Output> {
		try {
			this.addMessageToHistory({ role: "user", content: JSON.stringify(task) });
			const request: CreateChatCompletionRequest = {
				model: this.#options.model,
				// eslint-disable-next-line camelcase
				max_tokens: this.#options.maxTokens,
				temperature: this.#options.temperature,
				messages: [
					{ role: "system", content: this.#options.systemInstruction },
					...this.history,
				],
			};
			const completion = await this.#openAI.createChatCompletion(request);

			const { content } = completion.data.choices[0].message;
			const jsonString = extractCode(content);
			this.addMessageToHistory({ role: "assistant", content: jsonString });
			return JSON.parse(jsonString);
		} catch (error) {
			throw new Error(`Error assigning task in GPTModelAdapter: ${error.message}`);
		}
	}

	/**
	 * Gets the systemInstruction value.
	 *
	 * @returns - The current systemInstruction value.
	 */
	get systemInstruction() {
		return this.#options.systemInstruction;
	}

	/**
	 * Sets the systemInstruction value.
	 *
	 * @param systemInstruction - The new systemInstruction value.
	 */
	set systemInstruction(systemInstruction: string) {
		this.#options.systemInstruction = systemInstruction;
	}

	/**
	 * Gets the maxTokens value.
	 *
	 * @returns - The current maxTokens value.
	 */
	get maxTokens() {
		return this.#options.maxTokens;
	}

	/**
	 * Sets the maxTokens value.
	 *
	 * @param maxTokens - The new maxTokens value.
	 */
	set maxTokens(maxTokens: number) {
		this.#options.maxTokens = maxTokens;
	}

	/**
	 * Gets the temperature value.
	 *
	 * @returns - The current temperature value.
	 */
	get temperature() {
		return this.#options.temperature;
	}

	/**
	 * Sets the temperature value.
	 *
	 * @param temperature - The new temperature value.
	 */
	set temperature(temperature: ReasonableTemperature) {
		this.#options.temperature = temperature;
	}

	/**
	 * Gets the historySize value.
	 *
	 * @returns - The current historySize value.
	 */
	get historySize(): ModelHistorySize[Model] {
		return this.#options.historySize;
	}

	/**
	 * Sets the historySize value.
	 *
	 * @param historySize - The new historySize value.
	 */
	set historySize(historySize: ModelHistorySize[Model]) {
		this.#options.historySize = historySize;
	}
}
