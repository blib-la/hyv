import process from "node:process";

import { config } from "dotenv";
import { Configuration, OpenAIApi } from "openai";

config();

export const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(configuration);
