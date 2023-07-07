<h1 align="center">Welcome to Hyv!</h1> <p align="center"><img src="assets/logo.png" alt="logo" width="200"/></p>

[![Discord](https://img.shields.io/discord/1091306623819059300?color=7289da&label=Discord&logo=discord&logoColor=fff&style=for-the-badge)](https://discord.com/invite/m3TBB9XEkb)

## Introduction

Hyv makes the collaboration of AI models easy.

```shell
npm i @hyv/core @hyv/openai
```

```ts
import { Agent } from "@hyv/core";
import { GPTModelAdapter, DallEModelAdapter } from "@hyv/openai";

// Create two agents
const writer = new Agent(new GPTModelAdapter());
const artist = new Agent(new DallEModelAdapter());

// Assign tasks to the agents
writer
    .assign({
        question: "Describe the future to an artist so that they can draw it",
    })
    .then(({ message }) =>
        artist.assign({ images: [{ path: "the-future.png", prompt: message.answer }] })
    )
    .then(({ message }) => {
        // Do something with the result
        console.log(message.content);
    });
```

## Learn more about Hyv

-   **Examples**: Uncover practical applications of Hyv in the [examples](examples) section.
-   **Docs**: Find informative guides and documentation in our [documentation](docs) section.
-   **Lingo**: Supercharge your experience with [Lingo](https://github.com/failfa-st/lingo/), an
    efficient pseudo-language for large language models (LLMs).
-   **Discord**: Network with fellow developers and enthusiasts on our
    [Discord](https://discord.com/invite/m3TBB9XEkb) server.

---

## Key Benefits

Hyv brings a range of exciting features to accelerate your development:

-   **Effective Task Management**: Elevate your project coordination with state-of-the-art task
    management capabilities.
-   **Adaptable, Modular Design**: Incorporate Hyv effortlessly into your technology stack, thanks
    to its flexible, modular architecture.
-   **Broad Compatibility**: Leverage diverse platforms and frameworks with Hyv's wide-ranging
    compatibility.

Embrace the future of AI-driven development with Hyv!
