# Configuring Verbosity in Hyv

## Overview

This guide explores the concept of `Verbosity` in Hyv, a configurable property influencing the
amount of detail logged by an `Agent` during operation. Questions like: How to set verbosity levels?
What each verbosity level entails? And why is verbosity useful, are answered in this guide.

## Prerequisites

Familiarity with JavaScript or TypeScript, basic understanding of Hyv's `Agent` and
`GPTModelAdapter`.

## Guide

### Understanding Verbosity Levels

Verbosity, represented as an integer, determines the level of logging detail:

-   `0`: No logging (default if not set)
-   `1`: Basic logging (detailed output message)
-   `2`: Detailed logging (input and output messages)

### Setting Verbosity Levels

Set the verbosity level when creating an `Agent` instance via its options.

```typescript
const agent = new Agent(new GPTModelAdapter(), { verbosity: 2 });
```

### Logging Details per Verbosity Level

-   **Level 1**: Logs key-value pairs in the output message received after task processing.
-   **Level 2**: Logs input message before and after processing, output message before and after
    processing, in addition to level `1` logs.

## Summary

Using the verbosity option, you can have a deeper insight into your `Agent` operation, which aids in
debugging. However, higher verbosity levels can impact application performance due to more logged
information, so it's advisable to use these during development or debugging sessions only.

## Tags

Hyv, JavaScript, TypeScript, Verbosity, Logging, Agent, GPTModelAdapter
