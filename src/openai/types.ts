import type { ReasonableTemperature } from "../types.js";

/**
 * Represents options for the GPT model.
 *
 * @interface GPTOptions
 * @property {string} model - The model name.
 * @property {ReasonableTemperature} temperature - The temperature value.
 * @property {number} maxTokens - The maximum number of tokens.
 * @property {number} historySize - The history size.
 * @property {string} systemInstruction - The system instruction.
 */
export interface GPTOptions {
	model: string;
	temperature: ReasonableTemperature;
	maxTokens: number;
	historySize: number;
	systemInstruction: string;
}

/**
 * Represents options for the GPT-3 model.
 *
 * @interface GPT3Options
 * @extends GPTOptions
 * @property {"gpt-3.5-turbo"} model - The GPT-3 model name.
 * @property {1 | 2} historySize - The history size for GPT-3 model (1 or 2).
 */
export interface GPT3Options extends GPTOptions {
	model: "gpt-3.5-turbo";
	historySize: 1 | 2;
}

/**
 * Represents options for the GPT-4 model.
 *
 * @interface GPT4Options
 * @extends GPTOptions
 * @property {"gpt-4"} model - The GPT-4 model name.
 * @property {1 | 2 | 3 | 4} historySize - The history size for GPT-4 model (1, 2, 3, or 4).
 */
export interface GPT4Options extends GPTOptions {
	model: "gpt-4";
	historySize: 1 | 2 | 3 | 4;
}
