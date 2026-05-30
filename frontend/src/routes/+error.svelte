<script lang="ts">
  import StatusPage from '$lib/components/StatusPage.svelte'

  export let error: Error
  export let status: number

  const isUnauthorized = status === 401
  const isNotFound = status === 404
</script>

{#if isUnauthorized}
  <StatusPage
    code="401"
    title="Unauthorized"
    description="Your session is missing, expired, or rejected by the API. Sign in again to continue."
    primaryLabel="Go to sign in"
    primaryHref="/auth"
    secondaryLabel="Back to dashboard"
    secondaryHref="/"
  />
{:else if isNotFound}
  <StatusPage
    code="404"
    title="Page not found"
    description="The page you requested could not be found. Check the address or return to the dashboard."
    primaryLabel="Go home"
    primaryHref="/"
    secondaryLabel="Sign in"
    secondaryHref="/auth"
  />
{:else}
  <StatusPage
    code={String(status)}
    title="Something broke"
    description={error.message || 'We hit an unexpected error. Try again, or go back to the dashboard.'}
    primaryLabel="Go home"
    primaryHref="/"
    secondaryLabel="Sign in"
    secondaryHref="/auth"
  />
{/if}
