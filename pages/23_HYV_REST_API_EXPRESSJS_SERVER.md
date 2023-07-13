# Constructing a REST API with Hyv and Express.js

## Overview

This guide provides a detailed process on how to integrate Hyv into an Express.js server by creating
a route for communicating with a Hyv agent. The guide aims to answer the following: How to set up an
Express.js server? How to create a route to interact with the Hyv agent? How to handle HTTP requests
and responses with the Hyv agent? How to start the server?

## Prerequisites

Before starting, it's crucial to have the required dependencies installed in your project. If
they're not installed yet, you can do so using the following command:

```shell
npm install express @hyv/core @hyv/openai
```

## Guide

### Creating an Agent

Begin by creating an `Agent` using the `GPTModelAdapter`. The agent will handle the conversation and
provide the primary interaction point with the Hyv library.

```typescript
import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";

const agent = new Agent(new GPTModelAdapter());
```

### Setting Up an Express Server

Next, set up your Express.js server and configure it to handle JSON payloads.

```typescript
import express from "express";

const app = express();
app.use(express.json());
```

### Creating a Route

Now, create a POST route at `/api/hyv` that interacts with the Hyv agent.

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

In this route, the user's message from the request body is extracted and passed to the Hyv agent
using the `assign` method. The response from the agent is then sent back as the JSON response of the
POST request. Error handling has also been included to improve robustness.

### Starting the Server

Lastly, start your Express.js server.

```typescript
app.listen(3000, () => console.log("Server running on port 3000"));
```

Your Express.js server is now set up and ready to listen on port 3000. It provides a `/api/hyv`
endpoint for interaction with the Hyv agent.

## Summary

The guide provides a comprehensive walkthrough for setting up a REST API with Hyv and Express.js.
The API facilitates efficient interaction with a Hyv agent via HTTP requests, enhancing the
application's overall flexibility and usability.

## Tags

Express.js, Hyv, REST API, HTTP Requests, Agent, Server Setup
