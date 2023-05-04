import type { ModelAdapter, ModelMessage } from "@hyv/core";
import type { OpenAIApi } from "openai";

import { defaultOpenAI } from "./config.js";
import type { DallEOptions, ImageMessage } from "./types.js";

export class DallEModelAdapter<Message extends ModelMessage = ModelMessage>
	implements ModelAdapter<Message>
{
	#options: DallEOptions;
	#openAI: OpenAIApi;
	/**
	 * Creates an instance of the DallEModelAdapter class.
	 *
	 * @param {Options} options - The DALL-E model options.
	 * @param {OpenAIApi} openAI - A configured openAI API instance.
	 */
	constructor(
		options: DallEOptions = { size: "256x256", n: 1 },
		openAI: OpenAIApi = defaultOpenAI
	) {
		this.#options = options;
		this.#openAI = openAI;
	}

	async assign(task: Message & ImageMessage): Promise<Message> {
		try {
			const files = await Promise.all(
				task.images.map(async image => {
					const response = await this.#openAI.createImage({
						...this.#options,
						prompt: image.prompt,
						// eslint-disable-next-line camelcase
						response_format: "b64_json",
					});
					const base64 = response.data.data[0].b64_json;
					const content = base64.replace(/^data:image\/\w+;base64,/, "");
					return { path: image.path, content };
				})
			);

			return {
				files,
			} as Message;
		} catch (error) {
			throw new Error(`Error assigning task in DallEModelAdapter: ${error.message}`);
		}
	}
}
