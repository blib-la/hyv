<h1 align="center"><big>Hyv</big></h1>

<p align="center"><img src="assets/logo.png" alt="logo" width="200"/></p>


Hyv is a modular software development library centered on AI collaboration that streamlines the development process by breaking complex tasks into manageable pieces. Its adaptable design works with various technologies, making it a versatile choice for developers. By fostering efficient task management through AI collaboration and offering extensive documentation, Hyv represents a paradigm shift in AI-assisted software development.

## Features 🌟

- 🚀 **Streamlined Task Management**: Hyv enhances your projects with efficient task distribution and coordination, simplifying resource utilization.
- 🧩 **Flexible Modular Design**: Hyv's modular architecture allows seamless integration of various sideEffects, models, and adapters, providing a customizable solution.
- 🌐 **Broad Compatibility**: Designed for various technologies, Hyv is a versatile option for developers working with diverse platforms and frameworks.
- 🌱 **Community-Driven**: Hyv is developed and maintained by a devoted community of developers, continually working to refine and extend its capabilities.

## Usage

> ⚠️ This library is currently in its test phase v0.x.x:
> 
> Please look at the [examples](examples)

```shell
npm install "@hyv/core" "@hyv/openai"
```

```typescript
import { Agent, sequence } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";

const agent = new Agent(new GPTModelAdapter(), {verbosity: 1});

try {
  await sequence({ question: "What is life?" }, [agent]);
} catch (error) {
  console.error("Error:", error);
}
```

👇 While we develop this library, have fun reading this story written by one of our Hyv authors:

<br clear="both"/>

## Beyond Horizon

<br clear="both"/>

### Chapter 1: The Departure

<br clear="both"/>
<img align="left" src="assets/story/young_astronaut.jpg" alt="Young astronaut preparing for their journey" width="256"/>

In the distant future, Earth was facing an imminent crisis. Resources were scarce, and humanity was struggling to survive. A young astronaut named Alex was chosen to embark on a thrilling interstellar journey to find a new home for humanity. With determination in their eyes, Alex stood in front of their spacecraft, knowing that the fate of their species rested on their shoulders.

As the spacecraft took off, Alex watched Earth disappear behind them, unsure if they would ever return. The journey through the cosmos was awe-inspiring, with countless stars and planets passing by the spacecraft's windows.

<br clear="both"/>

### Chapter 2: A New World

<br clear="both"/>
<img align="right" src="assets/story/alien_planet.jpg" alt="Astronaut standing on an alien planet" width="256"/>

After years of travel and facing numerous challenges along the way, Alex finally arrived at a promising planet. Stepping out of the spacecraft, they marveled at the breathtaking landscape before them. The alien planet was filled with unusual plants, towering structures, and a sky filled with unfamiliar celestial bodies.

Exploring the planet further, Alex uncovered the secrets of the universe and the potential for a new, prosperous life for humanity. With newfound hope, Alex sent a message back to Earth, sharing the coordinates of this new paradise.

As the people of Earth prepared to embark on their own journey to this new world, Alex continued to explore the planet, knowing that they had secured a brighter future for their species.
