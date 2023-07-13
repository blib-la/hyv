import { Avatar, ListItemDecorator, Option, Select } from "@mui/joy";
import type { ChangeEvent, SyntheticEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import FlagCn from "@/docs/components/flags/cn";
// @ts-ignore
import FlagCz from "@/docs/components/flags/cz";
// @ts-ignore
import FlagDe from "@/docs/components/flags/de";
// @ts-ignore
import FlagEs from "@/docs/components/flags/es";
// @ts-ignore
import FlagFr from "@/docs/components/flags/fr";
// @ts-ignore
import FlagIt from "@/docs/components/flags/it";
// @ts-ignore
import FlagJp from "@/docs/components/flags/jp";
// @ts-ignore
import FlagNl from "@/docs/components/flags/nl";
// @ts-ignore
import FlagPirate from "@/docs/components/flags/pirate";
// @ts-ignore
import FlagPl from "@/docs/components/flags/pl";
// @ts-ignore
import FlagPt from "@/docs/components/flags/pt";
// @ts-ignore
import FlagUs from "@/docs/components/flags/us";
/* eslint-enable @typescript-eslint/ban-ts-comment */

const options = [
	{ id: "en-US", value: "english", flag: <FlagUs />, label: "English" },
	{ id: "de-DE", value: "german", flag: <FlagDe />, label: "Deutsch" },
	{ id: "es-ES", value: "spanish", flag: <FlagEs />, label: "Español" },
	{ id: "pt-PT", value: "portugese", flag: <FlagPt />, label: "Português" },
	{ id: "it-IT", value: "italian", flag: <FlagIt />, label: "Italiano" },
	{ id: "fr-FR", value: "french", flag: <FlagFr />, label: "Français" },
	{ id: "nl-NL", value: "dutch", flag: <FlagNl />, label: "Nederlands" },
	{ id: "pl-PL", value: "polish", flag: <FlagPl />, label: "Polski" },
	{ id: "cs-CZ", value: "czech", flag: <FlagCz />, label: "Čeština" },
	{ id: "zh-CN", value: "chinese", flag: <FlagCn />, label: "中文" },
	{ id: "ja-JP", value: "japanese", flag: <FlagJp />, label: "日本語" },
	{ id: "en-pirate", value: "pirate", flag: <FlagPirate />, label: "Pirate" },
];

export function LanguageSelect() {
	const { control } = useFormContext();
	return (
		<Controller
			name="language"
			control={control}
			render={({ field: { onChange, ...field } }) => (
				<Select
					{...field}
					aria-label="Select a language"
					variant="soft"
					sx={{ flex: 1 }}
					onChange={(event: SyntheticEvent, value) => {
						onChange({
							target: { value },
						} as ChangeEvent<HTMLSelectElement>);
					}}
				>
					{options.map(option => (
						<Option key={option.id} value={option.value}>
							<ListItemDecorator>
								<Avatar variant="outlined" size="sm">
									{option.flag}
								</Avatar>
							</ListItemDecorator>
							{option.label}
						</Option>
					))}
				</Select>
			)}
		/>
	);
}
