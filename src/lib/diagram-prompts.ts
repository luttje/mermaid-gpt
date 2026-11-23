import { prompt as erdPrompt } from './prompts/entity-relationship-diagram';
import { prompt as cdPrompt } from './prompts/class-diagram';
import { openAiRequest } from './openai';

export class DiagramPrompt {
  constructor(
    public diagramType: string,
    public instruction: string,
    public example: string,
    public promptSourceUrl: string,
    private prompt: string
  ) { }

  async generateDiagram(apiKey: string, model: string, diagramDescription: string) {
    const promptBody = {
      model: model,
      messages: [
        {
          role: 'system',
          content: this.prompt + diagramDescription + '"""\nMermaidDiagram code: '
        }
      ],
      max_tokens: 2000,
      top_p: 0.1
    };

    console.log({
      promptBody
    });

    const data = await openAiRequest<{
      choices?: { message?: { content?: string } }[];
    }>(apiKey, 'chat/completions', {
      method: 'POST',
      body: JSON.stringify(promptBody)
    });

    const diagram = data.choices?.[0]?.message?.content?.trim();

    if (!diagram) throw new Error('OpenAI returned an empty response. Please try again.');

    return diagram;
  }
}

export const diagramPrompts: DiagramPrompt[] = [];

diagramPrompts.push(
  new DiagramPrompt(
    'Entity Relationship Diagram',
    'Describe the entities in your application and how they relate',
    'A car sharing app where persons can be the driver of many cars. But both a car and a person can exist without the other. A person has human attributes. A car has car attributes.',
    'https://github.com/luttje/mermaid-gpt/blob/main/src/lib/prompts/entity-relationship-diagram.ts',
    erdPrompt
  )
);

diagramPrompts.push(
  new DiagramPrompt(
    'Class Diagram',
    'Describe the classes in your application and how they relate and/or inherit',
    'A car sharing app with Drivers and Passengers. Both are users, but only drivers have exactly 1 car. Only passengers can create a review about a driver.',
    'https://github.com/luttje/mermaid-gpt/blob/main/src/lib/prompts/class-diagram.ts',
    cdPrompt
  )
);
