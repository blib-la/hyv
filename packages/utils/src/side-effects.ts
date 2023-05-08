import path from "node:path";

import { writeFile } from "./fs.js";
import type { FileContentWithPath, SideEffect } from "./types.js";

/**
 *
 * @param dir - The directory in which the files should be written
 * @param encoding - The encoding that should be used when writing files
 * @returns - A side effect object with a property and a run function
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
