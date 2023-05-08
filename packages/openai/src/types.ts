import type { ModelMessage } from "@hyv/core";
import type { FileContentWithPath } from "@hyv/utils";
import type { CreateImageRequest } from "openai";
import type { Except } from "type-fest";

/**
 * Represents a reasonable temperature value.
 * A discrete temperature value within the range of 0 to 0.9, with an increment of 0.1.
 * This is used to represent the model's exploration factor, where a lower value results in more
 * focused and deterministic outputs, while a higher value encourages more random and diverse
 * outputs.
 */
export type ReasonableTemperature = 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9;

/**
 * Represents valid history size values for GPT-3 model.
 */
export type GPT3HistorySize = 1 | 2;

/**
 * Represents valid max tokens values for GPT-4 model.
 */
export type GPT4HistorySize = 1 | 2 | 3 | 4;

/**
 * Represents compatible GPT models
 */
export type GPTModel = "gpt-3.5-turbo" | "gpt-4";

/**
 * Represents mapping for history size of the GPT models
 */
export type ModelHistorySize = {
	"gpt-3.5-turbo": GPT3HistorySize;
	"gpt-4": GPT4HistorySize;
};

/**
 * Represents options for the GPT model.
 *
 * @property model - The model name.
 * @property temperature - The temperature value, controlling the randomness of the model's output.
 * @property maxTokens - The maximum number of tokens in the output response.
 * @property historySize - The number of chat messages to maintain in history.
 * @property systemInstruction - An initial system instruction to guide the model's behavior.
 */
export type GPTOptions<Model extends GPTModel = GPTModel> = {
	model?: Model;
	temperature?: ReasonableTemperature;
	maxTokens?: number;
	historySize?: ModelHistorySize[Model];
	systemInstruction?: string;
};

/**
 * Represents GPT3 specific options
 */
export type GPT3Options = Omit<GPTOptions<"gpt-3.5-turbo">, "model"> & {
	model: "gpt-3.5-turbo";
	historySize?: GPT3HistorySize;
};

/**
 * Represents GPT4 specific options
 */
export type GPT4Options = Omit<GPTOptions<"gpt-4">, "model"> & {
	model: "gpt-4";
	historySize?: GPT4HistorySize;
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
