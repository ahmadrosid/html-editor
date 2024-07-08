<script lang="ts">
import { Loader2, Share2 } from "lucide-svelte";
import { sourceCode } from "./store";
import { saveCode } from "./api";
import { navigate } from "svelte-routing";
$: code = $sourceCode;

let loading = false;

async function sahreCode() {
    loading = true;
    const response = await saveCode({
        html: code.html,
        css: code.css,
        js: code.js,
    });
    if (response.data.id) {
        navigate("/" + response.data.id);
    }
    loading = false;
}
</script>

<button on:click={sahreCode} class="text-sm flex gap-2 items-center border-px border-blue-700 bg-blue-600 hover:bg-blue-700 shadow-sm text-white p-2 rounded-md">
    {#if loading}
        <Loader2 class="animate-spin size-4" />
    {:else}
        <Share2 class="size-4" />
    {/if}
    Share
</button>