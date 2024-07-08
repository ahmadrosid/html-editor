<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./routes/Home.svelte";
  import Share from "./routes/Share.svelte";
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'

  export let url = "";
  const queryClient = new QueryClient();
</script>

<Router {url}>
  <Route path="/:id" let:params>
	<QueryClientProvider client={queryClient}>
	  <Share id={params.id} />
	</QueryClientProvider>
	</Route>
  <Route path="/"><Home /></Route>
</Router>
