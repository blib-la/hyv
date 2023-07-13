/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import SendIcon from "@mui/icons-material/Send";
import { CircularProgress, IconButton, Textarea } from "@mui/joy";
import { useFormContext } from "react-hook-form";
/* eslint-enable @typescript-eslint/ban-ts-comment */

export interface ChatInputProps {
	loading: boolean;

	onSubmit(): void;
}

export function ChatInput({ loading, onSubmit }: ChatInputProps) {
	const { register } = useFormContext();
	return (
		<Textarea
			{...register("question", { required: true })}
			placeholder="How can I get started with Hyv and gpt-4?"
			aria-label="Write your question and press Enter to sumbit"
			minRows={1}
			maxRows={8}
			variant="soft"
			onKeyDown={event => {
				if (event.key === "Enter" && !event.shiftKey) {
					event.preventDefault();
					if (!loading) {
						onSubmit();
					}
				}
			}}
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
			sx={{
				width: "100%",
				".MuiTextarea-endDecorator": {
					position: "absolute",
					bottom: 4,
					right: -4,
				},
				".MuiTextarea-textarea": {
					pr: 5,
				},
			}}
		/>
	);
}
