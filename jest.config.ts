/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
import type { Config } from "jest";

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
		"^@hyv/utils/(.*)$": "<rootDir>/packages/utils/src/$1",
		"^@hyv/openai/(.*)$": "<rootDir>/packages/openai/src/$1",
		"^@hyv/store/(.*)$": "<rootDir>/packages/store/src/$1",
		"^@hyv/stable-diffusion/(.*)$": "<rootDir>/packages/stable-diffusion/src/$1",
		"^@hyv/core/(.*)$": "<rootDir>/packages/core/src/$1",
	},
	extensionsToTreatAsEsm: [".ts"],
};

export default config;
