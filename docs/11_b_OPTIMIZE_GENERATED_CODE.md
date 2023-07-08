# Using Multiple Agents in Hyv for Code Optimization

Now that we have set up our agents in Guide 1, we will use these agents to generate and optimize
code in this part of the guide.

## Assigning Tasks to Agents and Optimize the Output

Assign a task to the `developer` agent and then pass its output to the `optimizer` agent.

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
given boilerplate. The `optimizer` agent then reviews and optimizes the code produced by the
`developer`. The optimizer's `sideEffects` option is set to extract and log the code.

Congratulations! You've now learned how to use multiple agents in Hyv to improve the quality of your
generated code. This approach ensures that the final code output is reviewed, refined, and
optimized.
