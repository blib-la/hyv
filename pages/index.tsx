/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import WarningIcon from "@mui/icons-material/Warning";
import { Alert, Box, List, ListItem, ListItemButton, Typography } from "@mui/joy";
import { useAtom } from "jotai";
// @ts-ignore
import Image from "next/image";

// @ts-ignore
import { questionAtom } from "@/docs/atoms";
/* eslint-enable @typescript-eslint/ban-ts-comment */

const texts = [
	"How can I write a custom model adapter in Hyv?",
	"Show me how to get started with Hyv and GPT-4",
	"Give me details on creating custom personas for Hyv agents",
	"I want to create a debate between two Hyv agents with GPT-4",
	"How can I use custom GPT functions in my Hyv agent?",
	"Explain how to use DALL-E in Hyv",
];

export default function Page() {
	const [, setQuestion] = useAtom(questionAtom);
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
				{texts.map(text => (
					<ListItem key={text}>
						<ListItemButton
							onClick={() => {
								setQuestion(text);
							}}
						>
							{text}
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);
}
