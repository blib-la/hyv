import { getInitColorSchemeScript } from "@mui/joy/styles";
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import Document, { Head, Html, Main, NextScript } from "next/document";
/* eslint-enable @typescript-eslint/ban-ts-comment */

export default class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head />
				<body>
					{getInitColorSchemeScript()}
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
