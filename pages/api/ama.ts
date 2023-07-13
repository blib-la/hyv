import type { NextApiRequest, NextApiResponse } from "next";

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { ama } from "@/docs/agents/ama";
/* eslint-enable @typescript-eslint/ban-ts-comment */

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
	switch (request.method) {
		case "POST":
			try {
				const { question, guide, language } = request.body;
				const hyvResponse = await ama({ question, guide, language });

				response.status(200).json(hyvResponse);
			} catch (error) {
				console.log(error);
				response.status(400).send("Bad Request");
			}

			break;

		default:
			response.status(404).send("Not Found");
			break;
	}
}
