<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";

  import { sourceCode } from "../lib/store";
  import { fetchCode } from "../lib/api";
  import Home from "./Home.svelte";
  import { Loader2 } from "lucide-svelte";
  export let id = "";

  const query = createQuery({
    queryKey: ["getCode", id],
    queryFn: () => fetchCode(id),
    enabled: id !== "",
  });

  $: if ($query.isSuccess) {
    let data = $query.data.data;
    sourceCode.update(() => ({
      html: data.html,
      css: data.css,
      js: data.js,
    }));
  }
</script>

{#if $query.isLoading}
  <div class="grid place-content-center absolute inset-0 z-10 bg-white">
    <div class="flex gap-2 text-gray-600">
      <Loader2 size={24} class="animate-spin" />
      <span>Loading the content...</span>
    </div>
  </div>
{:else if $query.isError}
  <div class="grid place-content-center absolute inset-0 z-10 bg-white">
    <div class="flex gap-2 text-gray-600">
      <span>{$query.error.message}</span>
    </div>
  </div>
{:else if $query.isSuccess}
  <Home />
{/if}
