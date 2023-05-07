import path from "node:path";

import { writeFile } from "./fs.js";
import type { FileContentWithPath, SideEffect } from "./types.js";

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
