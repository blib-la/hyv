# Implementing the Custom ModelAdapter in Your Application with Hyv

## Overview

This segment demonstrates the process of incorporating the previously created `SongModelAdapter`
into a larger application. The guide will answer the question: How can the `SongModelAdapter` be
used to interact with a song lyrics generation API?

## Prerequisites

In addition to the prerequisites from the first part, you'll need a running instance of the song
lyrics generation API that the `SongModelAdapter` can connect to.

## Guide

### Incorporating the SongModelAdapter

First, we will import the necessary libraries and modules and create an instance of
`SongModelAdapter` with the required parameters. This will establish a connection to our song lyrics
generation API.

```typescript
import { Agent, sequence } from "@hyv/core";
import { SongModelAdapter } from "./SongModelAdapter";

const songAdapter = new SongModelAdapter({
    model: "song-lyrics-generator-v1",
    rootUrl: "http://127.0.0.1:8080",
    endpointBase: "generate",
});
```

### Creating an Agent and Initiating the Sequence

Now, we'll create a new `Agent` using our `songAdapter` and then initiate a sequence with a specific
task. The `Agent` will utilize the `SongModelAdapter` to send the prompt to the song lyrics
generation API, which in return, generates the desired song.

```typescript
const songAgent = new Agent(songAdapter);

sequence({ task: "Generate a happy birthday song for John" }, [songAgent])
    .then(console.log)
    .catch(console.error);
```

This example demonstrates the generation of a custom song for John. The created song is then printed
to the console.

Do note that this example is straightforward and for illustration purposes. Depending on the
complexity of your tasks and the variety in the responses from the model, you might need to
implement further error handling, task formatting, or result processing mechanisms.

## Summary

In this guide, we have illustrated the application of a custom `ModelAdapter` within a larger
project using the Hyv library. By creating a `SongModelAdapter`, we were able to generate a custom
song through a song lyrics generation API. This demonstrates how custom `ModelAdapters` can be used
effectively within your applications to communicate with AI models and produce desired outcomes.

## Tags

Hyv, ModelAdapter, Custom ModelAdapter, SongModelAdapter, AI model, Agent, sequence, TypeScript, API
interaction
