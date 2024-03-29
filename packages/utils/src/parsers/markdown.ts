import camelcase from "camelcase";

import { splitBy } from "../string.js";

export function parseMarkdown<T>(markdown: string, pattern = /^#+ /m) {
	return splitBy(markdown.trim(), pattern).reduce((previousValue, currentValue) => {
		const [key, ...lines] = currentValue.split("\n");

		return lines.length
			? {
					...previousValue,
					[camelcase(key)]: lines
						.map(line => line.trim())
						.filter(Boolean)
						.join("\n"),
			  }
			: previousValue;
	}, {}) as T;
}
