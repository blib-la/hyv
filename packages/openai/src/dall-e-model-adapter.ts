import type { ModelAdapter } from "@hyv/core";
import type { OpenAIApi } from "openai";

import { defaultOpenAI } from "./config.js";
import type { DallEOptions, FilesMessage, ImageMessage } from "./types.js";

export class DallEModelAdapter implements ModelAdapter<ImageMessage> {
	private readonly _options: DallEOptions;
	private _openAI: OpenAIApi;

	/**
	 * Creates an instance of the DallEModelAdapter class.
	 *
	 * @param options - The DALL-E model options.
	 * @param openAI - A configured openAI API instance.
	 */
	constructor(
		options: DallEOptions = { size: "256x256", n: 1 },
		openAI: OpenAIApi = defaultOpenAI
	) {
		this._options = options;
		this._openAI = openAI;
	}

	async assign(task: ImageMessage): Promise<FilesMessage> {
		try {
			const files = await Promise.all(
				task.images.map(async image => {
					const response = await this._openAI.createImage({
						...this._options,
						prompt: image.prompt,
						// eslint-disable-next-line camelcase
						response_format: "b64_json",
					});
					const content = response.data.data[0].b64_json;
					return { path: image.path, content };
				})
			);

			return {
				files,
			};
		} catch (error) {
			throw new Error(`Error assigning task in DallEModelAdapter: ${error.message}`);
		}
	}
}
