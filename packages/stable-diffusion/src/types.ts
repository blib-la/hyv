import type { ModelMessage } from "@hyv/core";
import type { FileContentWithPath } from "@hyv/utils";

/**
 * Options for configuring the Automatic1111 process.
 */
export interface Automatic1111Options {
	enableHr?: boolean;
	denoisingStrength?: number;
	firstphaseWidth?: number;
	firstphaseHeight?: number;
	hrScale?: number;
	hrUpscaler?: string;
	hrSecondPassSteps?: number;
	hrResizeX?: number;
	hrResizeY?: number;
	prompt?: string;
	styles?: string[];
	seed?: number;
	subseed?: number;
	subseedStrength?: number;
	seedResizeFromH?: number;
	seedResizeFromW?: number;
	samplerName?: string;
	batchSize?: number;
	nIter?: number;
	steps?: number;
	cfgScale?: number;
	width?: number;
	height?: number;
	restoreFaces?: boolean;
	tiling?: boolean;
	doNotSaveSamples?: boolean;
	doNotSaveGrid?: boolean;
	negativePrompt?: string;
	eta?: number;
	sMinUncond?: number;
	sChurn?: number;
	sTmax?: number;
	sTmin?: number;
	sNoise?: number;
	overrideSettings?: object;
	overrideSettingsRestoreAfterwards?: boolean;
	samplerIndex?: string;
	scriptName?: string;
	sendImages?: boolean;
	saveImages?: boolean;
	model?: string;
}

/**
 * Represents a message with images.
 */
export interface ImageMessage extends ModelMessage {
	images: { alt?: string; path: string; prompt: string; negativePrompt?: string }[];
}

/**
 * Represents a message with files
 */
export interface FilesMessage extends ModelMessage {
	files: FileContentWithPath[];
}
