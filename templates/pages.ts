import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import slugify from "@sindresorhus/slugify";
import { globby } from "globby";
import humanizeString from "humanize-string";
import markdownToc from "markdown-toc";

function generateTS(content) {
	return `const pages = ${content};
export default pages
`;
}

try {
	const pages = await globby(["pages/*.md", "pages/*.mdx", "pages/**/*.md", "pages/**/*.mdx"], {
		cwd: process.cwd(),
	});
	const parsedPages = await Promise.all(
		pages.map(async page => {
			const { name } = path.parse(page);
			const content = await readFile(page, "utf-8");
			const toc = markdownToc(content, { firsth1: false, slugify }).content;
			return { toc, name, page, title: humanizeString(name) };
		})
	);
	console.log(parsedPages);
	await writeFile(
		path.join(process.cwd(), "docs-gui/pages.ts"),
		generateTS(JSON.stringify(parsedPages))
	);
} catch (error) {
	console.error(error);
}
