import { writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { globby } from "globby";
import humanizeString from "humanize-string";

function generateTS(content) {
	return `const pages = ${content};
export default pages
`;
}

try {
	const pages = await globby(["pages/*.md", "pages/*.mdx"], { cwd: process.cwd() });
	const parsedPages = pages.map(page => {
		const parsed = path.parse(page);
		return { ...parsed, page, title: humanizeString(parsed.name) };
	});
	console.log(parsedPages);
	await writeFile(
		path.join(process.cwd(), "docs-gui/pages.ts"),
		generateTS(JSON.stringify(parsedPages))
	);
} catch (error) {
	console.error(error);
}
