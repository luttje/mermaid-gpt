<script lang="ts">
	import mermaid from 'mermaid';
	import { onMount } from 'svelte';

	let graph: HTMLPreElement | null = null;
	let diagramCode = `erDiagram
  CAR ||--o{ NAMED-DRIVER : allows
  CAR {
      string registrationNumber
      string make
      string model
  }
  PERSON ||--o{ NAMED-DRIVER : is
  PERSON {
      string firstName
      string lastName
      int age
  }
`;

	async function refreshGraph() {
    if (graph == null) return;

    graph.textContent = diagramCode;
    graph.removeAttribute('data-processed');

		await mermaid.run({
      nodes: [ graph ]
    });
	}

	onMount(async () => {
		mermaid.initialize({});
		await refreshGraph();
	});
</script>

<div class="flex flex-row grow">
	<div class="flex flex-col flex-1 bg-red-500 p-4 gap-2">
		{#if graph == null}
			<p>Loading...</p>
		{:else}
			<label for="graphCode" class="text-xl">Graph Code</label>
			<textarea id="graphCode" class="flex-1 rounded-lg" bind:value={diagramCode} on:input={refreshGraph} />
		{/if}
	</div>
	<div class="flex-col flex-1 p-4 gap-2">
		<pre bind:this={graph} class="mermaid" />
	</div>
</div>
