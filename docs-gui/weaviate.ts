import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { WeaviateAdapter } from "@hyv/store";
import { config } from "dotenv";
import { globby } from "globby";
import humanizeString from "humanize-string";
import { ApiKey } from "weaviate-ts-client";

config();

export const store = new WeaviateAdapter({
	scheme: "https",
	host: process.env.WEAVIATE_HOST,
	apiKey: new ApiKey(process.env.WEAVIATE_API_KEY),
	headers: { "X-OpenAI-Api-Key": process.env.OPENAI_API_KEY },
});

export const ANSWER = "Answer";
export const EXAMPLE = "Example";
export const DOCS = "Docs";
export const SOURCE_CODE = "SourceCode";

export async function createClass(className, force) {
	await store.createClass(
		{
			class: className,
			vectorizer: "text2vec-openai",
			moduleConfig: {
				"text2vec-openai": {
					model: "ada",
					modelVersion: "002",
					type: "text",
				},
			},
		},
		force
	);
}

export function getFirstH2Text(markdown: string): string | null {
	const sections = markdown.split(/^## .*/gm);
	if (sections.length > 1) {
		// We split the first '##' section by any subsequent headline
		const subSections = sections[1].split(/^#{1,6} .*/gm);
		// And return the first part, which is before the next headline
		return subSections[0].trim();
	}

	return null;
}

export async function populate(force = false) {
	// If we want to refresh (force) the new dataset, we need to populate the vector store
	if (force) {
		// Get al related documents
		const docs = await globby(
			["pages/**/*.md", "pages/*.md", "pages/**/*.mdx", "pages/*.mdx"],
			{ gitignore: true, cwd: process.cwd() }
		);

		const examples = await globby(["examples/*.ts"], { gitignore: true, cwd: process.cwd() });

		const sourceCode = await globby(
			["package.json", "**/package.json", "packages/**/*.ts", "!packages/*/dist"],
			{ ignoreFiles: ["*.d.ts", "*.js"], gitignore: true, cwd: process.cwd() }
		);

		await Promise.all([
			...docs.map(async filePath => {
				const content = await fs.readFile(filePath, "utf-8");
				const relativePath = filePath.replace(process.cwd(), "");
				const { name } = path.parse(filePath);
				return store.set(
					{
						content,
						filePath: relativePath,
						name,
						title: humanizeString(name),
						excerpt: getFirstH2Text(content),
					},
					DOCS
				);
			}),
			...examples.map(async filePath => {
				const content = await fs.readFile(filePath, "utf-8");
				const relativePath = filePath.replace(process.cwd(), "");
				return store.set({ content, filePath: relativePath }, EXAMPLE);
			}),
			...sourceCode.map(async filePath => {
				const content = await fs.readFile(filePath, "utf-8");
				const relativePath = filePath.replace(process.cwd(), "");
				return store.set({ content, filePath: relativePath }, SOURCE_CODE);
			}),
		]);
		console.log("Database has been populated");
	}
}
