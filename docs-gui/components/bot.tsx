/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
// @ts-ignore

// @ts-ignore
import { DotLottiePlayer } from "@dotlottie/react-player";
import { Box, Card, CardContent, Checkbox, Container, Modal } from "@mui/joy";
import axios from "axios";
import { useAtom } from "jotai";

import {
	answerAtom,
	guideAtom,
	languageAtom,
	loadingAtom,
	modalAtom,
	questionAtom,
	searchAtom,
	// @ts-ignore
} from "@/docs/atoms";
// @ts-ignore
import { ChatInput } from "@/docs/components/chat-input";
// @ts-ignore
import { LanguageSelect } from "@/docs/components/language-select";
// @ts-ignore
import { SimpleMarkdown } from "@/docs/components/markdown";

/* eslint-enable @typescript-eslint/ban-ts-comment */
import "@dotlottie/react-player/dist/index.css";

interface Guide {
	_additional: {
		distance: number;
	};
	excerpt: string;
	name: string;
	title: string;
}

export function generateMarkdown(guides: Guide[]): string {
	return guides
		.map(guide => `### [${guide.title}](/${guide.name})\n\n${guide.excerpt}\n`)
		.join("\n");
}

export function Bot({
	onAnswer,
	onExpand,
	onQuestion,
}: {
	onExpand?(): void;
	onQuestion?(): void;
	onAnswer?(data: { id: string; message: Record<string, any> }): void;
}) {
	const [loading, setLoading] = useAtom(loadingAtom);

	const [question] = useAtom(questionAtom);
	const [search, setSearch] = useAtom(searchAtom);
	const [guide, setGuide] = useAtom(guideAtom);
	const [language] = useAtom(languageAtom);

	async function handleSubmit() {
		setLoading(true);

		if (onQuestion) {
			onQuestion();
		}

		try {
			const { data } = search
				? await axios.post("/api/search", {
						q: question,
				  })
				: await axios.post("/api/ama", {
						question,
						guide,
						language,
				  });
			if (onAnswer) {
				if (search) {
					onAnswer({
						id: "search",
						message: {
							answer: generateMarkdown(data),
						},
					});
				} else {
					onAnswer(data);
				}
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Box>
			<Box sx={{ maxWidth: { md: 600, lg: 600 }, mx: "auto" }}>
				<Box component="form" sx={{ p: 1 }} onSubmit={handleSubmit}>
					<ChatInput loading={loading} onSubmit={handleSubmit} onExpand={onExpand} />
					<Box mt={1} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
						<Checkbox
							name="search"
							checked={search}
							onChange={() => {
								setSearch(!search);
							}}
							label="Search"
							variant="soft"
							sx={{ color: "inherit" }}
						/>

						<Checkbox
							name="guide"
							checked={guide}
							onChange={() => {
								setGuide(!guide);
							}}
							label="Guide"
							variant="soft"
							sx={{ color: "inherit" }}
						/>

						<LanguageSelect />
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

export default function HyvSearch() {
	const [open, setOpen] = useAtom(modalAtom);
	const [answer, setAnswer] = useAtom(answerAtom);
	const [loading] = useAtom(loadingAtom);

	function handleAnswer(data) {
		setAnswer(data.message.answer);
		handleOpen();
	}

	function handleQuestion() {
		setAnswer("");
		setOpen(true);
	}

	function handleOpen() {
		setOpen(true);
	}

	function handleClose() {
		setOpen(false);
	}

	return (
		<Box>
			<Bot onAnswer={handleAnswer} onQuestion={handleQuestion} onExpand={handleOpen} />
			<Modal disableAutoFocus open={open} onClose={handleClose}>
				<Container sx={{ height: "calc(100% - 6rem)", my: "3rem" }}>
					<Card variant="plain" sx={{ boxShadow: "lg", height: "100%" }}>
						<Bot onAnswer={handleAnswer} onQuestion={handleQuestion} />
						<Box
							sx={{
								display: "flex",
								flex: 1,
								overflow: "auto",
								overscrollBehavior: "contain",
							}}
						>
							<CardContent
								sx={{
									display: "flex",
									flexDirection: "column",
									flex: 1,
									minHeight: "max-content",
								}}
							>
								{loading ? (
									<Box
										sx={{
											width: "50%",
											maxWidth: 300,
											display: "flex",
											alignItems: "center",
											m: "auto",
											bgcolor: "var(--joy-palette-background-level3)",
											borderRadius: "50%",
										}}
									>
										<DotLottiePlayer src="/lottie/Bee.lottie" autoplay loop />
									</Box>
								) : (
									<SimpleMarkdown content={answer} />
								)}
							</CardContent>
						</Box>
					</Card>
				</Container>
			</Modal>
		</Box>
	);
}
