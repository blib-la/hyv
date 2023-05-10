<h1 align="center"><big>Hyv</big></h1>

<p align="center"><img src="assets/logo.png" alt="logo" width="200"/></p>

[![Discord](https://img.shields.io/discord/1091306623819059300?color=7289da&label=Discord&logo=discord&logoColor=fff&style=for-the-badge)](https://discord.com/invite/m3TBB9XEkb)

## Introduction

Hyv is a versatile AI collaboration library designed to streamline the software development process.
It simplifies complex tasks by breaking them down into manageable pieces and can be easily
integrated with various technologies, models, and adapters.

## Exciting Features

Hyv comes packed with remarkable features to supercharge your development:

- 🎯 **Efficient Task Management**: Streamline your project coordination with top-notch task
  management capabilities.
- 🔌 **Flexible, Modular Design**: Seamlessly integrate Hyv with various technologies, courtesy of
  its adaptable, modular architecture.
- 🌍 **Wide-ranging Compatibility**: Embrace diverse platforms and frameworks with Hyv's extensive
  compatibility.
- 🤝 **Dedicated Developer Community**: Benefit from ongoing improvements thanks to a passionate
  community of developers.

## Getting Started

```shell
npm install "@hyv/core" "@hyv/openai"
```

To begin using Hyv, first install the necessary packages:

```typescript
import { Agent, sequence } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";
```

## Example 1: Basic Usage with Custom Options

Create an `Agent` with a `GPTModelAdapter`:

```typescript
const agent = new Agent(new GPTModelAdapter(), { verbosity: 1 });
```

Then, use `sequence` to execute a task with the agent

```typescript
try {
  await sequence({ question: "How can technology help solve world hunger?" }, [agent]);
} catch (error) {
  console.error("Error:", error);
}
```

## Example 2: Advanced Usage with Two Agents and Custom Options

In this example, we create two agents with custom options:

```typescript
import { createInstruction, GPTModelAdapter } from "@hyv/openai";
import { minify } from "@hyv/utils";

const customGPT4Options = {
  model: "gpt-4",
  temperature: 0.5,
  maxTokens: 512,
  historySize: 1,
};

const agents = Array.from<undefined, Agent>(
  { length: 2 },
  () =>
    new Agent(
      new GPTModelAdapter({
        ...customGPT4Options,
        systemInstruction: createInstruction(
          "AI",
          minify`
          Gather relevant data,
          analyze the data,
          and generate a task based on your analysis.
          `,
          {
            mainGoal: "={{mainGoal}}",
            data: "detailed string",
            analysis: "detailed string",
            task: "full and detailed task without references",
          }
        ),
      }),
      {
        async before({ task, mainGoal }) {
          return {
            task,
            mainGoal,
          };
        },
        verbosity: 1,
      }
    )
);
```

Execute the task sequence with the agents:

```typescript
try {
  await sequence(
    { task: "Develop a recycling program!", mainGoal: "Develop a recycling program!" },
    agents
  );
} catch (error) {
  console.error("Error:", error);
}
```

## Enrich Your Knowledge

Dive deeper into Hyv's potential and discover more with these resources:

- 💡 **Examples**: Explore practical applications of Hyv in the [examples](/examples) section.
- 📚 **Lingo**: Enhance your experience with [Lingo](https://github.com/failfa-st/lingo/), a
  powerful pseudo-language for large language models (LLMs).

## Agent API

| Option                | Type         | Description                                                                                                                                                                                      |
| --------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `model`               | ModelAdapter | The model instance used by the agent.                                                                                                                                                            |
| `options`             | AgentOptions | Configuration options for the agent.                                                                                                                                                             |
| `options.before`      | Function     | An optional asynchronous function executed before the task is processed. Receives the task and should return an object containing the updated task.                                              |
| `options.after`       | Function     | An optional asynchronous function executed after the task is processed. Receives the task and should return an object containing the updated task.                                               |
| `options.finally`     | Function     | An optional asynchronous function executed when the process is done. Receives the messageId and the processed message, and should return the messageId.                                          |
| `options.sideEffects` | Array        | An optional array of side effect functions to be executed during the task processing.                                                                                                            |
| `options.store`       | StoreAdapter | The store that should be used to save and retrieve messages.                                                                                                                                     |
| `options.verbosity`   | Number       | An optional verbosity level (0, 1, or 2) that determines the amount of information displayed during the task processing. Higher values result in more information being displayed. Default is 0. |

## GPTModelAdapter API

| Name              | Type                      | Description                                                                                                        |
| ----------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| model             | GPTModel                  | The model name. Compatible GPT models: "gpt-3.5-turbo" or "gpt-4".                                                 |
| temperature       | ReasonableTemperature     | The temperature value controlling the randomness of the model's output. Range: 0 to 0.9 with increments of 0.1.    |
| maxTokens         | number                    | The maximum number of tokens in the output response.                                                               |
| historySize       | ModelHistorySize\[Model\] | The number of chat messages to maintain in history. GPT-3 history size: 1 or 2; GPT-4 history size: 1, 2, 3, or 4. |
| systemInstruction | string                    | An initial system instruction to guide the model's behavior.                                                       |

For GPT3 specific options:

| Name        | Type            | Description                              |
| ----------- | --------------- | ---------------------------------------- |
| model       | "gpt-3.5-turbo" | GPT-3 model name.                        |
| historySize | GPT3HistorySize | GPT-3 valid history size values: 1 or 2. |

For GPT4 specific options:

| Name        | Type            | Description                                     |
| ----------- | --------------- | ----------------------------------------------- |
| model       | "gpt-4"         | GPT-4 model name.                               |
| historySize | GPT4HistorySize | GPT-4 valid history size values: 1, 2, 3, or 4. |

## Join Our Community

Become a part of the thriving Hyv community and help us shape its future:

- 🎉 **Discord**: Connect with fellow developers and enthusiasts on our
  [Discord](https://discord.com/invite/m3TBB9XEkb) server.

---

👇 While we develop this library, have fun reading this story
[suggested, written and illustrated by three Hyv agents](examples/auto-book.ts):

Reading time: 3 minutes

## The Enigmatic Hourglass

written by Morgan Casey Patel

In a realm where magic flowed through every leaf and stone, there lived a young adventurer named
Alaric. One day, while exploring the ancient ruins deep within the Enchanted Forest, Alaric stumbled
upon a mysterious hourglass.

<br clear="both"/><img align="left" src="assets/story/enigmatic_hourglass_discovery.jpg" alt="An adventurer discovering an hourglass in ancient ruins." width="256"/>

The hourglass was filled with shimmering golden sand, and as Alaric held it in his hands, he felt a
surge of power coursing through him. He soon discovered that this magical hourglass had the power to
control time.

<br clear="both"/><img align="right" src="assets/story/enigmatic_hourglass_power.jpg" alt="The protagonist using the magical hourglass to control time." width="256"/>

With the hourglass in his possession, Alaric embarked on a thrilling adventure, using its power to
solve problems and overcome obstacles. He turned back time to undo mistakes, paused time to think
through difficult situations, and even sped time up to hasten the growth of magical plants.

Yet, as Alaric continued to wield the hourglass, he realized that his actions were causing
unintended consequences. The natural flow of time was disrupted, and the balance of the world began
to crumble. Creatures of the forest aged rapidly or reverted to infancy, and the once lush
vegetation withered or grew uncontrollably.

Realizing the damage his actions had caused, Alaric sought the guidance of the wise Oracle, who
lived in a hidden cave beneath a waterfall. The Oracle told Alaric that the hourglass was not meant
to be used by mortals, and that he must return it to its resting place and restore the balance of
time.

Determined to right his wrongs, Alaric embarked on a quest to find the hourglass's original resting
place. Along the way, he encountered many challenges, such as solving riddles, battling magical
beasts, and navigating treacherous terrain. However, instead of relying on the hourglass's power,
Alaric learned to trust his own instincts and resourcefulness.

Finally, Alaric reached the heart of the Enchanted Forest, where he found a hidden pedestal bathed
in a beam of moonlight. He placed the hourglass upon the pedestal, and as the sands within it began
to flow naturally once more, the world around him started to heal.

<br clear="both"/><img align="left" src="assets/story/enigmatic_hourglass_conclusion.jpg" alt="The protagonist returning the hourglass to its resting place." width="256"/>

With the balance of time restored, Alaric vowed never to tamper with the natural flow of time again.
He had learned that every moment, whether joyful or challenging, was a precious gift, and that the
true magic of life lay in embracing the passage of time as it unfolded.

From that day forward, Alaric continued his adventures, growing wiser and more courageous with each
passing moment. And as he journeyed through the magical realm, the Enigmatic Hourglass remained a
reminder of the lessons he had learned and the importance of living in harmony with the
ever-changing flow of time.
