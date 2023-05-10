# Agent API

| Option                | Type         | Description                                                                                                                                                                                      |
| --------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `model`               | ModelAdapter | The model instance used by the agent.                                                                                                                                                            |
| `options`             | AgentOptions | Configuration options for the agent.                                                                                                                                                             |
| `options.before`      | Function     | An optional asynchronous function executed before the task is processed. Receives the task and should return an object containing the updated task.                                              |
| `options.after`       | Function     | An optional asynchronous function executed after the task is processed. Receives the task and should return an object containing the updated task.                                               |
| `options.finally`     | Function     | An optional asynchronous function executed when the process is done. Receives the messageId and the processed message, and should return the messageId.                                          |
| `options.sideEffects` | Array        | An optional array of side effect functions to be executed during the task processing.                                                                                                            |
| `options.store`       | StoreAdapter | The store that should be used to save and retrieve messages.                                                                                                                                     |
| `options.verbosity`   | Number       | An optional verbosity level (0, 1, or 2) that determines the amount of information displayed during the task processing. Higher values result in more information being displayed. Default is 0. |
