import type { ModelAdapter, ModelMessage } from "@hyv/core";
import { parseMarkdown } from "@hyv/utils";
import JSON5 from "json5";
import type {
	ChatCompletionRequestMessage,
	ChatCompletionRequestMessageFunctionCall,
	CreateChatCompletionRequest,
	CreateChatCompletionResponse,
	OpenAIApi,
} from "openai";

import { defaultOpenAI } from "./config.js";
import type { GPTOptions } from "./types.js";
import { createInstructionTemplate } from "./utils.js";

const defaultInstruction = createInstructionTemplate("AI", "think, reason, reflect, answer", {
	thought: "your thoughts",
	reason: "reason your thoughts",
	reflection: "reflect on your reasoning",
	answer: "your answer",
});

const defaultOptions: GPTOptions = {
	temperature: 0.5,
	topP: 1,
	frequencyPenalty: 0,
	presencePenalty: 0,
	model: "gpt-3.5-turbo",
	historySize: 2,
	maxTokens: 512,
	systemInstruction: defaultInstruction,
};

/**
 * Represents a GPT model adapter that can assign tasks and move to the next task.
 *
 */
export class GPTModelAdapter<
	Input extends ModelMessage,
	Output extends ModelMessage | ChatCompletionRequestMessageFunctionCall
> implements ModelAdapter<Input>
{
	private _options: GPTOptions;
	private _openAI: OpenAIApi;
	private _functions: Record<string, (args: Record<string, any>) => Promise<string> | string> =
		{};

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
		if (this._options.functions) {
			this._options.functions.forEach(({ name, fn }) => {
				this._functions[name] = fn;
			});
		}

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
		while (this.history.length >= this._options.historySize) {
			this.history.shift();
		}
	}

	/**
	 * Handles responses from GPT. If the response contains a function call it resolves those and
	 * then returns the final answer. The function call responses are sent back to GPT but are not
	 * part of the history (since they are only needed until they are used by GPT), which gives
	 * better control of the historySize.
	 *
	 * @param request
	 * @param response
	 * @private
	 */
	private async handleResponse(
		request: CreateChatCompletionRequest,
		response: { data: CreateChatCompletionResponse }
	): Promise<string> {
		const [choice] = response.data.choices;
		if (choice.finish_reason === "function_call") {
			const result = await this._functions[choice.message.function_call.name](
				JSON.parse(choice.message.function_call.arguments)
			);

			// Messages are pushed into the last request but not added to the overall history
			request.messages.push({
				role: "function",
				name: choice.message.function_call.name,
				content: result,
			});
			const completion = await this._openAI.createChatCompletion(request);
			return this.handleResponse(request, completion);
		}

		return choice.message.content.trim();
	}

	/**
	 * This method can be used to use GPT to try to fix broken answers. It uses a very low
	 * temperature since creativity is not desired  at this stage. It is only called if the format
	 * was JSON
	 *
	 * @param input
	 * @private
	 */
	private async fixJSON(input: string) {
		const completion = await this._openAI.createChatCompletion({
			model: this._options.model,
			// eslint-disable-next-line camelcase
			max_tokens: this._options.maxTokens,
			temperature: 0,
			messages: [
				{
					role: "system",
					content: `Take the user input and put it into this template:\n${this._options.systemInstruction.template}`,
				},
				{
					role: "user",
					content: `put this text into the JSON template: ${input}`,
				},
			],
		});
		return completion.data.choices[0].message.content.trim();
	}

	/**
	 * Assigns a task to the GPT model adapter and returns the result.
	 *
	 * @async
	 * @param task - The task of type ModelMessage to assign.
	 * @returns - A Promise that resolves to the result of the assigned task.
	 * @throws - If there is an error assigning the task.
	 */
	async assign(task: Input): Promise<Output | ChatCompletionRequestMessageFunctionCall> {
		const gptResponse: { content: string | ChatCompletionRequestMessageFunctionCall } = {
			content: "NO RESPONSE",
		};
		try {
			this.addMessageToHistory({ role: "user", content: JSON.stringify(task) });

			const request: CreateChatCompletionRequest = {
				model: this._options.model,
				temperature: this._options.temperature,
				// Streaming is disabled
				// stream: this._options.stream,
				/* eslint-disable camelcase */
				max_tokens: this._options.maxTokens,
				top_p: this._options.topP,
				frequency_penalty: this._options.frequencyPenalty,
				presence_penalty: this._options.presencePenalty,
				/* eslint-enable camelcase */
				messages: [
					{
						role: "system",
						content:
							this._options.systemInstruction.systemInstruction +
							`\n${this._options.systemInstruction.template}`,
					},
					...this.history,
				],
				functions: this._options.functions?.map(({ name, description, parameters }) => ({
					name,
					description,
					parameters,
				})),
			};
			const completion = await this._openAI.createChatCompletion(request);
			// Streaming is disabled
			// const completion = await this._openAI.createChatCompletion(request, {
			// 	responseType: this._options.stream ? "stream" : undefined,
			// });
			// if (this._options.stream) {
			// 	const stream = completion.data;
			// 	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// 	// @ts-ignore
			// 	let text = "";
			// 	stream.on("data", data => {
			// 		const lines = data
			// 			.toString()
			// 			.split("\n")
			// 			.filter(line => line.trim() !== "");
			// 		for (const line of lines) {
			// 			const message = line.replace(/^data: /, "");
			// 			if (message === "[DONE]") {
			// 				return; // Stream finished
			// 			}
			//
			// 			try {
			// 				const parsed = JSON.parse(message);
			// 				text += parsed.choices[0].delta.content;
			// 				console.clear();
			// 				console.log(text);
			// 			} catch (error) {
			// 				console.error("Could not JSON parse stream message", message, error);
			// 			}
			// 		}
			// 	});
			// 	return {};
			// }

			const content = await this.handleResponse(request, completion);

			gptResponse.content = content;
			if (this._options.systemInstruction.format === "markdown") {
				this.addMessageToHistory({ role: "assistant", content });
				return parseMarkdown<Output>(content);
			}

			let message: ModelMessage = { content };

			try {
				message = JSON5.parse(content);
			} catch (error) {
				console.log(error.message);

				const content_ = await this.fixJSON(content);
				gptResponse.content = content_;
				message = JSON5.parse(content_);
			} finally {
				this.addMessageToHistory({ role: "assistant", content: JSON.stringify(message) });
			}

			return message as Output;
		} catch (error) {
			console.log(error.message);
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
