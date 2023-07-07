# Hyv: The Hub for Your AI Models

<p align="center"><img src="assets/logo.png" alt="Hyv logo" width="200"/></p>

[![Discord](https://img.shields.io/discord/1091306623819059300?color=7289da&label=Discord&logo=discord&logoColor=fff&style=for-the-badge)](https://discord.com/invite/m3TBB9XEkb)

## What is Hyv?

Hyv is a library designed to streamline the integration and interaction of diverse AI models. It provides a clean, intuitive, and unified API to manage and collaborate different AI models with ease.

Get started with Hyv now:
```shell
npm i @hyv/core @hyv/openai
```

Try this simple example to see Hyv in action:

```ts
import { Agent } from "@hyv/core";
import { GPTModelAdapter, DallEModelAdapter } from "@hyv/openai";

// Create agents
const writer = new Agent(new GPTModelAdapter());
const artist = new Agent(new DallEModelAdapter());

// Assign tasks
writer
    .assign({ question: "Describe the future to an artist so that they can draw it" })
    .then(({ message }) =>
        artist.assign({ images: [{ path: "the-future.png", prompt: message.answer }] })
    )
    .then(({ message }) => {
        // The result
        console.log(message.content);
    });
```

## Discover Hyv

* **[Examples](examples)**: Browse practical applications and use-cases of Hyv.
* **[Documentation](docs)**: Dive into detailed guides and extensive documentation.
* **[Lingo](https://github.com/failfa-st/lingo/)**: Enhance your usage of large language models with Lingo, an efficient pseudo-language.
* **[Discord](https://discord.com/invite/m3TBB9XEkb)**: Join our community, share your work, and learn from others.

---

## Why Choose Hyv?

Hyv offers compelling advantages for developers:

* **Streamlined Task Management**: Handle complex tasks involving multiple AI models seamlessly.
* **Flexible, Plug-and-play Architecture**: Integrate Hyv into any tech stack easily. Adapt it to your specific needs.
* **Broad Compatibility**: Hyv supports diverse AI models. The possibilities are limitless.

Start shaping the future with Hyv today!
