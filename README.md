<h1 align="center"><big>Hyv</big></h1>

<p align="center"><img src="assets/logo.png" alt="logo" width="200"/></p>

Hyv is a unique and powerful library that leverages the principles of modularity and collaboration
to streamline software development. The fundamental idea behind Hyv is simple: by breaking down
complex tasks into smaller, more manageable pieces, it is possible to create a more efficient and
effective development process.

The modular architecture of Hyv enables the seamless integration of multiple models, tools, and
adapters to work in concert, with each component performing a specific function to achieve a common
goal. This approach promotes productivity, as it allows developers to focus on smaller, more
achievable tasks, rather than being overwhelmed by a monolithic development process.

One of the key strengths of Hyv is its versatility. It can be used in a wide range of contexts, from
simple projects to large, complex applications. Additionally, Hyv is designed to be highly adaptable
and customizable, with a simple, intuitive interface that can be easily modified to meet the needs
of any development team.

At its core, Hyv represents a paradigm shift in software development, empowering developers to work
more efficiently and effectively by leveraging the power of modularity and collaboration. Whether
you are a seasoned developer or just starting out, Hyv is an essential tool for any modern
development workflow.

## Features 🌟

- 🚀 **Efficient Task Management**: Hyv empowers your projects with efficient task distribution and
  management, making it simple to utilize various resources in a coordinated manner.
- 🧩 **Modular Design**: With a modular architecture, Hyv allows you to easily plug in different
  tools, models, and adapters to fit your specific needs, offering a flexible and adaptable
  solution.
- 🌐 **Wide Compatibility**: Hyv is designed to work with various technologies, making it a
  versatile choice for developers working with different platforms and frameworks.
- 📚 **Extensive Documentation**: Hyv comes with comprehensive documentation and examples to help
  you understand its features and implement it effectively in your projects.
- 🌱 **Community-driven**: Hyv is built and maintained by a dedicated community of developers who
  are constantly working to improve and expand its capabilities.

## Usage

> ⚠️ This library has not yet been released, but it can be expected to work like this:

```shell
npm install "@hyv/core" "@hyv/openai" "@hyv/store"
```

```typescript
import { Agent, createInstruction, sprint } from "@hyv/core";
import type { ModelMessage } from "@hyv/core";
import { DallEModelAdapter, GPTModelAdapter } from "@hyv/openai";
import type { DallEOptions, GPT3Options } from "@hyv/openai";
import { createFileWriter, FSAdapter } from "@hyv/store";

const dir = "out/book";
const store = new FSAdapter(dir);
const fileWriter = createFileWriter(dir);
const book: ModelMessage & { title: string } = {
  title: "The future and beyond",
};

const author = new Agent(
  new GPTModelAdapter<GPT3Options>({
    model: "gpt-3.5-turbo",
    temperature: 0.5,
    maxTokens: 2048,
    historySize: 1,
    systemInstruction: createInstruction(
      "Scientific Author",
      "Write a story and describe required illustrations in detail",
      {
        illustrations: "string[]",
        files: [{ path: "string", content: "markdown" }],
      }
    ),
  }),
  store,
  [fileWriter]
);

const illustrator = new Agent(
  new DallEModelAdapter<DallEOptions>({
    size: "1024x1024",
    n: 1,
    systemInstruction: createInstruction("Illustrator", "Create illustrations for the chapter.", {
      files: [{ path: "string", content: "string" }],
    }),
  }),
  store,
  [fileWriter]
);

try {
  const messageId = await store.set(book);
  await sprint(messageId, [author, illustrator]);
  console.log("Done");
} catch (error) {
  console.error("Error:", error);
}
```

> While we develop this library, have fun reading this Story written by one of our Hyv Authors:

## The Future and Beyond

<img  align="left" src="assets/story/futuristic-cityscape.png" alt="logo" width="200"/>


The year is 2050, and the world has changed drastically. With the rise of technology and the
ever-growing demand for sustainability, humans have adapted to a new way of life. Cities have
transformed into towering metropolises, with skyscrapers reaching the clouds and transportation
systems that hover above the ground. The streets are clean, and the air is pure, thanks to the
advancements in renewable energy.

<br clear="left"/>
<img align="right" src="assets/story/spaceship.png" alt="logo" width="200"/>

In this new world, space travel has become a common occurrence. Spaceships regularly depart from
Earth to explore the vast expanse of the universe. Humans have even established colonies on other
planets, where they continue to push the boundaries of science and technology.

<br clear="right"/>
<img  align="left" src="assets/story/robot.png" alt="logo" width="200"/>

But it's not just humans who have evolved. Robots have become an integral part of society, with
advanced AI that can perform tasks beyond human capabilities. They work alongside humans, helping to
build and maintain the cities of the future.

As we look to the future and beyond, we can only imagine what other marvels await us. But one thing
is for sure, with our determination and ingenuity, we will continue to push the limits of what is
possible.
