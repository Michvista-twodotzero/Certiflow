<script lang="ts">
  export let loggedIn = false
</script>

<nav class="nav">
  <a class="brand" href="/" aria-label="CertiFlow home">
    <img src="/certiflow.png" alt="" />
    <span>CertiFlow</span>
  </a>

  <div class="links" aria-label="Primary">
    <a href="#features" class="active">Features</a>
    <a href="#how-it-works">How it Works</a>
    <a href="#pricing">Pricing</a>
    <a href="/auth">Log In</a>
  </div>

  <div class="actions">
    {#if loggedIn}
      <a class="action primary" href="/dashboard">Open Dashboard</a>
    {:else}
      <a class="action primary" href="/auth">Get Started</a>
    {/if}
  </div>
</nav>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 2rem;
    background: rgba(9, 13, 25, 0.88);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    color: #fff;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: 0.01em;
  }

  .brand img {
    width: 1.5rem;
    height: 1.5rem;
    object-fit: contain;
  }

  .links {
    display: flex;
    align-items: center;
    gap: 1.8rem;
    color: rgba(240, 244, 250, 0.72);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .links a {
    position: relative;
    padding-bottom: 0.2rem;
  }

  .links a:hover {
    color: #fff;
  }

  .links a.active {
    color: #fff;
  }

  .links a.active::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 2px;
    background: #ff9f0a;
    border-radius: 999px;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .action {
    border-radius: 0.3rem;
    padding: 0.55rem 1.1rem;
    font-weight: 600;
    font-size: 0.88rem;
    transition: transform 0.2s ease, opacity 0.2s ease, background-color 0.2s ease;
  }

  .action:hover {
    transform: translateY(-1px);
  }

  .action.primary {
    background: linear-gradient(180deg, #ffad2f 0%, #ff9f0a 100%);
    color: #140d00;
    border-radius: 0.35rem;
  }

  @media (max-width: 860px) {
    .nav {
      flex-wrap: wrap;
      justify-content: center;
      padding: 0.75rem 1rem;
    }

    .links {
      order: 3;
      width: 100%;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
  }
</style>
