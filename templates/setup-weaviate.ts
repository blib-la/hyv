import { ANSWER, createClass, DOCS, EXAMPLE, populate, SOURCE_CODE } from "../docs-gui/weaviate.js";

const refresh = true;

try {
	await createClass(EXAMPLE, refresh);
	await createClass(SOURCE_CODE, refresh);
	await createClass(ANSWER, refresh);
	await createClass(DOCS, refresh);
	await populate(refresh);
} catch (error) {
	console.log("STORE SETUP FAILED");
	console.log(error);
}
