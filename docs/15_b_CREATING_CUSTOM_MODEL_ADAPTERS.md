# Using the Custom ModelAdapter with Hyv

In this part, we demonstrate how to utilize the `SongModelAdapter` in a larger application:

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

In this example, we use the `SongModelAdapter` to send a prompt to a song lyrics generation API. The
API will then generate a happy birthday song for John. The generated song will be printed to the
console.

Please note that this is a simplified example. Depending on your tasks' complexity and the diversity
of the model responses, you might want to implement additional error checking, task formatting, or
result processing.
