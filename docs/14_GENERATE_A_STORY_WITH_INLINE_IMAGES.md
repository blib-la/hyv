# Generating a Story with Inlined Images using Hyv, OpenAI, and Stable Diffusion

## Installing Dependencies

To begin, ensure that you have the necessary dependencies installed. You will need `@hyv/core`,
`@hyv/openai`, `@hyv/stable-diffusion` and `@hyv/utils`. To install these dependencies, run the
following command:

```shell
npm install @hyv/core @hyv/openai @hyv/stable-diffusion @hyv/utils
```

## Writing and Illustrating a Story

### Importing Modules

Start by importing all the required modules:

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

### Creating Agents and Functions

Now, define the `createFileWriterWithReadingTime` function:

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
```

We specify the output directory, and create instances of `fileWriter` and `imageWriter`:

```typescript
const dir = path.join(process.cwd(), `examples/output/auto-book/${Date.now()}`);
const fileWriter = createFileWriterWithReadingTime(dir);
const imageWriter = createFileWriter(dir, "base64");
```

Then, create the `bookAgent`:

```typescript
const bookAgent = new Agent(
    new GPTModelAdapter({
        model: "gpt-4",
        maxTokens: 1024,
        temperature: 0.9,
        systemInstruction: createInstruction(
            "Book Agent, Trend Expert",
            minify`
			Think deeply about the task,
			precisely reason your thoughts,
			critically reflect on your reasons,
			make a well defined decision based on your reflection,
			provide instructions based on your decision.
			`,
            {
                thought: "very detailed elaborative string",
                reasoning: "very detailed elaborative string",
                reflection: "very detailed elaborative string",
                potentialGenres: "string[] *>=7 (DIVERSE)",
                decision: "very detailed elaborative string",
                instructions: {
                    title: "string (UNIQUE, UNCOMMON)",
                    context: "concise string (UNIQUE, UNCOMMON, leave room for creativity)",
                    genre: "string",
                    wordCount: "{{wordCount}}:number",
                    imageCount: "{{imageCount}}:number",
                    chapterCount: "{{imageCount}}:number",
                    writingStyle: "in the style of …",
                },
            }
        ),
    }),
    {
        verbosity: 1,
    }
);
```

Define the `makeFloatingImages`, `getReadingTime`, and `getWordCount` functions:

```typescript
function makeFloatingImages(inputText: string) {
    let count = 0;
    const markdownImageRegex = /!\[(.*?)]\((.*?)(?:\s+".*?")?\)/g;
    const headingRegex = /^(#{2,6})\s+(.*)$/gm;

    // Replace markdown image syntax with HTML image tags, alternating between left and right alignment
    let replacedText = inputText.replace(markdownImageRegex, (match, alt, src) => {
        const align = ` align="${count % 2 === 0 ? "left" : "right"}"`;
        const imgTag = `\n<br clear="both"/><img${align} src="${
            // Fix potential issue where the src is not valid
            src.split(" ")[0]
        }" alt="${alt}" width="256"/>`;
        count++;
        return imgTag;
    });

    // Ensure headings are separated from images by adding line breaks and clearing floating elements
    replacedText = replacedText.replace(
        headingRegex,
        (match, hashes, headingContent) => `<br clear="both"/>\n\n${hashes} ${headingContent}`
    );

    return replacedText;
}

function getReadingTime(text: string) {
    return text.length / 1_000;
}

function getWordCount(text: string) {
    return text.split(" ").filter(Boolean).length;
}
```

Create the `author` and `illustrator` agents:

```typescript
const author = new Agent(
    new GPTModelAdapter({
        model: "gpt-4",
        maxTokens: 4096,
        temperature: 0.7,
        format: "json",
        systemInstruction: createInstruction(
            "Author named Morgan Casey Patel",
            minify`
				Follow instructions closely!
				Think deeply about the task.
				Reason your thoughts.
				Reflect on your reasons.
				Make a wise decision based on your reflection.
				Write a story and image-instructions based on your decision.
				**Acceptance Criteria**:
				1. UNIQUE, UNUSUAL, CREATIVE, LONG story!
				2. VALID Markdown with **image tags**!
				3. EXCLUSIVELY \\n for new lines in Markdown!
				4. IMPORTANT([story.md]:length(~{{wordCount}}))!
				`,
            {
                thought: "detailed string",
                reasoning: "detailed string",
                reflection: "detailed string",
                decision: "detailed string",
                images: [
                    {
                        path: "assets/story/[filename].jpg",
                        prompt: "extremely detailed and descriptive, UNIQUE, OPTIMIZE(prompt for image generator AI)",
                        negativePrompt: "keywords(comma separated, {negated: false)",
                        alt: "length:concise",
                    },
                ],
                files: [
                    {
                        path: "story.md",
                        content:
                            "format(Markdown:words(length(~{{wordCount}})).chapters(length({{chapterCount}})).images(length({{imageCount}}), {inline: true})): # {{title}} \n written by {{authorName}}",
                    },
                ],
            }
        ),
    }),
    {
        verbosity: 1,
        sideEffects: [fileWriter],
        async before(message: ModelMessage & { instructions: Record<string, unknown> }) {
            return {
                information: message.decission,
                task: "write a very long story for a writing contest",
                instructions: {
                    ...message.instructions,
                    maturityRating: "G|PG|PG13",
                },
            };
        },
        async after(message: FilesMessage) {
            return {
                ...message,
                files: message.files.map(file => ({
                    ...file,
                    readingTime: getReadingTime(file.content),
                    words: getWordCount(file.content),
                    content: makeFloatingImages(file.content),
                })),
            };
        },
    }
);

const illustrator = new Agent(
    new Automatic1111ModelAdapter({
        seed: Math.floor(Math.random() * 1_000_000) + 1,
        model: "illustration.safetensors",
        height: 512,
        width: 512,
    }),
    {
        sideEffects: [imageWriter],
        async before(message: ImageMessage): Promise<ImageMessage> {
            return {
                ...message,
                images: message.images.map(image => ({
                    ...image,
                    prompt: `${image.prompt}, sketch, draft, scribble, absurdres, 8k, partially colored`,
                    negativePrompt: `${image.negativePrompt}, worst quality, bad quality, detailed, intricate, blurry, masterpiece, watermark, signature, logo`,
                })),
            };
        },
    }
);
```

### Executing the Sequence

Finally, run the sequence:

```typescript
try {
    await sequence(
        {
            task: "provide information about the story",
            competitionRules: {
                wordCount: 500,
                chapterCount: 1,
                imageCount: 3,
                maturityRating: "G|PG|PG13",
            },
        },
        [bookAgent, author, illustrator]
    );
    console.log("Done");
} catch (error) {
    console.error("Error:", error);
}
```

## Running the Script

To run the script, save it in a `.ts` (TypeScript) file. Then, execute it using the `ts-node`
command (install it via npm if you don't have it):

```bash
ts-node your_script_file.ts
```

## Checking the Output

After running the script, check the output directory (by default, `examples/output/auto-book/`). You
will find a story authored by the `author` agent with reading time and word count added, as well as
images created by the `illustrator` agent inlined in the story.

## Error Handling

If any errors occur while running the script, they will be logged to the console thanks to the
try/catch block surrounding the sequence function.
