/**
 * Represents a model message with an optional array of files.
 * Each file has a path and content.
 *
 * @interface ModelMessage
 * @property {Array<{ path: string; content: string }>} [files] - An optional array of files.
 */
interface ModelMessage {
    files?: {
        path: string;
        content: string;
    }[];
}
/**
 * Represents a model adapter that can assign tasks and move to the next task.
 *
 * @interface ModelAdapter
 * @template Message - A type that extends ModelMessage.
 * @property {(task: Message) => Promise<Message>} assign - A function that takes a task of type Message and returns
 *   a Promise that resolves to a Message.
 */
interface ModelAdapter<Message extends ModelMessage> {
    assign(task: Message): Promise<Message>;
}
/**
 * Represents a tool with a property and a run method.
 *
 * @interface Tool
 * @property {string} prop - A string property.
 * @property {(message: ModelMessage) => Promise<void>} run - A function that takes a ModelMessage and returns
 *   a Promise that resolves to void.
 */
interface Tool {
    prop: string;
    run(message: ModelMessage): Promise<void>;
}
/**
 * Represents a reasonable temperature value.
 *
 * @typedef {0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9} ReasonableTemperature
 */
type ReasonableTemperature = 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9;
/**
 * The configuration options for an Agent.
 *
 * @template InMessage - The input message type.
 * @template OutMessage - The output message type.
 */
interface AgentOptions<InMessage extends ModelMessage = ModelMessage, OutMessage extends ModelMessage = ModelMessage> {
    /**
     * A function that transforms the input message before it is passed to the model.
     *
     * @param {InMessage} message - The input message.
     * @returns {Promise<Message>} - A Promise that resolves to the transformed message.
     */
    before?<Message>(message: InMessage): Promise<Message>;
    /**
     * A function that transforms the output message after it has been processed by the model.
     *
     * @param {OutMessage} message - The output message.
     * @returns {Promise<Message>} - A Promise that resolves to the transformed message.
     */
    after?<Message>(message: OutMessage): Promise<Message>;
    /**
     * A function that runs after the Agent has processed the output message.
     *
     * @param {string} messageId - The ID of the message that has been processed.
     * @param {OutMessage} message - The output message that has been processed.
     * @returns {Promise<string>} - A Promise that resolves to the ID of the next message to be processed.
     */
    finally?(messageId: string, message: OutMessage): Promise<string>;
    /**
     * An array of tools that the Agent can use.
     */
    tools?: Tool[];
}
/**
 * Represents a store adapter for storing and retrieving messages.
 *
 * @interface StoreAdapter
 * @property {Function} set - Stores a message and returns a Promise that resolves to the messageId.
 * @property {Function} get - Retrieves a message by messageId and returns a Promise that resolves to the message.
 */
interface StoreAdapter {
    set(message: ModelMessage): Promise<string>;
    get(messageId: string): Promise<ModelMessage>;
}

/**
 * Represents an agent that manages a model, a store, and a set of tools.
 * The agent can assign tasks, find tools, retrieve messages, and return results.
 *
 * @template Model - A type that extends ModelAdapter<ModelMessage>.
 * @template Store - A type that extends StoreAdapter.
 * @class Agent
 * @property {Model} #model - The model instance.
 * @property {Store} #store - The store instance.
 * @property {AgentOptions["tool"]} #tools - An array of tools.
 * @property {AgentOptions["before"]} #before - A function that runs before the model.
 * @property {AgentOptions["after"]} #after - A function that runs after the model.
 * @property {AgentOptions["finally"]} #finally - A function that runs when the process is done.
 * @property {Promise<ModelMessage>} #task - A task of type ModelMessage.
 */
declare class Agent<Model extends ModelAdapter<ModelMessage> = ModelAdapter<ModelMessage>, Store extends StoreAdapter = StoreAdapter> {
    #private;
    readonly before: AgentOptions["before"];
    readonly after: AgentOptions["after"];
    readonly finally: AgentOptions["finally"];
    /**
     * Creates an instance of the Agent class.
     *
     * @param {Model} model - The model instance.
     * @param {Store} store - The store instance.
     * @param {AgentOptions<ModelMessage, ModelMessage>} options - The configuration for the agent
     */
    constructor(model: Model, store: Store, options?: AgentOptions<ModelMessage, ModelMessage>);
    /**
     * Finds a tool with the specified property.
     *
     * @param {string} prop - The property to search for.
     * @returns {Tool | undefined} - The found tool or undefined if not found.
     */
    findTool(prop: string): Tool | undefined;
    /**
     * Sets the current task using the provided messageId.
     *
     * @param {string} messageId - The messageId to set the task.
     */
    set task(messageId: string);
    /**
     * Gets the result of the current task assignment.
     *
     * @returns {Promise<string>} - A Promise that resolves to the next messageId.
     */
    get result(): Promise<string>;
}

/**
 * Extracts the code block from a given string, if any.
 *
 * @param {string} string - The input string to extract the code block from.
 * @returns {string} - The extracted code block or the original string if no code block is found.
 */
declare function extractCode(string: string): string;
/**
 * Checks if a file or directory exists at the specified path.
 *
 * @async
 * @param {string} pathLike - The path to check for existence.
 * @returns {Promise<boolean>} - Resolves to true if the file or directory exists, otherwise false.
 */
declare function exists(pathLike: string): Promise<boolean>;
/**
 * Writes content to a file at the specified path.
 * If the directory does not exist, it will be created recursively.
 *
 * @async
 * @param {string} filePath - The path to the file to be written.
 * @param {string} content - The content to be written to the file.
 * @param {BufferEncoding} [encoding="utf-8"] - the encoding that should vbe used when writing files
 * @returns {Promise<void>} - Resolves when the file is successfully written, otherwise throws an error.
 */
declare function writeFile(filePath: string, content: string, encoding?: BufferEncoding): Promise<void>;
/**
 * Minifies a template literal by removing leading and trailing whitespace.
 *
 * @param {TemplateStringsArray} strings - The string parts of the template literal.
 * @param {...unknown[]} values - The expression values of the template literal.
 * @returns {string} - The minified template literal.
 */
declare function minify(strings: TemplateStringsArray, ...values: string[]): string;
declare function maybePeriod(text: string): "" | ". ";
/**
 * Creates an instruction string for the AI agent.
 *
 * @param {string} role - The role of the AI agent.
 * @param {string} tasks - The tasks that the AI agent should perform.
 * @param {Record<string, unknown>} format - The expected output format of the AI agent.
 * @returns {string} - The formatted instruction string.
 */
declare function createInstruction(role: string, tasks: string, format: Record<string, unknown>): string;
/**
 * Gets the result of an AI agent task.
 *
 * @async
 * @param {string} messageId - The messageId of the task.
 * @param {Agent} agent - The AI agent instance.
 * @returns {Promise<unknown>} - A Promise that resolves to the result of the AI agent task.
 */
declare function getResult(messageId: string, agent: Agent): Promise<string>;
/**
 * Runs a sequence of agents in a chain, passing the output of each agent as input to the next agent.
 * @param featureId The ID of the feature or story being worked on.
 * @param chain An array of agents to be executed in sequence.
 * @returns The final message ID produced by the last agent in the chain.
 */
declare function sprint<Model extends ModelAdapter<ModelMessage> = ModelAdapter<ModelMessage>, Store extends StoreAdapter = StoreAdapter>(featureId: string, chain: Agent<Model, Store>[]): Promise<string>;

export { Agent, AgentOptions, ModelAdapter, ModelMessage, ReasonableTemperature, StoreAdapter, Tool, createInstruction, exists, extractCode, getResult, maybePeriod, minify, sprint, writeFile };
