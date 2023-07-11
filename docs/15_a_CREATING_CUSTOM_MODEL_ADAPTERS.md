# Developing a Custom ModelAdapter with the Hyv Library

## Overview

This guide's primary purpose is to instruct you on building a custom `ModelAdapter` within the Hyv
library for a fictitious AI model that generates songs, referred to as the `SongModelAdapter`. This
guide will address questions such as: How to outline the interaction with a specific AI model? How
to create and assign tasks to the `ModelAdapter`?

## Prerequisites

To execute this guide successfully, you must have a basic understanding of Typescript and the Hyv
library. Tools and installations required include Typescript, a text editor (like VSCode), and the
necessary libraries such as axios and decamelize-keys.

## Guide

### Initializing the SongModelAdapter

We'll start by importing the necessary modules and defining the song options for our adapter. We
create a `SongOptions` type to outline the necessary parameters (`model`, `rootUrl`,
`endpointBase`), and an instance of the `SongModelAdapter` class.

```typescript
import type { ModelAdapter, ModelMessage } from "@hyv/core";
import { urlJoin } from "@hyv/utils";
import axios from "axios";
import decamelizeKeys from "decamelize-keys";

type SongOptions = {
    model: string;
    rootUrl: string;
    endpointBase: string;
};

export class SongModelAdapter implements ModelAdapter<ModelMessage, ModelMessage> {
    private _options: SongOptions;

    constructor(options: SongOptions) {
        this._options = options;
    }
}
```

### Task Assignment to the SongModelAdapter

Next, we create the `assign` method. This method is asynchronous and accepts a `task` parameter,
which it assigns to the `SongModelAdapter`. If successful, it returns the result of the assigned
task, but if there's an error, it throws an exception.

```typescript
export class SongModelAdapter implements ModelAdapter<ModelMessage, ModelMessage> {
    async assign(task: ModelMessage): Promise<ModelMessage> {
        try {
            const response = await axios.post<{ song: string }>(
                urlJoin(this._options.rootUrl, this._options.endpointBase),
                {
                    model: this._options.model,
                    prompt: task.task,
                }
            );

            return { result: response.data.song };
        } catch (error) {
            throw new Error(`Error assigning task in SongModelAdapter: ${error.message}`);
        }
    }
}
```

The `assign` method sends a POST request to a custom API endpoint that generates songs using a
specific AI model. The task's content serves as the `prompt` and the chosen `model`. Finally, the
generated song is returned as the task result.

## Summary

In this guide, we have walked through the process of creating a custom `ModelAdapter` with the Hyv
library. We created an adapter for an imaginary AI model that generates songs, and we outlined how
to initialize it and assign tasks. With this foundation, you can expand this concept to create
`ModelAdapters` for other AI models as well.

## Tags

Hyv, ModelAdapter, Custom ModelAdapter, AI model, SongModelAdapter, TypeScript, axios
