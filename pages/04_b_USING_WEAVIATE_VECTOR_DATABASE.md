# Developer Guide: Establishing a Conversational Agent with Hyv and Weaviate

## Overview

This guide demonstrates how to set up a conversational agent using Hyv and Weaviate. It highlights
the process of configuring the agent and handling user interactions, eventually creating a chatbot
capable of recalling past user interactions for a personalized experience.

## Prerequisites

Before diving into this guide, ensure you're equipped with basic TypeScript knowledge and have
access to the Hyv and Weaviate libraries.

## Guide

### Configuring the Conversational Agent

Our first step involves utilizing the `GPTModelAdapter` from `@hyv/openai` as our foundation model,
specifically the GPT-4 version of OpenAI's language model.

```typescript
const agent = new Agent(
    new GPTModelAdapter({
        model: "gpt-4",
        historySize: 2,
        // Create a persona for the agent
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
        // Add the Weaviate Store here to store all responses automatically
        store,
        verbosity: 1,
        async after(message) {
            return { ...message, datePosted: getDate() };
        },
    }
);
```

### Managing User Interactions

In this step, we employ the `readline` library to obtain user inputs from the console. The agent
processes every user message, with its response being saved as an "Answer" object in our Weaviate
instance.

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
            // Get the name message and userId and date of related messages
            // This information is given to the agent as memory
            const messageResults = await store.searchNearText(
                MESSAGE,
                "message username userId datePosted",
                [userInput, username],
                // Adjust the distance and limit
                { distance: 0.17, limit: 10 }
            );
            const answerResults = await store.searchNearText(
                ANSWER,
                "answer datePosted",
                [userInput, username],
                // Adjust the distance and limit
                { distance: 0.17, limit: 10 }
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

            await store.set(message, MESSAGE);
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

        // Keep the conversation going by calling the function again
        chat();
    });
};

// Start the conversation
chat();
```

## Summary

After completing the steps mentioned in this guide, you should now have a functioning chatbot that
can recall and use past interactions to create a more engaging and personalized user experience.

## Tags

Hyv, Weaviate, Conversational Agent, Chatbot, User Interactions, GPT-4, TypeScript
