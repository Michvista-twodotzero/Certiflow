<footer class="footer">
  <div class="brand">
    <img src="/certiflow.png" alt="" />
    <div>
      <strong>CertiFlow</strong>
      <span>Digital site safety compliance</span>
    </div>
  </div>

  <div class="links">
    <a href="/auth">Privacy Policy</a>
    <a href="/auth">Terms of Service</a>
    <a href="/auth">Contact Support</a>
    <a href="/auth">Documentation</a>
  </div>
</footer>

<style>
  .footer {
    width: min(1200px, calc(100% - 2rem));
    margin: 1.5rem auto 0;
    padding: 1rem 0 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(240, 245, 250, 0.8);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .brand img {
    width: 1.6rem;
    height: 1.6rem;
    object-fit: contain;
  }

  .brand strong,
  .brand span {
    display: block;
  }

  .brand span {
    font-size: 0.8rem;
    color: rgba(240, 245, 250, 0.62);
  }

  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: flex-end;
    font-size: 0.86rem;
  }

  .links a:hover {
    color: #fff;
  }

  @media (max-width: 760px) {
    .footer {
      flex-direction: column;
      align-items: flex-start;
    }

    .links {
      justify-content: flex-start;
    }
  }
</style>
