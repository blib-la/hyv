import type { ModelAdapter, ModelMessage } from "@hyv/core";
import { extractCode, parseMarkdown } from "@hyv/utils";
import type { AxiosError } from "axios";
import JSON5 from "json5";
import type { ChatCompletionRequestMessage, CreateChatCompletionRequest, OpenAIApi } from "openai";

import { defaultOpenAI } from "./config.js";
import type { GPTOptions } from "./types.js";
import { createInstructionTemplate } from "./utils.js";

const defaultOptions: GPTOptions = {
	temperature: 0.5,
	model: "gpt-3.5-turbo",
	historySize: 1,
	maxTokens: 512,
	format: "markdown",
	systemInstruction: createInstructionTemplate("AI", "think, reason, reflect, answer", {
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
export class GPTModelAdapter<Input extends ModelMessage, Output extends ModelMessage>
	implements ModelAdapter<Input, Output>
{
	private _options: GPTOptions;
	private _openAI: OpenAIApi;
	readonly history: ChatCompletionRequestMessage[];

	/**
	 * Creates an instance of the GPTModelAdapter class.
	 *
	 * @param  options - The GPT model options.
	 * @param openAI
	 */
	constructor(options: Partial<GPTOptions> = defaultOptions, openAI: OpenAIApi = defaultOpenAI) {
		this._options = { ...defaultOptions, ...options } as GPTOptions;
		this._openAI = openAI;
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
		while (this.history.length >= this._options.historySize * 2) {
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
				model: this._options.model,
				// eslint-disable-next-line camelcase
				max_tokens: this._options.maxTokens,
				temperature: this._options.temperature,
				messages: [
					{ role: "system", content: this._options.systemInstruction },
					...this.history,
				],
			};
			const completion = await this._openAI.createChatCompletion(request);

			const { content } = completion.data.choices[0].message;
			if (this._options.format === "markdown") {
				this.addMessageToHistory({ role: "assistant", content });
				return parseMarkdown<Output>(content);
			}

			const { code: jsonString } = extractCode(content);

			this.addMessageToHistory({ role: "assistant", content: jsonString });
			try {
				return JSON.parse(jsonString);
			} catch {
				return JSON5.parse(jsonString);
			}
		} catch (error: unknown) {
			console.error(
				(error as AxiosError)?.response?.data.message ?? (error as Error).message
			);
			throw error;
		}
	}

	/**
	 * Gets the systemInstruction value.
	 *
	 * @returns - The current systemInstruction value.
	 */
	get systemInstruction() {
		return this._options.systemInstruction;
	}

	/**
	 * Sets the systemInstruction value.
	 *
	 * @param systemInstruction - The new systemInstruction value.
	 */
	set systemInstruction(systemInstruction) {
		this._options.systemInstruction = systemInstruction;
	}

	/**
	 * Gets the maxTokens value.
	 *
	 * @returns - The current maxTokens value.
	 */
	get maxTokens() {
		return this._options.maxTokens;
	}

	/**
	 * Sets the maxTokens value.
	 *
	 * @param maxTokens - The new maxTokens value.
	 */
	set maxTokens(maxTokens) {
		this._options.maxTokens = maxTokens;
	}

	/**
	 * Gets the temperature value.
	 *
	 * @returns - The current temperature value.
	 */
	get temperature() {
		return this._options.temperature;
	}

	/**
	 * Sets the temperature value.
	 *
	 * @param temperature - The new temperature value.
	 */
	set temperature(temperature) {
		this._options.temperature = temperature;
	}

	/**
	 * Gets the historySize value.
	 *
	 * @returns - The current historySize value.
	 */
	get historySize() {
		return this._options.historySize;
	}

	/**
	 * Sets the historySize value.
	 *
	 * @param historySize - The new historySize value.
	 */
	set historySize(historySize) {
		this._options.historySize = historySize;
	}
}
