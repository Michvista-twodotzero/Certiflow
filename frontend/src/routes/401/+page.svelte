<script lang="ts">
  import StatusPage from '$lib/components/StatusPage.svelte'
</script>

<StatusPage
  code="401"
  title="Unauthorized"
  description="Your session is missing, expired, or no longer valid. Sign in again to continue using CertiFlow."
  primaryLabel="Go to sign in"
  primaryHref="/auth"
  secondaryLabel="Back to home"
  secondaryHref="/"
/>
