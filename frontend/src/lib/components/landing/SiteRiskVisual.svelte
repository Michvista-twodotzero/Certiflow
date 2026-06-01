<script lang="ts">
  export let compact = false
</script>

<div class:compact class="scene">
  <div class="glow glow-left"></div>
  <div class="glow glow-right"></div>
  <div class="grid"></div>
  <div class="plane"></div>
  <div class="slab slab-back"></div>
  <div class="slab slab-front"></div>
  <div class="spot spot-amber"></div>
  <div class="spot spot-blue"></div>
  <div class="spot spot-red"></div>
  <div class="scan-line"></div>

  <div class="badge badge-top">
    <span class="kicker">Live audit</span>
    <strong>Visual risk map</strong>
    <span>Illustrative safety zones for review</span>
  </div>

  <div class="badge badge-bottom">
    <span class="kicker">OSHA focus</span>
    <strong>Compliance summary</strong>
    <span>Hazards and next actions highlighted</span>
  </div>
</div>

<style>
  .scene {
    position: relative;
    width: 100%;
    min-height: 28rem;
    border-radius: 1rem;
    overflow: hidden;
    background:
      linear-gradient(180deg, rgba(8, 12, 25, 0.12) 0%, rgba(8, 12, 25, 0.62) 100%),
      radial-gradient(circle at 78% 30%, rgba(67, 120, 204, 0.22), transparent 30%),
      radial-gradient(circle at 50% 100%, rgba(0, 0, 0, 0.42), transparent 35%),
      linear-gradient(145deg, #11182b 0%, #080c16 58%, #05070e 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.42);
    transform: perspective(1400px) rotateY(-18deg) rotateX(8deg);
    transform-style: preserve-3d;
  }

  .scene.compact {
    min-height: 16rem;
    transform: perspective(1000px) rotateY(-14deg) rotateX(9deg);
  }

  .glow,
  .grid,
  .plane,
  .slab,
  .spot,
  .scan-line,
  .badge {
    position: absolute;
  }

  .glow {
    border-radius: 999px;
    filter: blur(28px);
    opacity: 0.8;
  }

  .glow-left {
    width: 14rem;
    height: 14rem;
    left: -4rem;
    top: 7rem;
    background: rgba(255, 159, 10, 0.14);
  }

  .glow-right {
    width: 13rem;
    height: 13rem;
    right: -3rem;
    top: 3rem;
    background: rgba(100, 210, 255, 0.12);
  }

  .grid {
    inset: 0;
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 3rem 3rem;
    opacity: 0.45;
    transform: perspective(700px) rotateX(68deg) translateY(5rem);
    transform-origin: center bottom;
  }

  .plane {
    left: 10%;
    right: 8%;
    bottom: 18%;
    height: 38%;
    border-radius: 1rem;
    background:
      radial-gradient(circle at 18% 72%, rgba(255, 164, 38, 0.34), transparent 16%),
      radial-gradient(circle at 60% 40%, rgba(100, 210, 255, 0.22), transparent 20%),
      radial-gradient(circle at 76% 58%, rgba(255, 69, 58, 0.26), transparent 16%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.03),
      0 18px 36px rgba(0, 0, 0, 0.35);
    transform: perspective(900px) rotateX(72deg) rotateZ(-12deg);
    transform-origin: center center;
  }

  .slab {
    background: rgba(10, 14, 26, 0.88);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 16px 30px rgba(0, 0, 0, 0.22);
    transform: perspective(900px) rotateX(68deg) rotateZ(-12deg);
    transform-origin: center center;
  }

  .slab-back {
    left: 12%;
    top: 20%;
    width: 54%;
    height: 18%;
    opacity: 0.55;
  }

  .slab-front {
    right: 11%;
    bottom: 13%;
    width: 42%;
    height: 16%;
    opacity: 0.68;
  }

  .spot {
    width: 6rem;
    height: 6rem;
    border-radius: 999px;
    filter: blur(4px);
  }

  .spot::before {
    content: '';
    position: absolute;
    inset: 20%;
    border-radius: inherit;
    background: inherit;
    filter: blur(18px);
    opacity: 0.7;
  }

  .spot-amber {
    left: 18%;
    top: 35%;
    background: radial-gradient(circle, rgba(255, 182, 63, 0.9) 0%, rgba(255, 159, 10, 0.18) 52%, transparent 74%);
  }

  .spot-blue {
    left: 44%;
    top: 26%;
    width: 5rem;
    height: 5rem;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(100, 210, 255, 0.34) 42%, transparent 70%);
  }

  .spot-red {
    right: 16%;
    top: 31%;
    background: radial-gradient(circle, rgba(255, 93, 93, 0.9) 0%, rgba(255, 69, 58, 0.24) 50%, transparent 72%);
  }

  .scan-line {
    left: 12%;
    right: 12%;
    top: 55%;
    height: 0.18rem;
    background: linear-gradient(90deg, transparent 0%, rgba(100, 210, 255, 0.78) 20%, rgba(255, 255, 255, 0.95) 50%, rgba(255, 159, 10, 0.72) 80%, transparent 100%);
    box-shadow: 0 0 24px rgba(100, 210, 255, 0.35);
    transform: rotate(-8deg);
    animation: scan 4.5s ease-in-out infinite;
  }

  .badge {
    display: inline-flex;
    flex-direction: column;
    gap: 0.2rem;
    width: 11.8rem;
    padding: 0.85rem 0.95rem;
    border-radius: 0.8rem;
    background: rgba(15, 22, 38, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 18px 35px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
  }

  .badge-top {
    right: 1rem;
    top: 1rem;
  }

  .badge-bottom {
    left: 1rem;
    bottom: 1rem;
  }

  .badge strong {
    display: block;
    font-size: 1rem;
  }

  .badge span,
  .kicker {
    font-size: 0.78rem;
    color: rgba(230, 235, 245, 0.8);
  }

  .kicker {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #f7b24f;
  }

  @keyframes scan {
    0%,
    100% {
      transform: translateY(-6%) rotate(-8deg);
      opacity: 0.75;
    }
    50% {
      transform: translateY(26%) rotate(-8deg);
      opacity: 1;
    }
  }

  @media (max-width: 760px) {
    .badge {
      width: 10.5rem;
    }
  }
</style>
