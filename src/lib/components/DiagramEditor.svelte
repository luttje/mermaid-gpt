<script lang="ts">
	import { onMount } from 'svelte';
  import * as monaco from 'monaco-editor';
  import monacoJsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
  import monacoEditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
  // @ts-ignore ignore missing type definitions for monaco-mermaid
  import initEditor from 'monaco-mermaid';
  import mermaid from 'mermaid';
	import { diagram } from '$lib/stores/diagram';

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
  let divEl: HTMLDivElement | undefined = undefined;
  let editor: monaco.editor.IStandaloneCodeEditor | undefined;
  let editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    minimap: {
      enabled: false,
    },
    value: diagramCode,
    theme: 'mermaid-dark',
    overviewRulerLanes: 0,
  };

	async function refreshGraph() {
    if (graph == null) return;

    graph.textContent = diagramCode;
    graph.removeAttribute('data-processed');

		await mermaid.run({
      nodes: [ graph ],
      suppressErrors: true,
    });
	}

  diagram.subscribe(async (newDiagram) => {
    if (graph == null) return;
    if (editor == null) return;
    if (newDiagram === null) return;
    if (newDiagram === diagramCode) return;

    diagramCode = newDiagram.trim();
    editor.setValue(newDiagram);
    await refreshGraph();
  });

	onMount(async () => {
    self.MonacoEnvironment = {
      getWorker(_, label) {
        if (label === 'json')
          return new monacoJsonWorker();

        return new monacoEditorWorker();
      }
    };

		mermaid.initialize({});
		await refreshGraph();
    
    if (!divEl)
      throw new Error('divEl is undefined');

    initEditor(monaco);
    editor = monaco.editor.create(divEl, editorOptions);

    editor.onDidChangeModelContent(({ isFlush, changes }) => {
      const newText = editor?.getValue();

      if (!newText || diagramCode === newText || isFlush)
        return;

      diagramCode = newText;
		  refreshGraph();
    });

    editor.addAction({
      id: 'mermaid-render-diagram',
      label: 'Render Diagram',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],

      run: function () {
		    refreshGraph();
      }
    });

    // Setup syntax highlighting
    monaco.editor.setModelLanguage(editor.getModel()!, 'mermaid');
	});
</script>

<div class="flex flex-row grow">
	<div class="flex flex-col flex-1 bg-slate-200 p-4 gap-2">
		{#if graph == null}
			<p>Loading...</p>
		{:else}
			<label for="graphCode" class="text-xl">Graph Code</label>
      <div bind:this={divEl} id="editor" class="overflow-hidden h-full" />
		{/if}
	</div>
	<div class="flex-col flex-1 p-4 gap-2 overflow-hidden">
    <label for="graph" class="text-xl">Resulting Code</label>
		<pre bind:this={graph} id="graph" class="mermaid" />
	</div>
</div>
