# Setting Up a REST API with Express.js and Hyv

This guide demonstrates how to integrate Hyv into an Express.js server by creating a route that
interacts with a Hyv agent. This setup enables your application to communicate with a Hyv agent via
HTTP requests.

## Prerequisites

Before starting, ensure you have the necessary dependencies installed in your project. If not, you
can install them with the following command:

```shell
npm install express @hyv/core @hyv/openai
```

## Creating an Agent

Start by creating an `Agent` using the `GPTModelAdapter`. The agent will handle the conversation and
provide the main interaction point with the Hyv library.

```typescript
import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";

const agent = new Agent(new GPTModelAdapter());
```

## Setting Up an Express Server

Next, set up your Express server and configure it to handle JSON payloads:

```typescript
import express from "express";

const app = express();
app.use(express.json());
```

## Creating a Route

Now create a POST route at `/api/hyv` that will interact with the Hyv agent:

```typescript
app.post("/api/hyv", async (req, res) => {
    try {
        const response = await agent.assign({ message: req.body.message });
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: "Error processing request" });
    }
});
```

In this route, we extract the user's message from the request body and pass it to the Hyv agent
using the `assign` method. The agent's response is then sent back as the JSON response of the POST
request. Error handling is also added for improved robustness.

## Starting the Server

Finally, start your Express server:

```typescript
app.listen(3000, () => console.log("Server running on port 3000"));
```

Your Express server is now set up and listens on port 3000. It exposes a `/api/hyv` endpoint that
can be used to interact with the Hyv agent.
