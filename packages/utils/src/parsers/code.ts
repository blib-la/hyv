interface CodeExtraction {
	language?: string;
	code: string;
	block: boolean;
}

/**
 * Extracts the code block from a given string, if any.
 *
 * @param string - The input string to extract the code block from.
 * @returns - The extracted code block or the original string if no code block is found.
 */
export function extractCode(string: string): CodeExtraction {
	// Regular expression pattern to match code blocks enclosed in triple backticks
	const codeBlockPattern = /(`{3,})(\w*)\n([\s\S]*?)\1/g;

	// Execute the pattern to find any matches
	const matches = codeBlockPattern.exec(string);

	// If there are matches and the matches array has at least 4 elements
	// (the entire matched string, the backticks, the optional language, and the code block),
	// return the extracted code block and the language
	if (matches && matches.length >= 4) {
		return {
			language: matches[2] || undefined,
			code: matches[3],
			block: true,
		};
	}

	// If no code block is found, return the original string.
	return { code: string, block: false };
}
