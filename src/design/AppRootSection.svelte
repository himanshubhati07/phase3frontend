<script lang="ts">
  // The section's HTML, exactly as the page has it. Mounted with {@html}: Svelte would not compile string event handlers or markup
  // that a browser repairs (<tr> directly in <table>, <div> inside <p>), and the page's own script needs the page's own DOM.
  import html from './html/AppRootSection.html?raw';
</script>

{@html html}
