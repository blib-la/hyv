import type { ModelMessage } from "@hyv/core";
import type { FileContentWithPath } from "@hyv/utils";
import type { ChatCompletionFunctions, CreateImageRequest } from "openai";
import type { Except } from "type-fest";

/**
 * Defines options for the GPT model.
 *
 * @property functions - Optional, defines the chat completion functions.
 * @property model - Optional, specifies the model name.
 * @property temperature - Optional, determines the randomness of the model's output.
 * @property topP - Optional, determines the nucleus sampling parameter.
 * @property frequencyPenalty - Optional, controls the penalty for frequent tokens in the output.
 * @property presencePenalty - Optional, influences the penalty for new tokens in the output.
 * @property maxTokens - Optional, sets the maximum number of tokens in the output response.
 * @property historySize - Optional, dictates the number of chat messages to keep in history.
 * @property format - Optional, determines the format of the output response. Can be either "markdown" or "json".
 * @property systemInstruction - Optional, provides an initial system instruction to guide the model's behavior.
 */
export type GPTOptions = {
	functions?: (ChatCompletionFunctions & {
		fn(args: Record<string, any>): Promise<string> | string;
	})[];
	model?: string;
	temperature?: number;
	topP?: number;
	frequencyPenalty?: number;
	presencePenalty?: number;
	maxTokens?: number;
	historySize?: number;
	format?: "markdown" | "json";
	systemInstruction?: { systemInstruction: string; template: string };
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
