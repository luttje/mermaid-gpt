<script lang="ts">
	import { diagram } from '$lib/stores/diagram';
  import { onMount } from 'svelte';

  let apiKey: string | undefined = undefined;
  let projectDescription: string = "A car sharing app where persons can be the driver of many cars. But both a car and a person can exist without the other. A person has human attributes. A car has car attributes.";
  let isGeneratingDiagram = false;

  function checkApiKey(apiKey: string | undefined): apiKey is string {
    if (!apiKey || apiKey.length === 0) {
      alert('Please enter an API key');
      return false;
    }

    return true;
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

    const generatedDiagram = await (diagram.generateDiagram(apiKey, projectDescription));
    
    isGeneratingDiagram = false;
  }

  onMount(() => {
    apiKey = localStorage.getItem('apiKey') || undefined;

  });
</script>

<div class="flex flex-col grow-0 bg-slate-400 shadow p-4 gap-4">
  <div class="flex flex-col gap-2 grow">
    <label for="apiKey" class="text-xl">OpenAI API Key:</label>
    <input bind:value={apiKey} id="apiKey" class="flex-1 rounded-lg p-2" placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
  </div>
  <div class="flex flex-col gap-2 grow">
    <label for="projectDescription" class="text-xl">Describe the entities in your application and how they relate:</label>
    <textarea id="projectDescription" class="flex-1 rounded-lg p-2" bind:value={projectDescription} placeholder="A description of the project" />
  </div>
  <div class="flex flex-col items-stretch">
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
  </div>
</div>