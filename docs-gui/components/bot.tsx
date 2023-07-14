/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
// @ts-ignore

// @ts-ignore
import { DotLottiePlayer } from "@dotlottie/react-player";
import { Box, Card, CardContent, Checkbox, Container, Modal } from "@mui/joy";
import axios from "axios";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

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
import { Markdown } from "@/docs/components/markdown";

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
	onQuestion,
}: {
	onQuestion?(): void;
	onAnswer?(data: { id: string; message: Record<string, any> }): void;
}) {
	const [loading, setLoading] = useAtom(loadingAtom);
	const [question, setQuestion] = useAtom(questionAtom);
	const [search, setSearch] = useAtom(searchAtom);
	const [guide, setGuide] = useAtom(guideAtom);
	const [language, setLanguage] = useAtom(languageAtom);
	const methods = useForm<{
		question: string;
		guide: boolean;
		language: string;
		search: boolean;
	}>({
		defaultValues: { question, guide, language, search },
	});

	const onSubmit = methods.handleSubmit(
		async (formData: {
			question: string;
			guide?: boolean;
			search?: boolean;
			language: string;
		}) => {
			setLoading(true);
			setQuestion(formData.question);
			setSearch(formData.search);
			setGuide(formData.guide);
			setLanguage(formData.language);

			if (onQuestion) {
				onQuestion();
			}

			try {
				const { data } = formData.search
					? await axios.post("/api/search", {
							q: formData.question,
					  })
					: await axios.post("/api/ama", {
							question: formData.question,
							guide: formData.guide,
							language: formData.language,
					  });
				if (onAnswer) {
					if (formData.search) {
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
	);

	const { setValue } = methods;

	useEffect(() => {
		setValue("question", question);
		setValue("language", language);
		setValue("search", search);
		setValue("guide", guide);
	}, [setValue, guide, search, language, question]);

	return (
		<Box>
			<FormProvider {...methods}>
				<Box sx={{ maxWidth: { md: 600, lg: 600 }, mx: "auto" }}>
					<Box component="form" sx={{ p: 1 }} onSubmit={onSubmit}>
						<ChatInput loading={loading} onSubmit={onSubmit} />
						<Box mt={1} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
							<Controller
								name="search"
								control={methods.control}
								render={({ field: { value, ...field } }) => (
									<Checkbox
										{...field}
										checked={value}
										label="Search"
										variant="soft"
										sx={{ color: "inherit" }}
									/>
								)}
							/>
							<Controller
								name="guide"
								control={methods.control}
								render={({ field: { value, ...field } }) => (
									<Checkbox
										{...field}
										checked={value}
										label="Guide"
										variant="soft"
										sx={{ color: "inherit" }}
									/>
								)}
							/>

							<LanguageSelect />
						</Box>
					</Box>
				</Box>
			</FormProvider>
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
			<Bot onAnswer={handleAnswer} onQuestion={handleQuestion} />
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
									<Markdown content={answer} />
								)}
							</CardContent>
						</Box>
					</Card>
				</Container>
			</Modal>
		</Box>
	);
}
