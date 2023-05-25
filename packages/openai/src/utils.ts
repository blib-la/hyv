import { createTemplateFromJSON, minify } from "@hyv/utils";

/**
 * Checks a string for punctuation and adds a period if no other punctuation is present.
 *
 * @param text - The text to check for trailing punctuation.
 * @param character - The character to use if no punctuation exists.
 * @returns - The original string with an ensured punctuation
 */
export function ensurePunctuation(text: string, character = ".") {
	if (
		text.endsWith(".") ||
		text.endsWith("!") ||
		text.endsWith("?") ||
		text.endsWith(":") ||
		text.endsWith(";")
	) {
		return text;
	}

	return `${text}${character}`;
}

/**
 * Creates an instruction string for the AI agent.
 *
 * @param role - The role of the AI agent.
 * @param tasks - The tasks that the AI agent should perform.
 * @param format - The expected output format of the AI agent.
 * @returns - The formatted instruction string.
 */
export function createInstruction<T extends Record<string, unknown>>(
	role: string,
	tasks: string,
	format: T
) {
	return minify`
		You are a ${ensurePunctuation(role)}
		Your tasks: ${ensurePunctuation(tasks)}
		Strict Rules:
		NEVER explain or add notes!
		ALL content will be inserted in JSON!
		ALWAYS use \\n as new lines!
		ALWAYS follow the template!
		EXCLUSIVELY communicate **VALID JSON**!
		**answer EXCLUSIVELY as "VALID JSON" in this template Format**:
		${JSON.stringify(format)}
	`;
}

/**
 * Creates an instruction string for the AI agent.
 *
 * @param role - The role of the AI agent.
 * @param tasks - The tasks that the AI agent should perform.
 * @param format - The expected output format of the AI agent.
 * @returns - The formatted instruction string.
 */
export function createInstructionTemplate<T extends Record<string, unknown>>(
	role: string,
	tasks: string,
	format: T
) {
	return `${minify`
		You are a ${ensurePunctuation(role)}
		Your tasks: ${ensurePunctuation(tasks)}
		Answer using *valid* Markdown!
		**answer EXCLUSIVELY using the format of this TEMPLATE**:
	`}
${createTemplateFromJSON(format)}
`;
}
