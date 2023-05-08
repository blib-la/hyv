import path from "node:path";
import url from "node:url";

/**
 * Join a path using internal utils. (similar to path join, but for URLs
 * @param base - The url base
 * @param parts - Several strings that should be combined as a path
 */
export function urlJoin(base: string, ...parts: string[]) {
	const url_ = new url.URL(base);
	url_.pathname = path.join(...parts);
	return url_.toString();
}
