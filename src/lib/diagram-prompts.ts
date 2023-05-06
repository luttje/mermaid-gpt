import { prompt as erdPrompt } from './prompts/entity-relationship-diagram';
import { prompt as cdPrompt } from './prompts/class-diagram';

export class DiagramPrompt {
  constructor(
    public diagramType: string,
    public instruction: string,
    public example: string,
    public promptSourceUrl: string,
    private prompt: string
  ) { }
  
  async generateDiagram(apiKey: string, diagramDescription: string) {
    const promptBody = {
      model: 'text-davinci-003',
      prompt: this.prompt + diagramDescription + '"""\nERDiagram code: ',
      max_tokens: 2000,
      top_p: 0.1,
    };

    console.log({
      promptBody
    });

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(promptBody)
    });

    console.log(response);
    const data = await response.json();
    const diagram = data.choices[0].text.trim('\n');

    return diagram;
  }
}

export const diagramPrompts: DiagramPrompt[] = []

diagramPrompts.push(new DiagramPrompt(
  'Entity Relationship Diagram',
  'Describe the entities in your application and how they relate',
  'A car sharing app where persons can be the driver of many cars. But both a car and a person can exist without the other. A person has human attributes. A car has car attributes.',
  'https://github.com/luttje/mermaid-gpt/blob/main/src/lib/prompts/entity-relationship-diagram.ts',
  erdPrompt
));

diagramPrompts.push(new DiagramPrompt(
  'Class Diagram',
  'Describe the classes in your application and how they relate and/or inherit',
  'A car sharing app with Drivers and Passengers. Both are users, but only drivers have exactly 1 car. Only passengers can create a review about a driver.',
  'https://github.com/luttje/mermaid-gpt/blob/main/src/lib/prompts/class-diagram.ts',
  cdPrompt
));