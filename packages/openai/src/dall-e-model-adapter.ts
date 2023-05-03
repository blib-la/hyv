import type { ModelAdapter, ModelMessage } from "@hyv/core";
import type { OpenAIApi } from "openai";

import type { DallEOptions, ImageMessage } from "./types.js";

export class DallEModelAdapter<
	Options extends DallEOptions = DallEOptions,
	Message extends ModelMessage = ModelMessage
> implements ModelAdapter<Message>
{
	#options: Options;
	#openai: OpenAIApi;
	/**
	 * Creates an instance of the DallEModelAdapter class.
	 *
	 * @param {Options} options - The DALL-E model options.
	 * @param {OpenAIApi} openai - A configured openai API instance.
	 */
	constructor(options: Options, openai: OpenAIApi) {
		this.#options = options;
		this.#openai = openai;
	}

	async assign(task: Message & ImageMessage): Promise<Message> {
		try {
			const files = await Promise.all(
				task.images.map(async image => {
					const response = await this.#openai.createImage({
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
