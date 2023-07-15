// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import LinkIcon from "@mui/icons-material/Link";
import { Box, Link, List, ListItem, ListItemDecorator, Typography } from "@mui/joy";
import slugify from "@sindresorhus/slugify";
import { useAtom } from "jotai";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import NextLink from "next/link";
import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { scrollSpyAtom } from "@/docs/atoms";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useScrollSpy } from "@/docs/hooks/scroll-spy";

function SpyTypography({ children, ...props }) {
	const id = slugify(String(children));
	const ref = useRef<HTMLDivElement>(null);
	const [, setScrollSpy] = useAtom(scrollSpyAtom);
	useScrollSpy(ref);
	return (
		<Typography ref={ref} id={id} {...props}>
			{children}
			<NextLink
				shallow
				scroll={false}
				aria-label={id}
				href={`#${id}`}
				onClick={() => {
					setScrollSpy(id);
				}}
			>
				<LinkIcon sx={{ ml: 2, fontSize: "1rem" }} />
			</NextLink>
		</Typography>
	);
}

export const simpleComponents = {
	h1({ children }) {
		return (
			<Typography level="h1" my={2.5}>
				{children}
			</Typography>
		);
	},
	h2({ children }) {
		return (
			<Typography level="h2" my={2}>
				{children}
			</Typography>
		);
	},
	h3({ children }) {
		return (
			<Typography level="h3" my={1.5}>
				{children}
			</Typography>
		);
	},
	h4({ children }) {
		return (
			<Typography level="h4" my={1}>
				{children}
			</Typography>
		);
	},
	h5({ children }) {
		return (
			<Typography level="h5" my={1}>
				{children}
			</Typography>
		);
	},
	h6({ children }) {
		return (
			<Typography level="h6" my={0.5}>
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

export const components = {
	...simpleComponents,
	h1({ children }) {
		return (
			<SpyTypography level="h1" my={2.5}>
				{children}
			</SpyTypography>
		);
	},
	h2({ children }) {
		return (
			<SpyTypography level="h2" my={2}>
				{children}
			</SpyTypography>
		);
	},
	h3({ children }) {
		return (
			<SpyTypography level="h3" my={1.5}>
				{children}
			</SpyTypography>
		);
	},
	h4({ children }) {
		return (
			<SpyTypography level="h4" my={1}>
				{children}
			</SpyTypography>
		);
	},
	h5({ children }) {
		return (
			<SpyTypography level="h5" my={1}>
				{children}
			</SpyTypography>
		);
	},
	h6({ children }) {
		return (
			<SpyTypography level="h6" my={0.5}>
				{children}
			</SpyTypography>
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

export function SimpleMarkdown({ content }: MarkdownProps) {
	return (
		<Box
			sx={{
				width: "100%",
				"> pre": { overflow: "auto" },
			}}
		>
			<ReactMarkdown components={simpleComponents as Components}>{content}</ReactMarkdown>
		</Box>
	);
}
