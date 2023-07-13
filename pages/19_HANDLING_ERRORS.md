# Proper Error Handling in Hyv

## Overview

In this guide, we delve into the importance of error handling in Hyv and illustrate how to manage
errors correctly. It addresses key questions such as: How are errors typically presented in Hyv? How
can you catch and log these errors? What information does a Hyv error usually contain?

## Prerequisites

Knowledge of JavaScript or TypeScript, with a basic understanding of Promises and asynchronous
programming. Familiarity with Hyv and its core operations is beneficial.

## Guide

### Recognizing Hyv's Error Pattern

Hyv extensively employs Promises, leading to most errors being delivered as promise rejections.

```typescript
const response = await agent.assign({ message: userInput });
```

### Catching Errors

To handle these errors, enclose your Hyv operations within a `try...catch` block. Any error
occurring within the `try` block (e.g., an error from the `assign` method) results in immediate
execution shift to the `catch` block.

```typescript
try {
    const response = await agent.assign({ message: userInput });
    console.log(response.answer);
} catch (error) {
    console.error("Error:", error);
}
```

### Understanding Errors

Typically, the caught error object in the `catch` block is an `Error` instance or a subclass
thereof. This object has a `message` property encapsulating a string that describes the error.
Depending on the error context, there may be additional properties providing further error details.

### Logging Errors

In the `catch` block, we log the error to the console, providing a basic error handling approach. In
more complex applications, you could display an error message to the user, forward the error message
to a logging service, or attempt error recovery.

## Summary

Correct error handling is vital for any robust application. With Hyv, you should surround your code
with `try...catch` blocks to manage errors effectively and maintain predictable application
behavior.

## Tags

Hyv, JavaScript, TypeScript, Error Handling, Promises, Asynchronous Programming, try-catch
