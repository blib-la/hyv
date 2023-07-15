/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import FullscreenIcon from "@mui/icons-material/Fullscreen";
// @ts-ignore
import SendIcon from "@mui/icons-material/Send";
import { Box, CircularProgress, IconButton, Textarea } from "@mui/joy";
import { useAtom } from "jotai";
import { useState } from "react";

// @ts-ignore
import { questionAtom } from "@/docs/atoms";
/* eslint-enable @typescript-eslint/ban-ts-comment */

export interface ChatInputProps {
	loading: boolean;

	onSubmit(): void;
	onExpand?(): void;
}

export function ChatInput({ loading, onSubmit, onExpand }: ChatInputProps) {
	const [question, setQuestion] = useAtom(questionAtom);
	const [focus, setFocus] = useState(false);
	return (
		<Box
			sx={{
				position: "relative",
				zIndex: 2,
				height: 40,
			}}
		>
			<Textarea
				name="question"
				placeholder="How can I get started with Hyv and gpt-4?"
				aria-label="Write your question and press Enter to sumbit"
				minRows={1}
				maxRows={focus ? 20 : 1}
				variant="soft"
				value={question}
				sx={{
					width: "100%",
					"&:focus-within": { boxShadow: "md" },
					".MuiTextarea-endDecorator": {
						position: "absolute",
						bottom: 4,
						right: -4,
					},
					".MuiTextarea-startDecorator": {
						position: "absolute",
						top: 4,
						left: 8,
					},
					".MuiTextarea-textarea": {
						pr: 5,
						pl: onExpand ? 5 : undefined,
					},
				}}
				startDecorator={
					onExpand ? (
						<IconButton
							variant="solid"
							aria-label="Expand"
							onClick={() => {
								onExpand();
							}}
						>
							<FullscreenIcon />
						</IconButton>
					) : undefined
				}
				endDecorator={
					<IconButton
						disabled={loading}
						variant="solid"
						aria-label="Submit"
						tabIndex={-1}
						onClick={() => {
							onSubmit();
						}}
					>
						{loading ? <CircularProgress size="sm" /> : <SendIcon />}
					</IconButton>
				}
				onFocus={() => {
					setFocus(true);
				}}
				onBlur={() => {
					setFocus(false);
				}}
				onKeyDown={event => {
					if (event.key === "Enter" && !event.shiftKey) {
						event.preventDefault();
						if (!loading) {
							onSubmit();
						}
					}
				}}
				onChange={event => {
					setQuestion(event.target.value);
				}}
			/>
		</Box>
	);
}
