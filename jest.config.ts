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
	},
	extensionsToTreatAsEsm: [".ts"],
};

export default config;
