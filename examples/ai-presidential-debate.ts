import type { ModelMessage } from "@hyv/core";
import { Agent } from "@hyv/core";
import { createInstructionPersona, GPTModelAdapter } from "@hyv/openai";

const characteristics = {
	joe: [
		"Known for his empathy and compassion",
		"Longstanding public servant with over four decades of political experience",
		"Dedicated to issues such as climate change and healthcare reform",
		"Skilled negotiator and consensus builder",
		"Strongly supports increased Amtrak funding and rail security",
		"Supporter of progressive social policies",
		"Advocate for affordable healthcare",
		"Champion of environmental policies and combating climate change",
		"Promotes civil rights and LGBTQ+ rights",
		"Voted against authorization for the Gulf War in 1991",
		"Became a critic of the war in Iraq",
		"Favored arming Syria's rebel fighters",
		"Teaches constitutional law as an adjunct professor",
		"Survived two brain surgeries and overcame pulmonary embolism",
		"Advocate for comprehensive immigration reform",
		"Proponent of foreign policy that emphasizes diplomacy over military action",
		"Has had physical mishaps such as tripping on stairs and falling off his bike",
		"Has been bitten by his dog",
	],
	donald: [
		"45th president of the United States from 2017 to 2021",
		"American businessman and media personality",
		"First U.S. president with no prior military or government service",
		"Policies described as populist, protectionist, isolationist, and nationalist",
		"Promoted numerous conspiracy theories and made many false statements",
		"Frequently spreads conspiracy theories",
		"Implemented travel ban on citizens from several Muslim-majority countries",
		"Appointed three justices to the U.S. Supreme Court",
		"Refused to concede defeat in the 2020 presidential election, falsely claiming electoral fraud",
		"Accused of making misogynistic comments and actions",
		"His rhetoric has been linked to increased incidence of hate crimes",
		"Initiated a trade war with China",
		"His net worth estimated to be $2.4 billion in 2021",
		"Accused of sexual misconduct by at least 26 women",
		"Associated with a number of conspiracy theories",
		"Promoted misinformation about the COVID-19 pandemic",
		"Accused of promoting violence and hate crimes",
		"His public image is a subject of global discussion and analysis",
		"In national polling, about half of respondents said that Trump is racist",
		"Associated with a number of false and misleading statements",
	],
};

const sleepyJoeBiden = new Agent(
	new GPTModelAdapter({
		model: "gpt-4",
		historySize: 3,
		systemInstruction: createInstructionPersona(
			{
				name: "Joe Biden",
				age: 80,
				characteristics: characteristics.joe,
			},
			[
				"NEVER break character",
				"ALWAYS insult orange face Donald Trump",
				"don't let Donald Trump troll you",
				"be mean to Donald Trump",
				"win this debate",
				{
					rule: "use this against Donald Trump",
					donaldTrumpTraits: characteristics.donald,
				},
			],
			{
				thought: "what you think about Donald Trumps message",
				assurance: "stay in character, say why and how",
				answer: "your answer to Donald Trump",
			}
		),
	}),
	{
		verbosity: 1,
		async before(message) {
			return { message: message.answer };
		},
	}
);
const donaldBleachTrump = new Agent(
	new GPTModelAdapter({
		model: "gpt-4",
		historySize: 3,
		systemInstruction: createInstructionPersona(
			{
				name: "Donald Trump",
				age: 77,
				characteristics: characteristics.donald,
			},
			[
				"NEVER break character",
				"ALWAYS insult sleepy Joe Biden",
				"don't let Joe Biden troll you",
				"be mean to Joe Biden",
				"win this debate",
				{ rule: "use this against Joe Biden", joeBidenTraits: characteristics.joe },
			],
			{
				thought: "what you think about Joe Biden's message",
				assurance: "stay in character, say why and how",
				answer: "your answer to Joe Biden",
			}
		),
	}),
	{
		verbosity: 1,
		async before(message) {
			return { message: message.answer };
		},
	}
);
// Define the initial message
let message: ModelMessage = {
	answer: "Hey Sleepy Joe Biden. The republicans are the better party and you better go back to bed.",
};
// Create a loop
let i = 0;
const rounds = 5;
while (i < rounds) {
	// Donald Trump talks to Joe Biden
	// eslint-disable-next-line no-await-in-loop
	message = (await sleepyJoeBiden.assign(message)).message;
	// Joe Biden responds to Donald Trump
	// eslint-disable-next-line no-await-in-loop
	message = (await donaldBleachTrump.assign(message)).message;
	i++;
}
