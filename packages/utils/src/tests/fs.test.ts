import fs from "node:fs/promises";
import path from "node:path";

import { exists, writeFile } from "../fs.js";

jest.mock("node:fs/promises", () => ({
	access: jest.fn(),
	mkdir: jest.fn(),
	writeFile: jest.fn(),
}));

describe("exists", () => {
	it("returns true when the file exists", async () => {
		(fs.access as jest.MockedFunction<typeof fs.access>).mockResolvedValue();
		const result = await exists("path/to/existing/file");
		expect(result).toBe(true);
	});

	it("returns false when the file does not exist", async () => {
		(fs.access as jest.MockedFunction<typeof fs.access>).mockRejectedValue(
			new Error("ENOENT: no such file or directory, access 'path/to/non-existing/file'")
		);
		const result = await exists("path/to/non-existing/file");
		expect(result).toBe(false);
	});

	it("returns false when the path is not accessible due to other reasons", async () => {
		(fs.access as jest.MockedFunction<typeof fs.access>).mockRejectedValue(
			new Error("EACCES: permission denied, access 'path/to/inaccessible/file'")
		);
		const result = await exists("path/to/inaccessible/file");
		expect(result).toBe(false);
	});
});

describe("writeFile", () => {
	const mockedFsMkdir = fs.mkdir as jest.MockedFunction<typeof fs.mkdir>;
	const mockedFsWriteFile = fs.writeFile as jest.MockedFunction<typeof fs.writeFile>;

	beforeEach(() => {
		mockedFsMkdir.mockClear();
		mockedFsWriteFile.mockClear();
	});

	it("writes content to a file in an existing directory", async () => {
		(fs.access as jest.MockedFunction<typeof fs.access>).mockResolvedValue();
		await writeFile("path/to/existing/file", "content");
		expect(mockedFsMkdir).not.toHaveBeenCalled();
		expect(mockedFsWriteFile).toHaveBeenCalledWith("path/to/existing/file", "content", {
			encoding: "utf8",
		});
	});

	it("creates a directory and writes content to a file when the directory does not exist", async () => {
		(fs.access as jest.MockedFunction<typeof fs.access>).mockRejectedValue(
			new Error("ENOENT: no such file or directory, access 'path/to/non-existing/file'")
		);
		await writeFile("path/to/new/file", "content");
		expect(mockedFsMkdir).toHaveBeenCalledWith(path.dirname("path/to/new/file"), {
			recursive: true,
		});
		expect(mockedFsWriteFile).toHaveBeenCalledWith("path/to/new/file", "content", {
			encoding: "utf8",
		});
	});

	it("throws an error when the file cannot be written", async () => {
		(fs.access as jest.MockedFunction<typeof fs.access>).mockResolvedValue();
		mockedFsWriteFile.mockRejectedValueOnce(new Error("Cannot write file"));
		await expect(writeFile("path/to/existing/file", "content")).rejects.toThrowError(
			"Error writing file at path 'path/to/existing/file': Cannot write file"
		);
	});
});
