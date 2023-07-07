# Guide to Improving Generated Code with Multiple Agents in Hyv

Hyv allows the use of multiple agents to improve the quality of generated code. One agent can
generate the initial code, and another can optimize it. The following steps demonstrate how to
achieve this using Hyv, based on a code-improving scenario:

## Step 1: Import the Necessary Modules

First, you need to import the necessary modules.

```typescript
import { inspect } from "node:util";
import { Agent } from "@hyv/core";
import { createInstructionTemplate, GPTModelAdapter } from "@hyv/openai";
import { extractCode, minify } from "@hyv/utils";
```

## Step 2: Create the Developer and Optimizer Agents

Create two agents, `developer` and `optimizer`, each with its own `GPTModelAdapter` that contains a
specific system instruction.

```typescript
const developer = new Agent(
    new GPTModelAdapter({
        maxTokens: 2048,
        model: "gpt-4",
        systemInstruction: createInstructionTemplate(
            "expert JavaScript Developer, expert Canvas2D Developer, **performance expert**",
            minify`
			Achieve the {{goal}}.
			Use the {{boilerplate}}.
			`,
            {
                thoughts: "elaborative thoughts",
                code: "valid JavaScript",
            }
        ),
    }),
    { verbosity: 1 }
);

const optimizer = new Agent(
    new GPTModelAdapter({
        maxTokens: 2048,
        model: "gpt-4",
        systemInstruction: createInstructionTemplate(
            "expert JavaScript Developer, expert Canvas2D Developer, **performance expert**",
            minify`
			Review the {{code}}.
			Look for potential errors and fix them.
			Optimize the {{code}} as needed.
			`,
            {
                review: "elaborative review and critique",
                code: "valid JavaScript (original or optimized)",
            }
        ),
    }),
    {
        verbosity: 1,
        sideEffects: [
            {
                prop: "code",
                async run(value: string) {
                    const { code } = extractCode(value);
                    console.log("SIDE EFFECT");
                    console.log(code);
                },
            },
        ],
    }
);
```

The `developer` agent's task is to achieve the specified goal using a given boilerplate. Meanwhile,
the `optimizer` agent's job is to review the code produced by the `developer` agent, identify
potential errors, and optimize the code as needed.

## Step 3: Assign Tasks to Agents and Optimize the Output

Finally, you can assign a task to the `developer` agent and then pass its output to the `optimizer`
agent.

```typescript
try {
    const raw = await developer.assign({
        goal: "The matrix code",
        boilerplate: minify`
		const canvas = document.getElementById("canvas");
		const ctx = canvas.getContext("2d");

		function setCanvasSize() {
		  canvas.width = window.innerWidth * devicePixelRatio;
		  canvas.height = window.innerHeight * devicePixelRatio;
		}

		setCanvasSize();
		window.addEventListener("resize", setCanvasSize, {passive: true});
		`,
    });
    await optimizer.do(raw.id);
} catch (error) {
    console.error("Error:", error);
}
```

In the given example, the `developer` agent is assigned a task to create "The matrix code" using a
given boilerplate. The `optimizer` agent is then used to review and optimize the code produced by
the `developer` agent. The optimizer's `sideEffects` option is set to extract and log the code.

And that's it! You have successfully created and used multiple agents with Hyv to improve the
quality of generated code. This approach ensures that the final code output is reviewed, refined,
and optimized.
