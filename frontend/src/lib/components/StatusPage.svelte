<script lang="ts">
  export let code: string
  export let title: string
  export let description: string
  export let primaryLabel: string
  export let primaryHref: string
  export let secondaryLabel: string
  export let secondaryHref: string
</script>

<svelte:head>
  <title>{code} {title} | CertiFlow</title>
</svelte:head>

<section class="status-shell">
  <div class="status-orb status-orb-left"></div>
  <div class="status-orb status-orb-right"></div>

  <div class="status-card">
    <p class="status-code">{code}</p>
    <h1>{title}</h1>
    <p class="status-description">{description}</p>

    <div class="status-actions">
      <a class="status-button primary" href={primaryHref}>{primaryLabel}</a>
      <a class="status-button secondary" href={secondaryHref}>{secondaryLabel}</a>
    </div>
  </div>
</section>

<style>
  .status-shell {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(circle at top left, rgba(255, 159, 10, 0.18), transparent 30%),
      radial-gradient(circle at bottom right, rgba(100, 210, 255, 0.14), transparent 28%),
      linear-gradient(160deg, #05070e 0%, #0a1020 100%);
  }

  .status-orb {
    position: absolute;
    border-radius: 999px;
    filter: blur(12px);
    opacity: 0.8;
    animation: drift 10s ease-in-out infinite alternate;
  }

  .status-orb-left {
    width: 14rem;
    height: 14rem;
    left: -2rem;
    top: 12%;
    background: rgba(255, 159, 10, 0.18);
  }

  .status-orb-right {
    width: 18rem;
    height: 18rem;
    right: -4rem;
    bottom: 10%;
    background: rgba(100, 210, 255, 0.14);
    animation-delay: 1.5s;
  }

  .status-card {
    width: min(42rem, 100%);
    position: relative;
    z-index: 1;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1.5rem;
    padding: 2rem;
    background: rgba(8, 12, 23, 0.82);
    backdrop-filter: blur(18px);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
    text-align: center;
  }

  .status-code {
    margin: 0 0 0.5rem;
    color: #ff9f0a;
    text-transform: uppercase;
    letter-spacing: 0.24em;
    font-size: 0.8rem;
    font-weight: 800;
  }

  h1 {
    margin: 0;
    font-size: clamp(2rem, 5vw, 3.5rem);
    line-height: 1;
    letter-spacing: -0.04em;
  }

  .status-description {
    margin: 1rem auto 0;
    max-width: 32rem;
    color: #b4bdca;
    line-height: 1.65;
    font-size: 1rem;
  }

  .status-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 1.75rem;
  }

  .status-button {
    min-width: 11rem;
    padding: 0.9rem 1.2rem;
    border-radius: 999px;
    font-weight: 700;
    text-align: center;
    transition:
      transform 0.2s ease,
      border-color 0.2s ease,
      background-color 0.2s ease;
  }

  .status-button:hover {
    transform: translateY(-1px);
  }

  .primary {
    background: #ff9f0a;
    color: #05070e;
  }

  .secondary {
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #f5f6f9;
    background: rgba(255, 255, 255, 0.03);
  }

  @keyframes drift {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-18px);
    }
  }

  @media (max-width: 640px) {
    .status-card {
      padding: 1.5rem;
      text-align: left;
    }

    .status-actions {
      justify-content: stretch;
    }

    .status-button {
      flex: 1 1 100%;
    }
  }
</style>
