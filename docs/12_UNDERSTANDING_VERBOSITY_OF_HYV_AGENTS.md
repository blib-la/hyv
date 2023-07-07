# Understanding Verbosity in Hyv

`Verbosity` in Hyv's context is a configurable property that determines the amount of logging detail
provided by an `Agent` during its operation. You can consider it as a kind of logging level. The
verbosity level can be set when creating an instance of the `Agent` class via its options.

The verbosity level is represented as an integer, with each level providing a different degree of
logging detail:

## Verbosity Levels

-   `0`: No logging (default if no verbosity is set during agent creation)
-   `1`: Basic logging (provides a detailed display of the agent's output message)
-   `2`: Detailed logging (provides a detailed view of both the input and output messages)

## Usage

Here's an example of how to set verbosity levels during agent instantiation:

```typescript
const agent = new Agent(new GPTModelAdapter(), { verbosity: 2 });
```

In the example above, the `Agent` is created with a verbosity level of `2`, which means that it will
log detailed information about both the input messages to the agent and the output messages from the
agent.

## What gets logged?

-   **Verbosity Level 1**: When verbosity is set to `1`, the agent logs the key-value pairs in the
    output message it received after processing the task.

-   **Verbosity Level 2**: When verbosity is set to `2`, in addition to what gets logged in
    verbosity level `1`, it also logs the input message before it is processed, the modified input
    message after running the `before` function, the output message received from the model before
    running the `after` function, and the modified output message after running the `after`
    function.

## Why is Verbosity useful?

The verbosity option allows you to better understand what's happening within your `Agent` during its
operation. This can be particularly helpful when debugging your agent's behavior. By using a higher
verbosity level, you can see exactly what messages are being sent to and received from your agent,
which can help you identify any issues or misunderstandings that may arise.

Remember, verbosity levels might affect the performance of your application, especially if the
verbosity level is high (2), because it logs more information. Therefore, it is recommended to use
higher verbosity levels only during development or debugging sessions.
