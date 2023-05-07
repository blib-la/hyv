import fs from "node:fs/promises";
import path from "node:path";

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
