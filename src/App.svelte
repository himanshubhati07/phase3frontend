<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import DesignPage from './design/DesignPage.svelte';
  import NotFound from './pages/NotFound.svelte';
</script>

<Router>
  <Route path="/"><DesignPage /></Route>
  <Route path="*"><NotFound /></Route>
</Router>
