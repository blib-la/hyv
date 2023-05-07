/**
 * Minifies a template literal by removing leading and trailing whitespace.
 *
 * @param {TemplateStringsArray} strings - The string parts of the template literal.
 * @param {...string[]} values - The expression values of the template literal.
 * @returns {string} - The minified template literal.
 */
export function minify(strings: TemplateStringsArray, ...values: string[]) {
	let output = "";
	for (let i = 0; i < strings.length; i++) {
		output += strings[i].replace(/^\s+/gm, "").replace(/\n+/g, " ");

		if (i < values.length) {
			output += values[i].replace(/\n+/g, " ");
		}
	}

	return output.replace(/^\s+/gm, "").trim().replace(/\s+/gm, " ").trim();
}
