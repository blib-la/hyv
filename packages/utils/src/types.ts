export interface FileContentWithPath {
	path: string;
	content: string;
}

export interface SideEffect<T = unknown> {
	prop: string;
	run(value: T): Promise<void>;
}
