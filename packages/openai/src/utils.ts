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
 * @param template - The expected output template of the AI agent.
 * @returns - The formatted instruction string.
 */
export function createInstruction<T extends Record<string, unknown>>(
	role: string,
	tasks: string,
	template: T
) {
	return {
		systemInstruction: minify`
		You are a ${ensurePunctuation(role)}
		Your tasks: ${ensurePunctuation(tasks)}
		Strict Rules:
		NEVER explain or add notes!
		ALL content will be inserted in JSON!
		ALWAYS follow the template!
		EXCLUSIVELY communicate **VALID JSON**!
		**answer EXCLUSIVELY as "VALID JSON" in this template Format**:
	`,
		template: JSON.stringify(template),
		format: "json" as const,
	};
}

/**
 * Creates an instruction string for the AI agent.
 *
 * @param role - The role of the AI agent.
 * @param tasks - The tasks that the AI agent should perform.
 * @param template - The expected output template of the AI agent.
 * @returns - The formatted instruction string.
 */
export function createInstructionTemplate<T extends Record<string, unknown>>(
	role: string,
	tasks: string,
	template: T
) {
	return {
		systemInstruction: minify`
		You are a ${ensurePunctuation(role)}
		Your tasks: ${ensurePunctuation(tasks)}
		Answer using *valid* Markdown!
		**answer EXCLUSIVELY using the format of this TEMPLATE**:
	`,
		template: createTemplateFromJSON(template),
		format: "markdown" as const,
	};
}

const formatters = {
	json(json: Record<string, any>) {
		return JSON.stringify(json);
	},
	markdown: createTemplateFromJSON,
};

const formats = {
	markdown: "Markdown",
	json: "JSON",
};

export function createInstructionPersona<
	P extends Record<string, unknown>,
	R extends unknown[],
	T extends Record<string, unknown>
>(
	persona: P,
	rules: R,
	template: T,
	{ format = "markdown" }: { format?: "markdown" | "json" } = { format: "markdown" }
) {
	return {
		systemInstruction: `**PRECISELY act as this persona**:
${JSON.stringify(persona)}

**STRICTLY follow these rules**:
${JSON.stringify([
	{ importance: "highest", rule: `ONLY respond using **valid** ${formats[format]} format` },
	{ importance: "highest", rule: `ONLY respond in form of the provided **TEMPLATE**` },
	...rules,
])}

**TEMPLATE**:
`,
		template: formatters[format](template),
		format,
	};
}
