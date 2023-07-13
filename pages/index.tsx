/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import WarningIcon from "@mui/icons-material/Warning";
import { Alert, Box, List, ListItem, Typography } from "@mui/joy";
// @ts-ignore
import Image from "next/image";
/* eslint-enable @typescript-eslint/ban-ts-comment */

export default function Page() {
	return (
		<Box>
			<Typography level="h1" mb={2.5} sx={{ textAlign: "center" }}>
				Welcome to Hyv
			</Typography>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					mb: 4,
				}}
			>
				<Box
					sx={{
						display: "flex",
						borderRadius: "sm",
						overflow: "hidden",
					}}
				>
					<Image src="/assets/logo.png" alt="Hyv Logo" height={256} width={256} />
				</Box>
			</Box>
			<Alert
				color="warning"
				startDecorator={<WarningIcon />}
				sx={{ alignItems: "flex-start" }}
			>
				The AI helper might hallucinate from time to time.
				<br />
				To get more reliable answers, try to ask very specific questions with various
				keywords
			</Alert>
			<Typography level="h2" mt={2}>
				Example questions
			</Typography>
			<List>
				<ListItem>How can I write a custom model adapter in Hyv?</ListItem>
				<ListItem>Show me how to get started with Hyv and GPT-4?</ListItem>
				<ListItem>Give me details on creating custom personas for Hyv Agents?</ListItem>
				<ListItem>I want to create a debate between two Hyv agents with GPT-4?</ListItem>
			</List>
		</Box>
	);
}
