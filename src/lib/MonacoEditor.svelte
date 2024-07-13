<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Monaco from "svelte-monaco";
  import { Loader2 } from 'lucide-svelte';
  
  export let value = '';
  export let language = '';
  const dispatch = createEventDispatcher();
  
  let editorReady = false;
  
  function debounce(func: Function, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }
  
  const handleChange = debounce((newValue: string) => {
    dispatch('change', newValue);
  }, 800); // 300ms debounce
  
  $: if (value) {
    handleChange(value);
  }
  
  function handleReady(event: CustomEvent) {
    editorReady = true;
  }
  </script>
  
  {#if !editorReady}
    <div class="grid place-content-center w-full h-full">
      <div class="flex gap-2 text-gray-600">
        <Loader2 size={24} class="animate-spin" />
        <span>Loading editor...</span>
      </div>
    </div>
  {/if}
  
  <div class="w-full h-full" class:hidden={!editorReady}>
    <Monaco
      options={{
        language,
        automaticLayout: true,
        minimap: {
          enabled: false,
        },
      }}
      theme="vs-light"
      on:ready={handleReady}
      bind:value
    />
</div>