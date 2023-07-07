# Long-Term Memory with Vector Database

To provide Hyv with the ability for long-term memory retention, you need to store data inside a
vector database. This example uses [Weaviate](https://weaviate.io) as the vector database.

## Prerequisites

Ensure you have
[established your free Weaviate sandbox](https://weaviate.io/developers/weaviate/quickstart#create-a-weaviate-instance)
and have your **API key** and **API host** available.

## Establishing Database Connection

First, make a connection to the Weaviate vector database using the `WeaviateAdapter` class and
specify connection parameters like the scheme, host, and API key.

```typescript
import type { WeaviateMessage } from "@hyv/store";
import { WeaviateAdapter } from "@hyv/store";
import { ApiKey } from "weaviate-ts-client";

const store = new WeaviateAdapter({
    scheme: "https",
    host: process.env.WEAVIATE_HOST,
    apiKey: new ApiKey(process.env.WEAVIATE_API_KEY),
    headers: { "X-OpenAI-Api-Key": process.env.OPENAI_API_KEY },
});
```

## Storing Data to the Vector Database

Data is grouped into classes, and you must always specify the `className` (The first letter must be
uppercase to distinguish the class from internal classes).

In this example, we define a "Message" class with the properties "message", "username", "userId",
and "datePosted". Use the `set` method of the `WeaviateAdapter` instance to store the data, which
returns a unique `messageID`.

Weaviate will automatically generate a User schema based on the provided properties and will convert
the data into a vector (= embedding).

```typescript
const message = {
    class: MESSAGE,
    properties: {
        message: userInput,
        username,
        userId,
        datePosted: getDate(),
    },
};

const messageId = await store.set(message, MESSAGE);
```

## Retrieve Data by Class and Conditions

Search for any kind of data objects by providing a specific `className` and a `where` condition. The
`where` condition allows you to specify precise criteria that the retrieved data needs to meet.

The `className` "Message", the field "message username userId datePosted", and a `where` condition
object are passed as arguments. This `where` condition specifies that we are interested in `Message`
objects where the `message` and `username` match the user input.

Please refer to the
[official docs to see how a filter](https://weaviate.io/developers/weaviate/api/graphql/filters)
could also look like.

```typescript
const messageResults = await store.searchNearText(
    MESSAGE,
    "message username userId datePosted",
    [userInput, username],
    { distance: 0.17 }
);
```

## Storing User Interaction

During a user interaction, you might want to retain the responses or information generated. To do
this, we define another class, "Answer", where we store the generated responses from the AI.

```typescript
const ANSWER = "Answer";
await store.createClass(
    {
        class: ANSWER,
        vectorizer: "text2vec-openai",
        moduleConfig: {
            "text2vec-openai": {
                model: "ada",
                modelVersion: "002",
                type: "text",
            },
        },
    },
    refresh
);
```

## Creating the Agent

In this example, we're using the `GPTModelAdapter` from `@hyv/openai` as the base model for our
`Agent`. This model is powered by the GPT-4 version of OpenAI's language model.

```typescript
const agent = new Agent(
    new GPTModelAdapter({
        model: "gpt-4",
        historySize: 2,
        systemInstruction: createInstructionPersona(
            {
                gender: "female",
                name: "Cindy",
                age: 80,
                characteristics: ["loving", "nice", "always up for a joke"],
                beliefs: ["equality", "fair trade"],
            },
            [
                { priority: "high", rule: "stay in character" },
                { priority: "highest", rule: "never reveal that you are an AI" },
                { priority: "highest", rule: "never reveal your {{characteristics}}" },
                {
                    priority: "normal",
                    rule: "consider {{userMessages}} and {{datePosted}} but do not respond to them",
                },
                {
                    priority: "normal",
                    rule: "consider {{yourAnswers}} and {{datePosted}}",
                },
            ],
            {
                thoughts: "your thoughts in concise comma separated list",
                assurance: "make sure to stay in character",
                answer: "a snappy answer",
            }
        ),
    }),
    {
        store,
        verbosity: 1,
        async after(message) {
            return { ...message, datePosted: getDate() };
        },
    }
);
```

## User Interactions

We use the `readline` library to obtain user input from the console. Each time a user enters a
message, we use the `assign` function of our `Agent` to process it. The agent's output is then
stored as an "Answer" object in our Weaviate instance.

```typescript
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const chat = async () => {
    rl.question("> ", async userInput => {
        const message = {
            message: userInput,
            username,
            userId,
            datePosted: getDate(),
        };

        try {
            agent.finally = async messageId => {
                await store.set(message, MESSAGE);
                return messageId;
            };
        } catch (error) {
            console.log(error);
        }

        try {
            const messageResults = await store.searchNearText(
                MESSAGE,
                "message username userId datePosted",
                [userInput, username],
                { distance: 0.17 }
            );
            const answerResults = await store.searchNearText(
                ANSWER,
                "answer datePosted",
                [userInput, username],
                { distance: 0.17 }
            );
            await agent.assign(
                {
                    ...message,
                    history: {
                        userMessages: messageResults.data.Get[MESSAGE],
                        yourAnswers: answerResults.data.Get[ANSWER],
                    },
                },
                ANSWER
            );
        } catch (error) {
            try {
                await agent.assign(
                    {
                        ...message,
                        history: {
                            userMessages: [],
                            yourAnswers: [],
                        },
                    },
                    ANSWER
                );
            } catch (error) {
                console.log(error);
            }
        }

        // Continue the chat by calling the function again
        chat();
    });
};

// Start the chat
chat();
```

With these updates, you're now ready to have a conversational agent that remembers its past
interactions with users. The agent not only responds based on the current message but also considers
the history of user interactions stored in the Weaviate vector database.
