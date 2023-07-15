## Running the Hyv Docs Locally

Hyv Docs can be run locally to provide an interactive GUI for a deeper understanding of how Hyv
works. Here's how you can set it up:

> ⚠️ Keep in mind, the AI helper may occasionally hallucinate. To get more reliable answers,
> consider asking very specific questions with diverse keywords.

### Step 1: Setup Prerequisites

To get started, you'll need to have a
[Weaviate sandbox](https://weaviate.io/developers/weaviate/quickstart#create-a-weaviate-instance)
setup. This is a free-to-use sandbox environment. Make sure to keep your **API key** and **API
host** handy as you will require them in the following steps.

### Step 2: Configure Environment Variables

Create a `.env` file in the root of your project and provide the following variables:

```shell
OPENAI_API_KEY=sk-xxxxx
WEAVIATE_HOST=xxx-xxx-xxxxx.weaviate.network
WEAVIATE_API_KEY=xxxxx
```

### Step 3: Running the Docs GUI

With the environment set up, you can now run the docs locally. The GUI provides options to search
for existing docs, generate a custom guide, or get an explanation.

While the explanation and guide features support various languages, the quality of responses may
vary across languages. For optimal results, consider asking questions in English.

Run the following commands in your terminal:

```shell
# Populate the database. This only needs to be done once for a new database.
# Run this if new pages have been added or content has been changed.
npm run dev:setup-weaviate

# Generate data for the sidebar and table of contents.
# Run this if new pages have been added or content has been changed.
npm run template:pages

# Run the development server.
npm run dev:next
```

### Step 4: Running the Bot in CLI

You can also interact with the bot in the terminal as a CLI chat:

```shell
# This demo automatically populates the database for you.
npm run demo:autodocs
```

You're all set! Now you can explore Hyv Docs locally and dive deep into what Hyv has to offer.
