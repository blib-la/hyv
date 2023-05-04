import process from "node:process";

import { config } from "dotenv";
import { Configuration, OpenAIApi } from "openai";

config();

export const defaultOpenAI = new OpenAIApi(
	new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	})
);
