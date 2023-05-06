<script lang="ts">
  import './global.css';
</script>

<div class="flex flex-col justify-stretch items-stretch h-full">
  <slot />
</div>

<div class="fixed bottom-0 left-0 p-2 bg-white border-tr rounded-sm shadow-md">
  <a href="https://github.com/luttje/mermaid-gpt" target="_blank" class="flex flex-row gap-2 items-center">
    <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" class="w-10 h-10 sm:w-5 sm:h-5" alt="GitHub Invertocat Logo" />
    <span class="hidden sm:block mr-2">
      Check out the source code on GitHub
    </span>
  </a>
</div>
