# Judging Entries and Declaring a Winner in Hyv Competitions

## Instructions for Jurors

First, we provide instructions for the jurors, detailing what is expected of them.

```typescript
const juryInstruction = createInstruction(
    "Competition Jury",
    minify`
    Do tasks. Respect rules and rating criteria.
    Think deeply, reason your thoughts, decide based on your reasoning.
    `,
    {
        thoughts: "deep thoughts",
        reason: "critical reasoning",
        decision: "detailed decision",
        winner: "name of story",
    }
);
```

## Judging the Competition Entries

Next, multiple AI agents, acting as jurors, review the entries. Each juror is assigned the
`juryInstruction` to read the stories and choose a winner:

```typescript
const votes = (await Promise.all(
    Array.from(
        { length: 3 },
        async () =>
            (
                await createAndAssign(
                    {
                        task: "Read the stories and pick a winner",
                        rules,
                        ratingCriteria,
                        stories,
                    },
                    juryInstruction
                )
            ).message.winner
    )
)) as FileContentWithPath[];
```

## Deciding the Final Winner

Finally, a separate agent, `finalJury`, counts the votes from all the jurors and declares the
winner:

```typescript
await finalJury.assign({
    task: "Count the votes and determine the winner",
    votes,
});
```

With these steps, Hyv enables you to conduct a full competition where entries are created, evaluated
by multiple jurors, and a final winner is selected based on the collective decision. Each AI agent
carries out its role following the defined instructions, ensuring a fair and systematic evaluation
process.
