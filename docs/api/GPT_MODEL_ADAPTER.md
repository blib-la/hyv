# GPTModelAdapter API

| Name              | Type                      | Description                                                                                                        |
| ----------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| model             | GPTModel                  | The model name. Compatible GPT models: "gpt-3.5-turbo" or "gpt-4".                                                 |
| temperature       | ReasonableTemperature     | The temperature value controlling the randomness of the model's output. Range: 0 to 0.9 with increments of 0.1.    |
| maxTokens         | number                    | The maximum number of tokens in the output response.                                                               |
| historySize       | ModelHistorySize\[Model\] | The number of chat messages to maintain in history. GPT-3 history size: 1 or 2; GPT-4 history size: 1, 2, 3, or 4. |
| systemInstruction | string                    | An initial system instruction to guide the model's behavior.                                                       |

For GPT3 specific options:

| Name        | Type            | Description                              |
| ----------- | --------------- | ---------------------------------------- |
| model       | "gpt-3.5-turbo" | GPT-3 model name.                        |
| historySize | GPT3HistorySize | GPT-3 valid history size values: 1 or 2. |

For GPT4 specific options:

| Name        | Type            | Description                                     |
| ----------- | --------------- | ----------------------------------------------- |
| model       | "gpt-4"         | GPT-4 model name.                               |
| historySize | GPT4HistorySize | GPT-4 valid history size values: 1, 2, 3, or 4. |
