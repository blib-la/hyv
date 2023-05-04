import fs from "node:fs/promises";
import path from "node:path";

import type { Agent } from "./agent.js";
import { memoryStore } from "./agent.js";
import type {
	FileContentWithPath,
	ModelAdapter,
	ModelMessage,
	SideEffect,
	StoreAdapter,
} from "./types.js";

/**
 * Extracts the code block from a given string, if any.
 *
 * @param {string} string - The input string to extract the code block from.
 * @returns {string} - The extracted code block or the original string if no code block is found.
 */
export function extractCode(string: string) {
	// Regular expression pattern to match code blocks enclosed in triple backticks
	const codeBlockPattern = /(`{3,})(\w*)\n([\s\S]*?)\1/g;

	// Execute the pattern to find any matches
	const matches = codeBlockPattern.exec(string);

	// If there are matches and the matches array has at least 4 elements
	// (the entire matched string, the backticks, the optional language, and the code block),
	// return the extracted code block.
	if (matches && matches.length >= 4) {
		return matches[3];
	}

	// If no code block is found, return the original string.
	return string;
}

/**
 * Checks if a file or directory exists at the specified path.
 *
 * @async
 * @param {string} pathLike - The path to check for existence.
 * @returns {Promise<boolean>} - Resolves to true if the file or directory exists, otherwise false.
 */
export async function exists(pathLike: string) {
	try {
		await fs.access(pathLike);
		return true;
	} catch {
		return false;
	}
}

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
export async function writeFile(
	filePath: string,
	content: string,
	encoding: BufferEncoding = "utf8"
): Promise<void> {
	try {
		const { dir } = path.parse(filePath);

		// Check if the directory exists
		// If the directory does not exist, create it recursively
		if (!(await exists(dir))) {
			await fs.mkdir(dir, { recursive: true });
		}

		// Write the content to the file
		await fs.writeFile(filePath, content, { encoding });
	} catch (error) {
		throw new Error(`Error writing file at path '${filePath}': ${error.message}`);
	}
}

/**
 * Creates a file writer for writing output files.
 *
 * @param {string} dir - The directory where the output files should be written.
 * @param {BufferEncoding} [encoding="utf-8"] - the encoding that should vbe used when writing files
 * @returns {SideEffect} - The file writer instance.
 */
export function createFileWriter(
	dir: string,
	encoding: BufferEncoding = "utf-8"
): SideEffect<FileContentWithPath[]> {
	return {
		prop: "files",
		async run(files) {
			await Promise.all(
				files.map(async file =>
					writeFile(path.join(dir, file.path), file.content, encoding)
				)
			);
		},
	};
}

/**
 * Minifies a template literal by removing leading and trailing whitespace.
 *
 * @param {TemplateStringsArray} strings - The string parts of the template literal.
 * @param {...unknown[]} values - The expression values of the template literal.
 * @returns {string} - The minified template literal.
 */
export function minify(strings: TemplateStringsArray, ...values: string[]) {
	let output = "";
	for (let i = 0; i < strings.length; i++) {
		const trimmedString = strings[i].trim();
		if (trimmedString.startsWith("```")) {
			output += strings[i]; // Inside code block, preserve whitespace
		} else {
			output += strings[i].replace(/^\s+/gm, "").replace(/\n+/g, " "); // Outside code block, remove newlines
		}

		if (i < values.length) {
			const trimmedValue = values[i].trim();
			if (trimmedValue.startsWith("{") && trimmedValue.endsWith("}")) {
				output += values[i]; // Inside code block, preserve whitespace
			} else {
				output += values[i].replace(/\n+/g, " "); // Outside code block, remove newlines
			}
		}
	}

	return output.replace(/^\s+/gm, "").trim();
}

export function maybePeriod(text: string) {
	if (
		text.endsWith(".") ||
		text.endsWith("!") ||
		text.endsWith("?") ||
		text.endsWith(":") ||
		text.endsWith(";")
	) {
		return "";
	}

	return ". ";
}

/**
 * Creates an instruction string for the AI agent.
 *
 * @param {string} role - The role of the AI agent.
 * @param {string} tasks - The tasks that the AI agent should perform.
 * @param {Record<string, unknown>} format - The expected output format of the AI agent.
 * @returns {string} - The formatted instruction string.
 */
export function createInstruction(role: string, tasks: string, format: Record<string, unknown>) {
	return minify`
		You are a ${role}${maybePeriod(role)}
		Your tasks: ${tasks}${maybePeriod(tasks)}
		You NEVER explain or add notes.
		ALL content will be inserted in JSON.
		You EXCLUSIVELY communicate **valid JSON**.
		**You answer EXCLUSIVELY!!! as valid  JSON in this Format**:
		${""}
		\`\`\`json
		${JSON.stringify(format)}
		\`\`\`
	`;
}

/**
 * Runs a sequence of agents in a chain, passing the output of each agent as input to the next agent.
 * @param message
 * @param chain An array of agents to be executed in sequence.
 * @param store The store for the messages
 * @returns The final message ID produced by the last agent in the chain.
 */
export async function sequence<Store extends StoreAdapter = StoreAdapter>(
	message: ModelMessage,
	chain: Agent<ModelAdapter<ModelMessage>, Store>[],
	store = memoryStore
) {
	const featureId = await store.set(message);
	return chain.reduce(
		async (messageId, agent) => agent.do(await messageId),
		Promise.resolve(featureId)
	);
}
