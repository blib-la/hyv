import type { ModelAdapter, ModelMessage } from "@hyv/core";
import axios from "axios";
import decamelizeKeys from "decamelize-keys";

import type { Automatic1111Options, ImageMessage } from "./types.js";

const defaultOptions: Automatic1111Options = {
	steps: 20,
	cfgScale: 7,
	height: 256,
	width: 256,
};

export class Automatic1111ModelAdapter<Message extends ModelMessage = ModelMessage>
	implements ModelAdapter<Message>
{
	#options: Automatic1111Options;
	#root = "http://127.0.0.1:7861";
	/**
	 * Creates an instance of the Automatic1111ModelAdapter class.
	 *
	 * @param {Options} options - The Automatic1111 model options.
	 * @param {string} root - root url to the endpoints
	 */
	constructor(options: Automatic1111Options = defaultOptions, root?: string) {
		this.#options = { ...defaultOptions, ...options };
		if (root) {
			this.#root = root;
		}
	}

	async assign(task: Message & ImageMessage): Promise<Message> {
		try {
			const files = await Promise.all(
				task.images.map(async ({ alt, path: imagePath, ...image }) => {
					const { model: sdModelCheckpoint, ...options } = this.#options;
					await axios.post([this.#root, "sdapi/v1/options"].join("/"), {
						...decamelizeKeys({ sdModelCheckpoint }),
					});
					const response = await axios.post([this.#root, "sdapi/v1/txt2img"].join("/"), {
						...decamelizeKeys(options),
						...decamelizeKeys(image),
					});
					console.log(response.data);
					const [content] = response.data.images;
					return { path: imagePath, content };
				})
			);

			return {
				files,
			} as Message;
		} catch (error) {
			throw new Error(`Error assigning task in Automatic1111ModelAdapter: ${error.message}`);
		}
	}
}
