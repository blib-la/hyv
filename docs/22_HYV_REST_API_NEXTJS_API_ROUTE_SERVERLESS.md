# Setting Up a Serverless REST API with Next.js and Hyv

This guide will take you through the process of establishing a serverless function in Next.js for
creating a REST API using the Hyv library. The REST API allows the interaction with a Hyv agent
using HTTP requests.

## Prerequisites

````
Before starting, ensure you have the necessary dependencies installed in your project. If not, you
can install them with the following command:

```shell
npm install next react react-dom @hyv/core @hyv/openai
```

## Creating an Agent

Start by creating an `Agent` using the `GPTModelAdapter`. The agent will handle the conversation and
provide the main interaction point with the Hyv library.

```typescript
import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";

const agent = new Agent(new GPTModelAdapter());
```

## Setting Up a Serverless Function

Next, create a new file in the `pages/api` directory of your Next.js application. For instance,
`pages/api/hyv.ts`. This file will serve as your serverless function and be the endpoint of your
API.

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

In this function, we first verify if the incoming request is a `POST` request. If so, we pass the
user's message to the Hyv agent using the `assign` method and return the response from the agent in
JSON format. For request methods other than `POST`, we return a `405 Method Not Allowed` error.

## Utilizing the REST API

With the serverless function ready, you now have a REST API for Hyv at the `/api/hyv` endpoint. To
interact with the Hyv agent, send a `POST` request to this endpoint with a JSON body that contains
the user's message:

```json
{
    "message": "Your message here"
}
```

In response, the API will return a JSON object containing the Hyv agent's response.
````
