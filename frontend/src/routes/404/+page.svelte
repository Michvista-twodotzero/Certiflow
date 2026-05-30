<script lang="ts">
  import StatusPage from '$lib/components/StatusPage.svelte'
</script>

<StatusPage
  code="404"
  title="Page not found"
  description="The page you asked for doesn’t exist, was moved, or you do not have access to it."
  primaryLabel="Go home"
  primaryHref="/"
  secondaryLabel="Sign in"
  secondaryHref="/auth"
/>
