import { CssBaseline, GlobalStyles } from "@mui/joy";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import type { AppProps } from "next/app";
// @ts-ignore
import Head from "next/head";

// @ts-ignore
import { Layout } from "@/docs/components/layout";
/* eslint-enable @typescript-eslint/ban-ts-comment */

const theme = extendTheme({
	radius: {
		xs: "2px",
		sm: "4px",
		md: "6px",
		lg: "8px",
		xl: "12px",
	},
	colorSchemes: {
		light: {
			palette: {
				primary: {
					"50": "#fafaf9",
					"100": "#f5f5f4",
					"200": "#e7e5e4",
					"300": "#d6d3d1",
					"400": "#a8a29e",
					"500": "#78716c",
					"600": "#57534e",
					"700": "#44403c",
					"800": "#292524",
					"900": "#1c1917",
				},
			},
		},
		dark: {
			palette: {
				primary: {
					"50": "#f0fdfa",
					"100": "#ccfbf1",
					"200": "#99f6e4",
					"300": "#5eead4",
					"400": "#2dd4bf",
					"500": "#14b8a6",
					"600": "#0d9488",
					"700": "#0f766e",
					"800": "#115e59",
					"900": "#134e4a",
				},
			},
		},
	},
});

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<CssVarsProvider theme={theme} defaultMode="system">
			<CssBaseline />
			<GlobalStyles
				styles={{
					"#__next": {
						display: "contents",
					},
				}}
			/>
			<Head>
				<title>Hyv by failfa.st</title>
				<meta
					name="description"
					content="Hyv is a streamlined API for integrating and managing diverse AI models."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
				<link rel="shortcut icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
				<link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#223431" />
				<meta name="msapplication-TileColor" content="#223431" />
				<meta name="theme-color" content="#ffffff" />
			</Head>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</CssVarsProvider>
	);
}

export default MyApp;
