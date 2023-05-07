// Rollup.config.js
import dts from "rollup-plugin-dts";
import { swc } from "rollup-plugin-swc3";

export default [
	{
		input: "src/index.ts",
		output: {
			file: "dist/index.js",
			format: "es",
		},
		plugins: [
			swc({
				tsconfig: "tsconfig.production.json",
			}),
		],
	},
	{
		input: "src/index.ts",
		output: {
			file: "dist/index.d.ts",
			format: "es",
		},
		plugins: [dts()],
	},
];
