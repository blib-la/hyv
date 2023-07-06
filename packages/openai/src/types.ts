import type { ModelMessage } from "@hyv/core";
import type { FileContentWithPath } from "@hyv/utils";
import type { CreateImageRequest } from "openai";
import type { Except } from "type-fest";

/**
 * Represents options for the GPT model.
 *
 * @property model - The model name.
 * @property temperature - The temperature value, controlling the randomness of the model's output.
 * @property maxTokens - The maximum number of tokens in the output response.
 * @property historySize - The number of chat messages to maintain in history.
 * @property systemInstruction - An initial system instruction to guide the model's behavior.
 */
export type GPTOptions = {
	model?: string;
	temperature?: number;
	maxTokens?: number;
	historySize?: number;
	format?: "markdown" | "json";
	systemInstruction?: string;
};

/**
 * Represents the base information of an image.
 */
interface BaseImageInfo {
	/** The path to the image file. */
	path: string;
	/** The prompt used to generate the image. */
	prompt: string;
}

/**
 * Represents the information of an image, including any additional properties defined by the user.
 */
type ImageInfo<T extends Record<string, unknown> = Record<string, unknown>> = T & BaseImageInfo;

/**
 * Represents a message containing one or more images.
 *
 * @property images - An array of objects representing one or more images.
 *   Each object is an instance of the `ImageInfo` interface that includes additional properties
 *   defined by the user.
 */
export interface ImageMessage<T extends Record<string, unknown> = Record<string, unknown>>
	extends ModelMessage {
	images: ImageInfo<T>[];
}

/**
 * Represents a message with files
 */
export interface FilesMessage extends ModelMessage {
	files: FileContentWithPath[];
}

/**
 * Defines the options for creating an image using the DALL-E API, excluding the prompt and response
 * format.
 */
export type DallEOptions = Except<CreateImageRequest, "prompt" | "response_format">;
