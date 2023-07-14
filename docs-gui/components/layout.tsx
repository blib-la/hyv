import { MDXProvider } from "@mdx-js/react";
import { ClickAwayListener } from "@mui/base";
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import MenuIcon from "@mui/icons-material/Menu";
// @ts-ignore
import TocIcon from "@mui/icons-material/Toc";
import {
	Box,
	Container,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	Sheet,
	Tooltip,
	Typography,
} from "@mui/joy";
import { useAtom } from "jotai";
// @ts-ignore
import NextLink from "next/link";
// @ts-ignore
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

// @ts-ignore
import { drawerAtom, tocAtom } from "@/docs/atoms";
// @ts-ignore
import Bot from "@/docs/components/bot";
// @ts-ignore
import Drawer from "@/docs/components/drawer";
// @ts-ignore
import { components } from "@/docs/components/markdown";
// @ts-ignore
import pages from "@/docs/pages";
/* eslint-enable @typescript-eslint/ban-ts-comment */

export function Menu() {
	return (
		<List>
			<Tooltip arrow disableInteractive title="Home">
				<ListItem>
					<NextLink passHref legacyBehavior href="/">
						<ListItemButton component="a">
							<Typography noWrap>Home</Typography>
						</ListItemButton>
					</NextLink>
				</ListItem>
			</Tooltip>
			{pages.map(page => (
				<Tooltip key={page.page} arrow disableInteractive title={page.title}>
					<ListItem>
						<NextLink passHref legacyBehavior href={page.name}>
							<ListItemButton component="a">
								<Typography noWrap>{page.title}</Typography>
							</ListItemButton>
						</NextLink>
					</ListItem>
				</Tooltip>
			))}
		</List>
	);
}

export const tocComponents = {
	ul({ children }) {
		return <List size="sm">{children}</List>;
	},
	li({ children }) {
		return (
			<ListItem>
				<Box sx={{ flex: 1 }}>{children}</Box>
			</ListItem>
		);
	},
	a({ href, children }) {
		return (
			<NextLink passHref legacyBehavior href={href}>
				<ListItemButton
					component="a"
					target={href.startsWith("http") ? "_blank" : undefined}
				>
					{children}
				</ListItemButton>
			</NextLink>
		);
	},
};

export function Layout({ children }: { children: ReactNode }) {
	const [open, setOpen] = useAtom(drawerAtom);
	const [openToc, setOpenToc] = useAtom(tocAtom);
	const { asPath, pathname } = useRouter();

	const pageData = pages.find(page => `/${page.name}` === pathname);

	function handleClose() {
		setOpen(false);
	}

	function handleOpen() {
		setOpen(true);
	}

	function toggleToc() {
		setOpenToc(previousState => !previousState);
	}

	function closeToc() {
		setOpenToc(false);
	}

	useEffect(() => {
		setOpen(false);
	}, [asPath]);

	return (
		<Box>
			<Drawer title="Docs" open={open} onClose={handleClose}>
				<Menu />
			</Drawer>
			<Sheet
				variant="plain"
				color="neutral"
				sx={{
					position: "sticky",
					zIndex: 9,
					left: 0,
					top: 0,
					right: 0,
					pl: 6,
					pr: pathname === "/" ? 0 : 6,
					boxShadow: "sm",
				}}
			>
				<Bot />
				<IconButton
					aria-label="Open menu"
					variant="plain"
					sx={{ position: "fixed", top: 0, left: 0, m: 1 }}
					onClick={handleOpen}
				>
					<MenuIcon />
				</IconButton>
				{pathname !== "/" && (
					<ClickAwayListener onClickAway={closeToc}>
						<Tooltip
							open={openToc}
							color="primary"
							variant="outlined"
							title={
								<ReactMarkdown components={tocComponents as Components}>
									{pageData?.toc}
								</ReactMarkdown>
							}
							sx={{ boxShadow: "md" }}
						>
							<IconButton
								aria-label="Open table of contents"
								variant="plain"
								sx={{ position: "fixed", top: 0, right: 0, m: 1 }}
								onClick={toggleToc}
							>
								<Tooltip
									disableInteractive
									placement="left"
									title="Table of Contents"
								>
									<TocIcon />
								</Tooltip>
							</IconButton>
						</Tooltip>
					</ClickAwayListener>
				)}
			</Sheet>
			<Container sx={{ mt: 4, mb: 8 }}>
				<MDXProvider components={components}>{children}</MDXProvider>
			</Container>
		</Box>
	);
}
