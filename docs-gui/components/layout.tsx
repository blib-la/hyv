import { MDXProvider } from "@mdx-js/react";
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import MenuIcon from "@mui/icons-material/Menu";
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
import Link from "next/link";
// @ts-ignore
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect } from "react";

// @ts-ignore
import { drawerAtom } from "@/docs/atoms";
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
					<Link passHref legacyBehavior href="/">
						<ListItemButton component="a">
							<Typography noWrap>Home</Typography>
						</ListItemButton>
					</Link>
				</ListItem>
			</Tooltip>
			{pages.map(page => (
				<Tooltip key={page.page} arrow disableInteractive title={page.title}>
					<ListItem>
						<Link passHref legacyBehavior href={page.name}>
							<ListItemButton component="a">
								<Typography noWrap>{page.title}</Typography>
							</ListItemButton>
						</Link>
					</ListItem>
				</Tooltip>
			))}
		</List>
	);
}

export function Layout({ children }: { children: ReactNode }) {
	const [open, setOpen] = useAtom(drawerAtom);
	const { asPath } = useRouter();

	function handleClose() {
		setOpen(false);
	}

	function handleOpen() {
		setOpen(true);
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
			</Sheet>
			<Container sx={{ mt: 4, mb: 8 }}>
				<MDXProvider components={components}>{children}</MDXProvider>
			</Container>
		</Box>
	);
}
