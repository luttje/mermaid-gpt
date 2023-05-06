# 🧜‍♀️ MermaidGPT 

Generates [mermaid](https://mermaid.js.org/) Class and Entity Relationship Diagrams based on your description, using GPT-3 (`text-davinci-003`).

To use it head over to the [💻 MermaidGPT demo](https://luttje.github.io/mermaid-gpt/), enter your [OpenAI API key](https://platform.openai.com/account/api-keys) and start generating diagrams. 

> **Note** Your API key is only stored in your browser's LocalStorage. It is not sent anywhere. Nevertheless, you should be careful entering your API key anywhere. It is recommended you understand the source code and then get this project running locally to use it from there.

## Getting started

Before continuing, make sure you have [Node.js](https://nodejs.org/en/) installed.

1. Clone this repository
2. Run `npm install` to install the dependencies
3. Run `npm run dev -- --open` to start the development server and open the app in your browser

## Prompts

You can check out which prompts are used in [the source code prompts folder](https://github.com/luttje/mermaid-gpt/tree/main/src/lib/prompts).