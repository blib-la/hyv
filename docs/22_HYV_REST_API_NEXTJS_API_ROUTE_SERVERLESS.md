# Establishing a Serverless REST API with Hyv and Next.js

## Overview

This guide provides step-by-step instructions on how to set up a serverless function using Next.js
to create a REST API with Hyv. It aims to answer questions such as: How to set up a serverless
function in a Next.js application? How to handle different HTTP requests in the serverless function?
How to use the created REST API to interact with the Hyv agent?

## Prerequisites

Ensure you have Next.js, React, and Hyv libraries installed in your project. If they are not
installed, you can do so using the following command:

```shell
npm install next react react-dom @hyv/core @hyv/openai
```

## Guide

### Creating an Agent

Begin by creating an `Agent` using the `GPTModelAdapter`. The agent handles the conversation and
provides the main interaction point with the Hyv library.

```typescript
import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";

const agent = new Agent(new GPTModelAdapter());
```

### Setting Up a Serverless Function

Next, create a serverless function which will be the endpoint of your API. This file should be in
the `pages/api` directory of your Next.js application, for example, `pages/api/hyv.ts`.

```typescript
import { NextApiRequest, NextApiResponse } from "next";
import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";

const agent = new Agent(new GPTModelAdapter());

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const response = await agent.assign({ message: req.body.message });
        res.status(200).json(response);
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
```

In this function, we verify if the incoming request is a `POST` request. If it is, we pass the
user's message to the Hyv agent using the `assign` method and return the response from the agent in
JSON format. For any other request methods, a `405 Method Not Allowed` error is returned.

### Utilizing the REST API

With the serverless function ready, a REST API is set up at the `/api/hyv` endpoint. To interact
with the Hyv agent, send a `POST` request to this endpoint with a JSON body containing the user's
message:

```json
{
    "message": "Your message here"
}
```

In response, the API returns a JSON object containing the Hyv agent's response.

## Summary

The guide provides a comprehensive procedure for creating a serverless REST API using Next.js and
Hyv. It allows for efficient interaction with a Hyv agent using HTTP requests, enhancing the
flexibility and usability of your application.

## Tags

Next.js, Hyv, REST API, Serverless Function, Agent, HTTP Requests
