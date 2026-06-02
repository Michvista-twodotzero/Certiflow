<script lang="ts">
  import Icon from '$lib/components/Icon.svelte'

  const steps = [
    {
      icon: 'upload',
      title: '1. Upload Reports',
      body: 'Drag and drop site, high-res drone photos, or 360° panoramas directly into our secure cloud portal.',
      color: '#ff9f0a',
      bg: 'rgba(255, 159, 10, 0.12)',
    },
    {
      icon: 'robot',
      title: '2. AI Audit',
      body: 'Our proprietary engine references thousands of OSHA regulations instantly, performing a pixel-perfect audit of your site.',
      color: '#64d2ff',
      bg: 'rgba(100, 210, 255, 0.12)',
    },
    {
      icon: 'check',
      title: '3. Resolve Risks',
      body: 'Receive a detailed task list of actionable fixes. Assign them to managers and mark violations as resolved in real-time.',
      color: '#ff453a',
      bg: 'rgba(255, 69, 58, 0.12)',
    },
  ]
</script>

<section class="section" id="how-it-works">
  <div class="heading">
    <h2>How it Works</h2>
    <div class="rule"></div>
  </div>

  <div class="grid">
    {#each steps as step}
      <article class="card">
        <div class="icon-box" style="background: {step.bg}; color: {step.color};">
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
    width: min(1200px, calc(100% - 4rem));
    margin: 0 auto;
    padding: 3.5rem 0 0;
  }

  .heading {
    text-align: center;
    margin-bottom: 2rem;
  }

  h2 {
    margin: 0;
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.7rem, 3vw, 2.4rem);
    letter-spacing: -0.04em;
    color: #fff;
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
    gap: 1.25rem;
  }

  .card {
    position: relative;
    padding: 1.5rem 1.3rem 1.4rem;
    background: rgba(14, 19, 32, 0.92);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 0.5rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    transition: border-color 0.3s ease, transform 0.3s ease;
  }

  .card:hover {
    border-color: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
  }

  .icon-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 0.45rem;
    margin-bottom: 1.2rem;
  }

  h3 {
    margin: 0 0 0.6rem;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.05rem;
    color: #fff;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: rgba(229, 235, 246, 0.62);
    line-height: 1.65;
    font-size: 0.9rem;
  }

  @media (max-width: 900px) {
    .grid {
      grid-template-columns: 1fr;
      max-width: 32rem;
      margin: 0 auto;
    }
  }
</style>
