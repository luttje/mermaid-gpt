<script lang="ts">
  import { base } from "$app/paths";
  import TailwindCss from '$lib/TailwindCss.svelte';
  import DiagramEditor from '$lib/DiagramEditor.svelte';



</script>

<TailwindCss />

<div class="flex flex-col justify-stretch items-stretch h-full">
  <slot />
  <DiagramEditor />
</div>
