# Hyv: The Hub for Your AI Models

<p align="center"><img src="assets/logo.png" alt="Hyv logo" width="200"/></p>

[![Discord](https://img.shields.io/discord/1091306623819059300?color=7289da&label=Discord&logo=discord&logoColor=fff&style=for-the-badge)](https://discord.com/invite/m3TBB9XEkb)
[![Codacy coverage](https://img.shields.io/codacy/coverage/e05334c7895344319e321c6d7bee2cf9?logo=jest&style=for-the-badge)](https://app.codacy.com/gh/failfa-st/hyv/dashboard?branch=main)
[![Codacy grade](https://img.shields.io/codacy/grade/e05334c7895344319e321c6d7bee2cf9?logo=codacy&style=for-the-badge)](https://app.codacy.com/gh/failfa-st/hyv/dashboard?branch=main)

[![@hyv/core](https://img.shields.io/npm/v/@hyv/core?style=for-the-badge&label=@hyv/core)](https://www.npmjs.com/package/@hyv/core)
[![npm](https://img.shields.io/npm/v/@hyv/utils?style=for-the-badge&label=@hyv/utils)](https://www.npmjs.com/package/@hyv/utils)
[![npm](https://img.shields.io/npm/v/@hyv/openai?style=for-the-badge&label=@hyv/openai)](https://www.npmjs.com/package/@hyv/openai)
[![npm](https://img.shields.io/npm/v/@hyv/store?style=for-the-badge&label=@hyv/store)](https://www.npmjs.com/package/@hyv/store)
[![npm](https://img.shields.io/npm/v/@hyv/stable-diffusion?style=for-the-badge&label=@hyv/stable-diffusion)](https://www.npmjs.com/package/@hyv/stable-diffusion)

## Welcome to Hyv

Hyv is a versatile library designed to streamline the integration and interaction of diverse AI
models. With a clean, intuitive, and unified API, Hyv allows developers to manage and collaborate
with various AI models effortlessly.

Get started with Hyv now:

```shell
npm i @hyv/core @hyv/openai
```

Then, provide your apiKey in a `.env` file

```shell
OPENAI_API_KEY=sk-xxxxxxxx
```

Try this simple example to experience Hyv in action:

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
const writerResult = await writer.assign({
    question: "Describe the future to an artist so that they can draw it",
});
const artistResult = await artist.assign(writerResult.message);
// Do something with the result
console.log(artistResult.message.content);
```

## Experience the Power of Hyv: Learn through Interaction in 11 Languages!

<img src="assets/hyv-docs-01.png" alt="docs screenshot of a guide" width="50%"/><img src="assets/hyv-docs-02.png" alt="docs screenshot of a guide" width="50%"/>

Dive into Hyv's universe with our interactive, multilingual docs. Powered by Hyv agents and GPT-4,
they turn learning into a dynamic experience. Understand Hyv's features by engaging with them in
real-time across 11 languages. Simple setup, profound learning. Start your journey with our
[easy setup guide](RUNNING_DOCS_LOCALLY.md) now!

## Explore Hyv

-   **[Examples](examples)**: Discover practical applications and use-cases of Hyv.
-   **[Documentation](pages)**: Dive deep into detailed guides and extensive documentation.
-   **[Lingo](https://github.com/failfa-st/lingo/)**: Enhance your usage of large language models
    with Lingo, an efficient pseudo-language.
-   **[Discord](https://discord.com/invite/m3TBB9XEkb)**: Join our community, share your work, and
    learn from others.

## Why Choose Hyv?

Hyv is an all-in-one solution for developers:

-   **Streamlined Task Management**: Handle complex tasks involving multiple AI models seamlessly.
-   **Flexible, Plug-and-play Architecture**: Integrate Hyv into any tech stack with ease. Adapt it
    to your specific needs.
-   **Broad Compatibility**: Hyv supports diverse AI models, offering limitless possibilities.

Embrace the future with Hyv today!
