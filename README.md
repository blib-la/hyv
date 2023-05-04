<h1 align="center"><big>Hyv</big></h1>

<p align="center"><img src="assets/logo.png" alt="logo" width="200"/></p>


Hyv is a modular software development library centered on AI collaboration that streamlines the development process by breaking complex tasks into manageable pieces. Its adaptable design works with various technologies, making it a versatile choice for developers. By fostering efficient task management through AI collaboration and offering extensive documentation, Hyv represents a paradigm shift in AI-assisted software development.

## Features 🌟

- 🚀 **Streamlined Task Management**: Hyv enhances your projects with efficient task distribution and coordination, simplifying resource utilization.
- 🧩 **Flexible Modular Design**: Hyv's modular architecture allows seamless integration of various sideEffects, models, and adapters, providing a customizable solution.
- 🌐 **Broad Compatibility**: Designed for various technologies, Hyv is a versatile option for developers working with diverse platforms and frameworks.
- 🌱 **Community-Driven**: Hyv is developed and maintained by a devoted community of developers, continually working to refine and extend its capabilities.

## Usage

> ⚠️ This library is currently in its test phase v0.0.x:

```shell
npm install "@hyv/core" "@hyv/openai" "@hyv/store"
```

```typescript
import { Agent, sequence } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";

const agent = new Agent(new GPTModelAdapter());

try {
  await sequence({ question: "What is life?" }, [agent]);
} catch (error) {
  console.error("Error:", error);
}
```

👇 While we develop this library, have fun reading this story written by one of our Hyv authors:

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
