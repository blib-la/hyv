# Conducting Judgement and Announcing a Winner in Hyv-based Competitions

## Overview

This guide follows up from the previous guide, "Implementing a Hyv-based Story Writing Competition".
Here, we will explain how to use Hyv to judge the competition entries and announce a winner.

## Prerequisites

You should have already completed the guide, "Implementing a Hyv-based Story Writing Competition".
Make sure you understand how to create AI agents and assign tasks to them.

## Guide

### Creating Instructions for Jurors

Firstly, define the instructions for the jurors. These instructions should clarify what is expected
of the jurors in their judgement process.

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

### Judging the Entries

Next, create multiple AI agents acting as jurors to review the competition entries. Each juror
follows the `juryInstruction` to read the stories and choose a winner.

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

### Determining the Winner

Lastly, assign another agent, `finalJury`, to count the votes from all jurors and declare the
winner.

```typescript
await finalJury.assign({
    task: "Count the votes and determine the winner",
    votes,
});
```

## Summary

By following this guide, you should now be able to conduct a complete AI-powered competition using
Hyv. We walked through the process of defining instructions for jurors, assigning agents to judge
the entries, and declaring a final winner. By leveraging AI, you can ensure a fair and systematic
evaluation process.

## Tags

hyv, competition, story-writing, gpt-4, AI-jury, AI-agent, artificial-intelligence,
content-generation
