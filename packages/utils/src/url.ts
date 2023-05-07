import path from "node:path";
import url from "node:url";

export function urlJoin(base: string, ...parts: string[]) {
	const url_ = new url.URL(base);
	url_.pathname = path.join(...parts);
	return url_.toString();
}
