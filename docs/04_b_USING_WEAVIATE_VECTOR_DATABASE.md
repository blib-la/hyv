# Setting Up a Conversational Agent with Hyv and Weaviate

## Setting up the Agent

We're going to use the `GPTModelAdapter` from `@hyv/openai` as our base model, which uses the GPT-4
version of OpenAI's language model.

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

## Handling User Interactions

We'll use the `readline` library to get user inputs from the console. The agent processes each user
message, and its response is stored as an "Answer" object in our Weaviate instance.

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

        // Keep the conversation going by calling the function again
        chat();
    });
};

// Start the conversation
chat();
```

By following these steps, you'll have a chatbot that can remember past interactions with users,
providing a more engaging and personalized experience.
