import { Box, Link, List, ListItem, ListItemDecorator, Typography } from "@mui/joy";
import slugify from "@sindresorhus/slugify";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export const components = {
	h1({ children }) {
		return (
			<Typography id={slugify(String(children))} level="h1" my={2.5}>
				{children}
			</Typography>
		);
	},
	h2({ children }) {
		return (
			<Typography id={slugify(String(children))} level="h2" my={2}>
				{children}
			</Typography>
		);
	},
	h3({ children }) {
		return (
			<Typography id={slugify(String(children))} level="h3" my={1.5}>
				{children}
			</Typography>
		);
	},
	h4({ children }) {
		return (
			<Typography id={slugify(String(children))} level="h4" my={1}>
				{children}
			</Typography>
		);
	},
	h5({ children }) {
		return (
			<Typography id={slugify(String(children))} level="h5" my={1}>
				{children}
			</Typography>
		);
	},
	h6({ children }) {
		return (
			<Typography id={slugify(String(children))} level="h6" my={0.5}>
				{children}
			</Typography>
		);
	},
	p({ children }) {
		return (
			<Typography component="div" my={1}>
				{children}
			</Typography>
		);
	},
	anchor({ href, children }) {
		return (
			<Link href={href} target={href.startsWith("http") ? "_blank" : undefined}>
				{children}
			</Link>
		);
	},
	a({ href, children }) {
		return (
			<Link href={href} target={href.startsWith("http") ? "_blank" : undefined}>
				{children}
			</Link>
		);
	},
	ul({ children }) {
		return <List>{children}</List>;
	},
	ol({ children }) {
		return <List component="ol">{children}</List>;
	},
	li({ index, ordered, children }) {
		return (
			<ListItem>
				<ListItemDecorator sx={{ alignSelf: "flex-start" }}>
					{ordered ? index + 1 : "-"}
				</ListItemDecorator>
				<Box>{children}</Box>
			</ListItem>
		);
	},
	code({ inline, className, children }) {
		const match = /language-(\w+)/.exec(className || "");
		return !inline && match ? (
			<Box className="prismjs">
				<SyntaxHighlighter
					style={{}}
					language={match[1]}
					PreTag={({ children }) => <>{children}</>}
				>
					{String(children).replace(/\n$/, "")}
				</SyntaxHighlighter>
			</Box>
		) : (
			<code className={className}>{children}</code>
		);
	},
};

export interface MarkdownProps {
	content: string;
}

export function Markdown({ content }: MarkdownProps) {
	return (
		<Box
			sx={{
				width: "100%",
				"> pre": { overflow: "auto" },
			}}
		>
			<ReactMarkdown components={components as Components}>{content}</ReactMarkdown>
		</Box>
	);
}
