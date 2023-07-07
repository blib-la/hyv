# Creating a Custom ModelAdapter

## Example: SongModelAdapter

A `ModelAdapter` is an essential part of the Hyv library that dictates how to interact with a
specific AI model. This guide will walk you through creating a custom `ModelAdapter` for an
imaginary AI model that generates songs. Let's call it `SongModelAdapter`.

```typescript
import type { ModelAdapter, ModelMessage } from "@hyv/core";
import { urlJoin } from "@hyv/utils";
import axios from "axios";
import decamelizeKeys from "decamelize-keys";

// Define the song options for the adapter.
type SongOptions = {
    model: string;
    rootUrl: string;
    endpointBase: string;
};

export class SongModelAdapter implements ModelAdapter<ModelMessage, ModelMessage> {
    private _options: SongOptions;

    /**
     * Creates an instance of the SongModelAdapter class.
     *
     * @param options - The song model options.
     */
    constructor(options: SongOptions) {
        this._options = options;
    }

    /**
     * Assigns a task to the SongModelAdapter and returns the result.
     *
     * @async
     * @param task - The task to assign.
     * @returns - A Promise that resolves to the result of the assigned task.
     * @throws - If there is an error assigning the task.
     */
    async assign(task: ModelMessage): Promise<ModelMessage> {
        try {
            const response = await axios.post<{ song: string }>(
                urlJoin(this._options.rootUrl, this._options.endpointBase),
                {
                    model: this._options.model,
                    prompt: task.task,
                }
            );

            // Return the generated song as the result.
            return { result: response.data.song };
        } catch (error) {
            throw new Error(`Error assigning task in SongModelAdapter: ${error.message}`);
        }
    }
}
```

This adapter connects to a custom API endpoint that generates songs using a specific AI model. You
initialize it with a set of options (`model`, `rootUrl`, `endpointBase`). When you assign a task, it
sends a POST request to the specified API endpoint, with the task's content as the `prompt` and the
chosen `model`. The generated song is then returned as the task result.

## Using the SongModelAdapter

Here's an example of how you might use this `SongModelAdapter` in a larger application:

```typescript
import { Agent, sequence } from "@hyv/core";
import { SongModelAdapter } from "./SongModelAdapter";

const songAdapter = new SongModelAdapter({
    model: "song-lyrics-generator-v1",
    rootUrl: "http://127.0.0.1:8080",
    endpointBase: "generate",
});

const songAgent = new Agent(songAdapter);

sequence({ task: "Generate a happy birthday song for John" }, [songAgent])
    .then(console.log)
    .catch(console.error);
```

In this example, we use `SongModelAdapter` to send a prompt to a song lyrics generation API, which
will generate a happy birthday song for John. The generated song will be printed to the console.

Remember, this is a simplified example. Depending on the complexity of your tasks and the diversity
of the model responses, you might want to implement additional error checking, task formatting, or
result processing.
