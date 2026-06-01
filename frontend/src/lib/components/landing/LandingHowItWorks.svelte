<script lang="ts">
  import Icon from '$lib/components/Icon.svelte'

  const steps = [
    {
      icon: 'upload',
      title: '1. Upload Reports',
      body: 'Drag in site photos, PDFs, and daily logs from the field.',
    },
    {
      icon: 'robot',
      title: '2. AI Audit',
      body: 'CertiFlow reviews the content, extracts text, and flags likely safety issues.',
    },
    {
      icon: 'check',
      title: '3. Resolve Risks',
      body: 'Review violations, assign follow-up, and mark items resolved in the dashboard.',
    },
  ]
</script>

<section class="section" id="how-it-works">
  <div class="heading">
    <h2>How it Works</h2>
    <div class="rule"></div>
  </div>

  <div class="grid">
    {#each steps as step, index}
      <article class="card">
        <div class="bar" style={`background: var(${index === 0 ? '--accent' : index === 1 ? '--info' : '--danger'});`}></div>
        <div class="icon">
          <Icon name={step.icon} size={22} />
        </div>
        <h3>{step.title}</h3>
        <p>{step.body}</p>
      </article>
    {/each}
  </div>
</section>

<style>
  .section {
    width: min(1200px, calc(100% - 2rem));
    margin: 0 auto;
    padding: 2.5rem 0 0;
  }

  .heading {
    text-align: center;
    margin-bottom: 1.2rem;
  }

  h2 {
    margin: 0;
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.7rem, 3vw, 2.4rem);
    letter-spacing: -0.04em;
  }

  .rule {
    width: 5rem;
    height: 0.2rem;
    margin: 0.6rem auto 0;
    border-radius: 999px;
    background: linear-gradient(90deg, transparent, #ff9f0a, transparent);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }

  .card {
    position: relative;
    padding: 1.2rem 1.1rem 1.15rem;
    background: rgba(18, 24, 39, 0.86);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
    min-height: 12rem;
  }

  .bar {
    position: absolute;
    left: 0;
    top: 0;
    width: 0.22rem;
    height: 100%;
  }

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    margin-bottom: 1rem;
    color: #f9c46b;
  }

  h3 {
    margin: 0 0 0.5rem;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.05rem;
  }

  p {
    margin: 0;
    color: rgba(229, 235, 246, 0.73);
    line-height: 1.6;
    font-size: 0.94rem;
  }

  @media (max-width: 900px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
