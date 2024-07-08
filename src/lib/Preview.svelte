<script lang="ts">
  import { onMount } from "svelte";
  import { sourceCode, formatCode, type Source } from "./store";

  let iframe: HTMLIFrameElement;

  function updateIframe(code: Source) {
    if (iframe) {
        iframe.srcdoc = formatCode(code);
    }
  }

  $: if (iframe) updateIframe($sourceCode);

  onMount(() => {
    updateIframe($sourceCode);
});
</script>

<iframe
  title="Preview"
  bind:this={iframe}
  width="100%"
  height="100%"
  class="h-screen"
  sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals"
></iframe>
