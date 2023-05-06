<script lang="ts">
	import { type DiagramPrompt, diagramPrompts } from '$lib/diagram-prompts';
	import { diagram } from '$lib/stores/diagram-store';
  import { onMount } from 'svelte';

  let apiKeyElType: string = 'password';
  let apiKey: string | undefined = undefined;
  let hasCustomizedProjectDescription: boolean = false;
  let selectedDiagram: DiagramPrompt = diagramPrompts[0];
  let projectDescription: string = selectedDiagram.example;
  let isGeneratingDiagram = false;

  function checkApiKey(apiKey: string | undefined): apiKey is string {
    if (!apiKey || apiKey.length === 0) {
      alert('Please enter an API key');
      return false;
    }

    return true;
  }

  function updateApiKey(event: Event) {
    const input = event.target as HTMLInputElement;
    apiKey = input.value;
  }

  // Save the API key to local storage
  function saveApiKey() {
    if (!checkApiKey(apiKey))
      return false;

    localStorage.setItem('apiKey', apiKey);
    return true;
  }

  async function generateDiagram() {
    if (!checkApiKey(apiKey))
      return false;

    saveApiKey();

    if (!projectDescription || projectDescription.length === 0) {
      alert('Please enter a project description');
      return false;
    }
    
    isGeneratingDiagram = true;

    const generatedDiagram = await (selectedDiagram.generateDiagram(apiKey, projectDescription));
    diagram.set(generatedDiagram);

    isGeneratingDiagram = false;
  }

  onMount(() => {
    apiKey = localStorage.getItem('apiKey') || '';
    
  });
  
  function updateProjectDescription() {
    if(hasCustomizedProjectDescription)
      return;

    projectDescription = selectedDiagram.example;
  }
</script>

<div class="flex flex-col grow-0 bg-slate-400 shadow p-4 gap-4">
  <div class="flex flex-col gap-2 grow">
    <label for="apiKey" class="">OpenAI API Key:</label>
    <div class="flex flex-row gap-2">
      <input type={ apiKeyElType } value={ apiKey } id="apiKey" class="grow rounded-lg p-2" placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" on:input={(e) => updateApiKey(e)} />
      <button class="flex flex-col justify-center items-center bg-slate-200 rounded-lg p-2" on:click={() => apiKeyElType = apiKeyElType === 'password' ? 'text' : 'password'}>
        <svg fill="#000000" class="w-4 h-4" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 16q0.064 0.128 0.16 0.352t0.48 0.928 0.832 1.344 1.248 1.536 1.664 1.696 2.144 1.568 2.624 1.344 3.136 0.896 3.712 0.352 3.712-0.352 3.168-0.928 2.592-1.312 2.144-1.6 1.664-1.632 1.248-1.6 0.832-1.312 0.48-0.928l0.16-0.352q-0.032-0.128-0.16-0.352t-0.48-0.896-0.832-1.344-1.248-1.568-1.664-1.664-2.144-1.568-2.624-1.344-3.136-0.896-3.712-0.352-3.712 0.352-3.168 0.896-2.592 1.344-2.144 1.568-1.664 1.664-1.248 1.568-0.832 1.344-0.48 0.928zM10.016 16q0-2.464 1.728-4.224t4.256-1.76 4.256 1.76 1.76 4.224-1.76 4.256-4.256 1.76-4.256-1.76-1.728-4.256zM12 16q0 1.664 1.184 2.848t2.816 1.152 2.816-1.152 1.184-2.848-1.184-2.816-2.816-1.184-2.816 1.184l2.816 2.816h-4z"></path>
        </svg>
      </button>
    </div>
  </div>
  <div class="flex flex-col gap-2 grow">
    <label for="diagramPrompt" class="">Diagram Type:</label>
    <div class="flex flex-col sm:flex-row sm:items-center gap-4">
      {#each diagramPrompts as prompt}
        <label class="flex flex-row items-center gap-2">
          <input type="radio" name="diagramPrompt" value={prompt} bind:group={selectedDiagram} on:change={updateProjectDescription} />
          <span class="flex flex-row items-center align-middle text-xl gap-2">
            {prompt.diagramType}
            <a class="text-slate-200 underline text-sm" href="{ prompt.promptSourceUrl }" target="_blank" title="View Prompt Source Code">(?)</a>
          </span>
        </label>
      {/each}
    </div>
  </div>
  <div class="flex flex-col gap-2 grow">
    <label for="projectDescription" class="">{selectedDiagram.instruction} <button class="text-slate-200 underline" on:click={() => { projectDescription = selectedDiagram.example; hasCustomizedProjectDescription = false; }}>(Show an Example)</button></label>
    <textarea id="projectDescription" class="flex-1 rounded-lg p-2" bind:value={projectDescription} placeholder="A description of the project" on:input={() => hasCustomizedProjectDescription = true} />
  </div>
  <div class="flex flex-col items-stretch gap-2">
    {#if isGeneratingDiagram}
      <span class="self-center">
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/></path>
        </svg>
      </span>
    {:else}
      <button class="grow-0 rounded-lg p-2 bg-blue-500 text-white" on:click={() => generateDiagram()}>
          Generate Diagram <span class="italic">Using GPT3</span>
      </button>
    {/if}
    <p class="text-sm italic">Sometimes Graph Code with an invalid syntax may be generated. If that happens you can try generating again or manually correct the mistake in the graph code.</p>
  </div>
</div>