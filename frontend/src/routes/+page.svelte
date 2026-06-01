<script lang="ts">
  import { authSession } from '$lib/auth'
  import LandingNav from '$lib/components/landing/LandingNav.svelte'
  import LandingHero from '$lib/components/landing/LandingHero.svelte'
  import LandingStats from '$lib/components/landing/LandingStats.svelte'
  import LandingHowItWorks from '$lib/components/landing/LandingHowItWorks.svelte'
  import LandingFeatures from '$lib/components/landing/LandingFeatures.svelte'
  import LandingCta from '$lib/components/landing/LandingCta.svelte'
  import LandingFooter from '$lib/components/landing/LandingFooter.svelte'

  $: loggedIn = Boolean($authSession)
</script>

<svelte:head>
  <title>CertiFlow | AI-Powered Construction Safety Compliance</title>
  <meta
    name="description"
    content="CertiFlow helps construction teams audit site photos and reports, flag violations, and manage safety follow-up."
  />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<main class="landing-root">
  <LandingNav {loggedIn} />
  <LandingHero {loggedIn} />
  <LandingStats />
  <LandingHowItWorks />
  <LandingFeatures />
  <LandingCta {loggedIn} />
  <LandingFooter />
</main>

<style>
  .landing-root {
    min-height: 100vh;
    background:
      radial-gradient(circle at top left, rgba(255, 159, 10, 0.08), transparent 28%),
      radial-gradient(circle at 82% 16%, rgba(100, 210, 255, 0.07), transparent 20%),
      linear-gradient(180deg, #070b16 0%, #090d19 100%);
    color: #eef1f7;
    overflow-x: clip;
  }
</style>
