/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
import path from "node:path";

import type { Config } from "jest";
const toPath = path_ => path.join(process.cwd(), path_);

const config: Config = {
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: "./coverage",
	coverageProvider: "v8",
	coverageReporters: ["lcov", "text"],
	coveragePathIgnorePatterns: ["dist/*", "node_modules"],
	moduleFileExtensions: ["js", "mjs", "cjs", "jsx", "ts", "tsx", "json", "node"],
	transform: {
		"\\.[jt]sx?$": "@swc/jest",
	},
	transformIgnorePatterns: ["node_modules/(?!humanize-string)/"],
	moduleNameMapper: {
		"(.+)\\.js": "$1",
		"^@hyv/utils": toPath("/packages/utils/src"),
		"^@hyv/openai": toPath("/packages/openai/src"),
		"^@hyv/store": toPath("/packages/store/src"),
		"^@hyv/stable-diffusion": toPath("/packages/stable-diffusion/src"),
		"^@hyv/core": toPath("/packages/core/src"),
	},
	extensionsToTreatAsEsm: [".ts"],
};

export default config;
