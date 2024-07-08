<script lang="ts">
  import { ExternalLink } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";
  import MonacoEditor from "./MonacoEditor.svelte";
  import { sourceCode, type Source } from "./store";
  import { get } from "svelte/store";
  import Share from "./ButtonShare.svelte";

  type TabLanguage = keyof Source;

  let tabs: Array<{
    name: string;
    component: typeof MonacoEditor;
    language: TabLanguage;
  }> = [
    { name: "HTML", component: MonacoEditor, language: "html" },
    { name: "CSS", component: MonacoEditor, language: "css" },
    { name: "Javascript", component: MonacoEditor, language: "js" },
  ];

  let activeTab = tabs[0].name;

  const dispatch = createEventDispatcher();

  function setActiveTab(tabName: string) {
    activeTab = tabName;
    dispatch("tabChange", tabName);
  }

  function handleEditorChange(event: CustomEvent<string>, key: TabLanguage) {
    sourceCode.update((code) => ({ ...code, [key]: event.detail }));
  }

  $: currentCode = get(sourceCode);
</script>

<div class="flex border-b border-gray-200 mb-1">
  {#each tabs as tab}
    <button
      class={`px-4 py-3 font-medium text-sm border-b-2 focus:outline-none ${
        activeTab === tab.name
          ? "text-gray-800 border-gray-800"
          : "text-gray-500 hover:text-gray-700 border-transparent"
      }`}
      on:click={() => setActiveTab(tab.name)}
    >
      {tab.name}
    </button>
  {/each}
  <div class="flex items-center">
    <Share />
  </div>
  <div class="flex justify-end items-center w-full">
    <p class="text-sm px-2 inline-flex items-center gap-1">
      Made with ❤️ by{" "}
      <a
        target="_blank"
        href="https://ahmadrosid.com"
        class="text-black font-semibold hover:text-blue-700 inline-flex gap-1 items-center"
      >
        ahmadrosid
        <ExternalLink class="w-3 h-3" />
      </a>
    </p>
  </div>
</div>

{#each tabs as tab}
  {#if activeTab === tab.name}
    <svelte:component
      this={tab.component}
      language={tab.language}
      value={currentCode[tab.language]}
      on:change={(event) => handleEditorChange(event, tab.language)}
    />
  {/if}
{/each}
