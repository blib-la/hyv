/**
 * Basic file with path and content
 */
export interface FileContentWithPath {
	path: string;
	content: string;
}

/**
 * A side effect object with a property and a run function
 */
export interface SideEffect<T = unknown> {
	prop: string;
	run(value: T): Promise<void>;
}
