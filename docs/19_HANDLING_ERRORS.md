# Handling Errors in Hyv

Handling errors correctly is crucial when building robust applications. In this guide, we will cover
how to handle errors while using Hyv.

Hyv uses promises extensively, which means most errors will be handled in the form of promise
rejections.

## Catching Errors

Any error that occurs within an asynchronous function will result in the Promise returned by that
function being rejected. Here's an example of how to handle these errors:

```typescript
try {
    const response = await agent.assign({ message: userInput });
    console.log(response.answer);
} catch (error) {
    console.error("Error:", error);
}
```

In this example, we use a `try...catch` block to handle errors. If any error occurs within the `try`
block (such as an error in the `assign` method), execution immediately moves to the `catch` block.

## Understanding Errors

The error object caught in the `catch` block will usually be an instance of `Error` or a subclass of
`Error`. This object will have a `message` property that contains a string describing the error.

Depending on the context, the error object may also have additional properties that provide more
information about what went wrong.

## Logging Errors

In the catch block, we log the error to the console. This is a basic way of handling the error. In a
real-world application, you might choose to handle it differently. For example, you could show an
error message to the user, send the error message to a logging service, or even attempt to recover
from the error if possible.

## Conclusion

Error handling is an essential part of any application. When using Hyv, be sure to wrap your code
with `try...catch` blocks to handle errors properly and ensure that your application behaves
predictably.
