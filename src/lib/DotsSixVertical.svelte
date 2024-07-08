<script lang="ts">
    export let className = '';
    export let weight: 'regular' | 'bold' = 'regular';
  </script>
  
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    class={className}
    {...$$restProps}
  >
    <path
      fill-rule="evenodd"
      d="M12 5a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4z"
      clip-rule="evenodd"
      stroke-width={weight === 'bold' ? 2 : 1.5}
    />
  </svg>