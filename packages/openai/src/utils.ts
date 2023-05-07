import { minify } from "@hyv/utils";

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
export function createInstruction<T extends Record<string, unknown>>(
	role: string,
	tasks: string,
	format: T
) {
	return minify`
		You are a ${role}${maybePeriod(role)}
		Your tasks: ${tasks}${maybePeriod(tasks)}
		You NEVER explain or add notes.
		ALL content will be inserted in JSON.
		You EXCLUSIVELY communicate **valid JSON**.
		**You answer EXCLUSIVELY!!! as valid  JSON in this Format**:
		${JSON.stringify(format)}
	`;
}
