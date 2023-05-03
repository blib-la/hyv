import { ReasonableTemperature, ModelMessage, ModelAdapter } from '@hyv/core';
import { CreateImageRequest, OpenAIApi, ChatCompletionRequestMessage } from 'openai';
import { Except } from 'type-fest';

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
interface GPTOptions {
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
interface GPT3Options extends GPTOptions {
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
interface GPT4Options extends GPTOptions {
    model: "gpt-4";
    historySize: 1 | 2 | 3 | 4;
}
interface ImageMessage {
    images: [{
        path: string;
        prompt: string;
    }];
}
type DallEOptions = Except<CreateImageRequest, "prompt" | "response_format">;

declare class DallEModelAdapter<Options extends DallEOptions = DallEOptions, Message extends ModelMessage = ModelMessage> implements ModelAdapter<Message> {
    #private;
    /**
     * Creates an instance of the DallEModelAdapter class.
     *
     * @param {Options} options - The DALL-E model options.
     * @param {OpenAIApi} openai - A configured openai API instance.
     */
    constructor(options: Options, openai: OpenAIApi);
    assign(task: Message & ImageMessage): Promise<Message>;
}

/**
 * Represents a GPT model adapter that can assign tasks and move to the next task.
 *
 * @template Options - A type that extends GPTOptions.
 * @class GPTModelAdapter
 * @implements ModelAdapter<ModelMessage>
 * @property {Options} #options - The GPT model options.
 * @property {ChatCompletionRequestMessage[]} history - An array of chat completion request messages.
 */
declare class GPTModelAdapter<Options extends GPTOptions> implements ModelAdapter<ModelMessage> {
    #private;
    readonly history: ChatCompletionRequestMessage[];
    /**
     * Creates an instance of the GPTModelAdapter class.
     *
     * @param {Options} options - The GPT model options.
     * @param {OpenAIApi} openai - A configured openai API instance.
     */
    constructor(options: Options, openai: OpenAIApi);
    /**
     * Adds a message to the history.
     *
     * @private
     * @param {ChatCompletionRequestMessage} message - The message to add to the history.
     */
    private addMessageToHistory;
    /**
     * Assigns a task to the GPT model adapter and returns the result.
     *
     * @async
     * @param {ModelMessage} task - The task of type ModelMessage to assign.
     * @returns {Promise<ModelMessage>} - A Promise that resolves to the result of the assigned task.
     * @throws {Error} - If there is an error assigning the task.
     */
    assign(task: ModelMessage): Promise<ModelMessage>;
}

export { DallEModelAdapter, DallEOptions, GPT3Options, GPT4Options, GPTModelAdapter, GPTOptions, ImageMessage };
