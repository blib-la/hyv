import type { NextApiRequest, NextApiResponse } from "next";

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { DOCS, store } from "@/docs/weaviate";
/* eslint-enable @typescript-eslint/ban-ts-comment */

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
	switch (request.method) {
		case "POST":
			try {
				const { q } = request.body;
				console.log(q);
				const { data } = await store.searchNearText(
					DOCS,
					"name title excerpt _additional {distance}",
					q,
					{
						limit: 10,
						distance: 0.27,
					}
				);
				const results = data.Get.Docs;
				response
					.status(200)
					.json(results.sort((a, b) => a._additional.distance - b._additional.distance));
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
