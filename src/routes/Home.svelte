<script lang="ts">
  import { PaneGroup, Pane, PaneResizer } from "paneforge";
  import DotsSixVertical from "../lib/DotsSixVertical.svelte";
  import Tabs from "../lib/Tabs.svelte";
  import { onMount } from "svelte";
  import Preview from "../lib/Preview.svelte";

  let leftSize = 50;
  let rightSize = 50;
  let isLeftPaneVisible = true;

  function toggleLeftPane() {
    isLeftPaneVisible = !isLeftPaneVisible;
    if (isLeftPaneVisible) {
      leftSize = 50;
      rightSize = 50;
    } else {
      leftSize = 0;
      rightSize = 100;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === "\\") {
      event.preventDefault();
      toggleLeftPane();
    }
  }

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="h-screen">
  <PaneGroup direction="horizontal" class="w-full">
    {#if isLeftPaneVisible}
      <Pane defaultSize={leftSize}>
        <Tabs />
      </Pane>
      <PaneResizer
        class="relative flex w-2 items-center justify-center bg-gray-50"
      >
        <div class="z-10 flex h-7 w-5 items-center justify-center">
          <DotsSixVertical class="size-4 text-gray-400" weight="bold" />
        </div>
      </PaneResizer>
    {/if}
    <Pane defaultSize={rightSize}>
      <Preview />
    </Pane>
  </PaneGroup>
</div>
