# Setup for Generating a Story with Inlined Images using Hyv, OpenAI, and Stable Diffusion

## Installing Dependencies

First, make sure you have the necessary dependencies installed. You will need `@hyv/core`,
`@hyv/openai`, `@hyv/stable-diffusion`, and `@hyv/utils`. To install these dependencies, run the
following command:

```shell
npm install @hyv/core @hyv/openai @hyv/stable-diffusion @hyv/utils
```

## Importing Modules

Afterward, import all the necessary modules for our story generation task:

```typescript
import path from "node:path";
import type { ModelMessage } from "@hyv/core";
import { Agent, sequence } from "@hyv/core";
import { createInstruction, GPTModelAdapter } from "@hyv/openai";
import type { FilesMessage, ImageMessage } from "@hyv/stable-diffusion";
import { Automatic1111ModelAdapter } from "@hyv/stable-diffusion";
import { minify, createFileWriter, writeFile } from "@hyv/utils";
import type { FileContentWithPath, SideEffect } from "@hyv/utils";
```

## Creating Helper Functions

Next, create some utility functions which we'll use for writing and optimizing our story:

```typescript
export function createFileWriterWithReadingTime(
    dir: string,
    encoding: BufferEncoding = "utf-8"
): SideEffect<(FileContentWithPath & { readingTime: number })[]> {
    return {
        prop: "files",
        async run(files) {
            await Promise.all(
                files.map(async file =>
                    writeFile(
                        path.join(dir, file.path),
                        `Reading time: ${Math.round(file.readingTime * 10) / 10} minutes\n\n${
                            file.content
                        }`,
                        encoding
                    )
                )
            );
        },
    };
}

function getReadingTime(text: string) {
    return text.length / 1_000;
}

function getWordCount(text: string) {
    return text.split(" ").filter(Boolean).length;
}
```
