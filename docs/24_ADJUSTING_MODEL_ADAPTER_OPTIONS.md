# Customizing Hyv Models and Agent Options

The Hyv library provides a set of configurations that allow you to customize the behavior of your
models and agents. This guide will cover how to adjust the options of the `GPTModelAdapter` model
and the `Agent`.

## Customizing GPTModelAdapter

The `GPTModelAdapter` class in Hyv allows you to set various properties, including the
`temperature`, `model`, `maxTokens`, `historySize`, `format`, and `systemInstruction`.

### Adjusting the Temperature

The `temperature` property controls the randomness of the model's output. A higher value increases
randomness, while a lower value makes it more deterministic. To adjust the `temperature`, you can
use the `temperature` setter in the `GPTModelAdapter` class.

```typescript
import { GPTModelAdapter } from "@hyv/openai";

// Create an instance of the GPTModelAdapter class
const gptAdapter = new GPTModelAdapter();

// Adjust the temperature of the GPT model
gptAdapter.temperature = 0.7; // Set the temperature to your desired value
```

## Customizing Agent

While the `Agent` class doesn't provide a direct method to adjust the temperature or other model
options, you can access the model instance from the agent and then set the properties.

```typescript
import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";

// Create an instance of the GPTModelAdapter class
const gptAdapter = new GPTModelAdapter();

// Create an instance of the Agent class
const agent = new Agent(gptAdapter);

// Access the model instance from the agent and set the temperature
(agent.model as GPTModelAdapter).temperature = 0.7; // Set the temperature to your desired value
```

In addition to `temperature`, you can also set the following properties:

-   `model`: The model ID (default is 'gpt-3').
-   `maxTokens`: The maximum number of tokens in the response (default is 2048).
-   `historySize`: The number of previous messages to keep in memory (default is 1).
-   `format`: The output format, which can be either 'markdown' or 'json' (default is 'markdown').
-   `systemInstruction`: An instruction that's always prepended to the message given to the model.

Adjusting these properties allows you to control the behavior of your models and agents to meet your
specific requirements.
