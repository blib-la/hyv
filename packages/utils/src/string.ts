import humanizeString from "humanize-string";

/**
 * Minifies a template literal by removing leading and trailing whitespace.
 *
 * @param strings - The string parts of the template literal.
 * @param values - The expression values of the template literal.
 * @returns - The minified template literal.
 */
export function minify(strings: TemplateStringsArray, ...values: string[]) {
	let output = "";
	for (let i = 0; i < strings.length; i++) {
		output += strings[i].replace(/^\s+/gm, " ").replace(/\n+/g, " ");

		if (i < values.length) {
			output += values[i].replace(/\n+/g, " ");
		}
	}

	return output.replace(/\s+/gm, " ").trim();
}

export function wrapCode(code: string, language = "json") {
	return `
\`\`\`${language}
${code}
\`\`\`
`;
}

/**
 *
 * @param json - The JSON that should be converted to a string template
 */
export function createTemplateFromJSON<T extends Record<string, unknown>>(json: T) {
	return Object.entries(json)
		.map(
			([key, value]) =>
				`## ${humanizeString(key)}\n\n${
					typeof value === "object" ? wrapCode(JSON.stringify(value)) : value
				}`
		)
		.join("\n\n");
}

export function splitBy(text: string, pattern: RegExp) {
	return text
		.split(pattern)
		.map(part => part.trim())
		.filter(Boolean);
}
