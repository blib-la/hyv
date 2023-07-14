# Hyv: The Hub for Your AI Models

<p align="center"><img src="assets/logo.png" alt="Hyv logo" width="200"/></p>

[![Discord](https://img.shields.io/discord/1091306623819059300?color=7289da&label=Discord&logo=discord&logoColor=fff&style=for-the-badge)](https://discord.com/invite/m3TBB9XEkb)

## What is Hyv?

Hyv is a library designed to streamline the integration and interaction of diverse AI models. It
provides a clean, intuitive, and unified API to manage and collaborate different AI models with
ease.

Get started with Hyv now:

```shell
npm i @hyv/core @hyv/openai
```

Provide your apiKey in a `.env` file

```
OPENAI_API_KEY=sk-xxxxxxxx
```

Try this simple example to see Hyv in action:

```ts
import { Agent } from "@hyv/core";
import { GPTModelAdapter, DallEModelAdapter } from "@hyv/openai";

// Create agents
const writer = new Agent(new GPTModelAdapter());
const artist = new Agent(new DallEModelAdapter(), {
    // Preprocess the task
    async before(message) {
        return { images: [{ path: "the-future.png", prompt: message.answer }] };
    },
});

// Assign tasks
const writerResult = writer.assign({
    question: "Describe the future to an artist so that they can draw it",
});
const artistResult = artist.assign(writerResult.message);
// Do something with the result
console.log(artistResult.message.content);
```

## Running the Hyv Docs locally

> ⚠️ The AI helper might hallucinate from time to time.  
> To get more reliable answers, try to ask very specific questions with various keywords

### Prerequisites

Before proceeding, ensure you have a
[free Weaviate sandbox](https://weaviate.io/developers/weaviate/quickstart#create-a-weaviate-instance)
setup. Keep your **API key** and **API host** accessible as they will be required in the subsequent
steps.

### Provide environmental variables

Provide these variables in a `.env` file

```shell
OPENAI_API_KEY=sk-xxxxx
WEAVIATE_HOST=xxx-xxx-xxxxx.weaviate.network
WEAVIATE_API_KEY=xxxxx
```

You can run the docs in a GUI with AI support to help you understand how Hyv works.

You have the following options:

-   Search for existing docs (check "Search")
-   Get a custom guide (check "Write a guide")
-   Get an explanation (check nothing)
-   explanation & guide support various languages
    -   Not all languages offer the same quality
    -   Questions should be asked in english

```shell
# This has to be done once for a new database
# It will populate the database
npm run dev:setup-weaviate
# Run this if new pages have been added or the content changed
## It will generate data for the sidebar and TOC
npm run template:pages
# Run the dev server
npm run dev:next
```

Additionally, you run the bot in the terminal as a CLI chat

```shell
# This demo will automatically populate the database for you
npm run demo:autodocs
```

## Discover Hyv

-   **[Examples](examples)**: Browse practical applications and use-cases of Hyv.
-   **[Documentation](pages)**: Dive into detailed guides and extensive documentation.
-   **[Lingo](https://github.com/failfa-st/lingo/)**: Enhance your usage of large language models
    with Lingo, an efficient pseudo-language.
-   **[Discord](https://discord.com/invite/m3TBB9XEkb)**: Join our community, share your work, and
    learn from others.

---

## Why Choose Hyv?

Hyv offers compelling advantages for developers:

-   **Streamlined Task Management**: Handle complex tasks involving multiple AI models seamlessly.
-   **Flexible, Plug-and-play Architecture**: Integrate Hyv into any tech stack easily. Adapt it to
    your specific needs.
-   **Broad Compatibility**: Hyv supports diverse AI models. The possibilities are limitless.

Start shaping the future with Hyv today!
