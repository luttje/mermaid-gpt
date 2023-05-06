<script lang="ts">
	import { onMount } from 'svelte';
  import * as monaco from 'monaco-editor';
  import monacoJsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
  import monacoEditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
  import { toPng, toJpeg, toSvg } from 'html-to-image';
	import { diagram } from '$lib/stores/diagram-store';
  // @ts-ignore ignore missing type definitions for monaco-mermaid
  import initEditor from 'monaco-mermaid';
  import mermaid from 'mermaid';

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
  let downloadDialogEl: HTMLDialogElement | undefined = undefined;
  let downloadEl: HTMLAnchorElement | undefined = undefined;
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

  async function saveGraph(format: 'svg' | 'png' | 'jpeg') {
    if (!graph)
      throw new Error('graph is undefined');

    if (!downloadEl || !downloadDialogEl)
      throw new Error('downloadEl is undefined');

    let image

    if (format === 'png') {
      image = await toPng(graph);
    } else if (format === 'jpeg') {
      image = await toJpeg(graph, {
        backgroundColor: 'white',
      });
    } else {
      image = await toSvg(graph);
    }
    
    downloadEl.href = image;
    downloadEl.download = `mermaid-diagram-${new Date().toISOString()}.${format}`;

    downloadDialogEl.showModal();
  }

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

<div class="flex flex-col md:flex-row md:grow">
	<div class="flex flex-col flex-1 bg-slate-200 p-4 gap-2">
		{#if graph == null}
			<p>Loading...</p>
		{:else}
			<label for="graphCode" class="text-xl">Graph Code</label>
      <div bind:this={divEl} id="editor" class="h-full w-full min-h-[250px]" />
		{/if}
	</div>
	<div class="flex flex-col flex-1 p-4 gap-2">
    <div class="flex-1 grow">
      <label for="graph" class="text-xl">Resulting Graph</label>
      <pre bind:this={graph} id="graph" class="mermaid" />
    </div>
    <div class="text-right bg-white shrink-0">
      <div class="relative inline-flex text-left">
        <button type="button" class="flex items-center justify-center px-4 py-2 font-medium text-white !bg-blue-500 border border-transparent rounded-l-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" on:click={(event) => saveGraph('svg')}>
          Save as SVG
        </button>
        <button type="button" class="peer ml-[1px] relative inline-flex items-center justify-center px-2 py-2 text-white !bg-blue-500 border border-transparent rounded-r-md shadow-sm hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 3.586L4.707 8.879a1 1 0 001.414 1.414L10 6.414l4.879 4.879a1 1 0 001.414-1.414L10 3.586z" clip-rule="evenodd" />
          </svg>
        </button>
        <div class="hidden peer-active:block peer-focus:block peer-hover:block hover:block absolute right-0 bottom-full">
          <div class="py-1 mb-2 w-32 bg-white rounded-md shadow-lg" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button on:click={(event) => saveGraph('png')} class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">As PNG</button>
            <button on:click={(event) => saveGraph('jpeg')} class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">As JPEG</button>
          </div>
        </div>
      </div>
    </div>
	</div>

  <dialog bind:this={downloadDialogEl}>
    <div class="flex flex-col gap-2">
      <h2>Download Diagram</h2>
      <p>Your diagram has been generated. Click the button below to download it.</p>
      <div class="flex flex-row justify-between">
        <a href={'#'} class="rounded-lg p-2 bg-gray-300 cursor-pointer" on:click={() => downloadDialogEl?.close()}>Cancel</a>
        <a href={'#'} class="rounded-lg p-2 bg-blue-500 text-white cursor-pointer" bind:this={downloadEl} on:click={() => downloadDialogEl?.close()}>Download</a>
      </div>
  </dialog>
</div>
