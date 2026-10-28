<script lang="ts">
  import { onMount } from 'svelte';
  import './designStyles';
  import { loadDesignScripts } from './designScripts';
  import ViewAuthSection from './ViewAuthSection.svelte';
  import AppRootSection from './AppRootSection.svelte';
  import ProfileModalSection from './ProfileModalSection.svelte';
  import NewTeamModalSection from './NewTeamModalSection.svelte';
  import ManageTeamModalSection from './ManageTeamModalSection.svelte';
  import ToastSection from './ToastSection.svelte';

  onMount(() => loadDesignScripts(["/design-scripts/01.js"]));
</script>

  <ViewAuthSection />
  <AppRootSection />
  <ProfileModalSection />
  <NewTeamModalSection />
  <ManageTeamModalSection />
  <ToastSection />
