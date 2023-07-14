import path from "path";

import { writeFile } from "../fs.js";
import { createFileWriter } from "../side-effects.js";

jest.mock("../fs.js", () => ({
	writeFile: jest.fn(),
}));

describe("createFileWriter", () => {
	const mockedWriteFile = writeFile as jest.MockedFunction<typeof writeFile>;

	beforeEach(() => {
		mockedWriteFile.mockClear();
	});

	it('returns a side effect object with a "files" property and a run function', () => {
		const fileWriter = createFileWriter("some/directory");
		expect(fileWriter).toHaveProperty("prop", "files");
		expect(fileWriter).toHaveProperty("run");
		expect(typeof fileWriter.run).toBe("function");
	});

	it("calls writeFile with correct parameters when run is invoked", async () => {
		const files = [
			{ path: "file1.txt", content: "content1" },
			{ path: "file2.txt", content: "content2" },
		];

		const fileWriter = createFileWriter("some/directory");
		await fileWriter.run(files);

		expect(mockedWriteFile).toHaveBeenCalledTimes(files.length);
		expect(mockedWriteFile).toHaveBeenNthCalledWith(
			1,
			path.join("some/directory", files[0].path),
			files[0].content,
			"utf-8"
		);
		expect(mockedWriteFile).toHaveBeenNthCalledWith(
			2,
			path.join("some/directory", files[1].path),
			files[1].content,
			"utf-8"
		);
	});
});
