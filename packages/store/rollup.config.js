// Rollup.config.js
import dts from "rollup-plugin-dts";
import { swc } from "rollup-plugin-swc3";
export default {
	input: "src/index.ts",
	output: {
		file: "dist/index.js",
		format: "es",
	},
	plugins: [
		swc({
			// All options are optional
			include: /\.[mc]?[jt]sx?$/, // Default
			exclude: /node_modules/, // Default
			tsconfig: "tsconfig.production.json", // Default
			// tsconfig: false, // You can also prevent `rollup-plugin-swc` from reading tsconfig.json, see below
			// And add your swc configuration here!
			// "filename" will be ignored since it is handled by rollup
			jsc: {},
		}),
		dts(),
	],
};
