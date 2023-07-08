# Executing the Agents and Checking the Output

In the final part, we'll execute the agents and generate our story and illustrations.

## Executing the Sequence

After setting up our agents, we're ready to start the sequence and generate our story:

```typescript
try {
    await sequence(
        {
            task: "provide information about the story",
            competitionRules: {
                wordCount: 500,
                chapterCount: 1,
                imageCount: 3,
                maturityRating: "G|PG|PG13",
            },
        },
        [bookAgent, author, illustrator]
    );
    console.log("Done");
} catch (error) {
    console.error("Error:", error);
}
```

## Running the Script

Save the script in a `.ts` (TypeScript) file and execute it using the `ts-node` command (install it via npm if you don't have it):

```bash
ts-node your_script_file.ts
```

## Checking the Output

Once you've run the script, check the output directory (by default, `examples/output/auto-book/`). You'll find a story authored by the `author` agent with reading time and word count added, as well as images created by the `illustrator` agent inlined in the story.

## Error Handling

If any errors occur while running the script, they'll be logged to the console, thanks to the try/catch block surrounding the sequence function.
