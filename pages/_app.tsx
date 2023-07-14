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
import "prism-theme-vars/base.css";

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
					":root[data-joy-color-scheme=light]": {
						"--prism-foreground": "#393a34",
						"--prism-background": "#f8f8f8",
						"--prism-comment": "#758575",
						"--prism-namespace": "#444444",
						"--prism-string": "#bc8671",
						"--prism-punctuation": "#80817d",
						"--prism-literal": "#36acaa",
						"--prism-keyword": "#248459",
						"--prism-function": "#849145",
						"--prism-deleted": "#9a050f",
						"--prism-class": "#2b91af",
						"--prism-builtin": "#800000",
						"--prism-property": "#ce9178",
						"--prism-regex": "#ad502b",
					},

					":root[data-joy-color-scheme=dark]": {
						"--prism-foreground": "#d4d4d4",
						"--prism-background": "#1e1e1e",
						"--prism-namespace": "#aaaaaa",
						"--prism-comment": "#758575",
						"--prism-string": "#ce9178",
						"--prism-punctuation": "#d4d4d4",
						"--prism-literal": "#36acaa",
						"--prism-keyword": "#38a776",
						"--prism-function": "#dcdcaa",
						"--prism-deleted": "#9a050f",
						"--prism-class": "#4ec9b0",
						"--prism-builtin": "#d16969",
						"--prism-property": "#ce9178",
						"--prism-regex": "#ad502b",
					},
					"#__next": {
						display: "contents",
					},
					".prismjs": {
						fontSize: "var(--prism-block-font-size)",
						padding: "var(--prism-block-padding-y) var(--prism-block-padding-x)",
						margin: "var(--prism-block-margin-y) var(--prism-block-margin-x)",
						borderRadius: "var(--prism-block-radius)",
						overflow: "auto",
						background: " var(--prism-background)!important",
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
