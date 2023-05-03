import path from "node:path";

import type { ModelMessage, Tool } from "@hyv/core";
import { writeFile } from "@hyv/core";

/**
 * Creates a file writer tool for writing output files.
 *
 * @param {string} dir - The directory where the output files should be written.
 * @param {BufferEncoding} [encoding="utf-8"] - the encoding that should vbe used when writing files
 * @returns {Tool} - The file writer tool instance.
 */
export function createFileWriter(dir: string, encoding: BufferEncoding = "utf-8"): Tool {
	return {
		prop: "files",
		async run(message: ModelMessage) {
			await Promise.all(
				message.files.map(async file =>
					writeFile(path.join(dir, "output", file.path), file.content, encoding)
				)
			);
		},
	};
}
