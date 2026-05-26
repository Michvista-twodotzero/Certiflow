<script lang="ts">
  import { authSession, logout } from '$lib/auth'
  import { goto } from '$app/navigation'
  import Icon from '$lib/components/Icon.svelte'

  $: user = $authSession?.user
  $: initials = user ? user.name.split(' ').map((p: string) => p.charAt(0).toUpperCase()).join('').slice(0, 2) : 'G'

  function handleLogout() {
    logout()
    goto('/auth')
  }
</script>

<section class="page">
  <header class="page-header">
    <div>
      <h1 class="page-title">Profile</h1>
      <p class="page-subtitle">Your account details and preferences.</p>
    </div>
  </header>

  <div class="content-stack">
    {#if user}
      <!-- Profile Card -->
      <article class="panel" style="display: flex; align-items: center; gap: 1.5rem; padding: 2rem;">
        <div style="width: 4.5rem; height: 4.5rem; border-radius: 50%; background: linear-gradient(135deg, var(--accent), #e68600); display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.5rem; color: #000; flex-shrink: 0; box-shadow: 0 8px 24px rgba(255, 159, 10, 0.2);">
          {initials}
        </div>
        <div style="flex: 1; min-width: 0;">
          <h2 style="margin: 0; font-family: 'Outfit', sans-serif; font-size: 1.5rem; color: #fff;">{user.name}</h2>
          <p style="margin: 0.25rem 0 0 0; color: var(--text-muted); font-size: 0.95rem;">{user.email}</p>
          <div style="margin-top: 0.75rem; display: flex; gap: 0.5rem; align-items: center;">
            <span class="badge complete" style="padding: 0.3rem 0.7rem;">
              <Icon name="check-circle" size={12} />
              Active Account
            </span>
          </div>
        </div>
      </article>

      <!-- Account Information -->
      <article class="panel">
        <h3 style="margin: 0 0 1.25rem 0; font-family: 'Outfit', sans-serif; font-size: 1.25rem; color: #fff;">Account Information</h3>
        <div class="profile-info-grid">
          <div class="profile-info-row">
            <div class="profile-info-label">
              <Icon name="user" size={16} />
              <span>Full Name</span>
            </div>
            <div class="profile-info-value">{user.name}</div>
          </div>
          <div class="profile-info-row">
            <div class="profile-info-label">
              <Icon name="mail" size={16} />
              <span>Email</span>
            </div>
            <div class="profile-info-value">{user.email}</div>
          </div>
          <div class="profile-info-row">
            <div class="profile-info-label">
              <Icon name="shield" size={16} />
              <span>Role</span>
            </div>
            <div class="profile-info-value">Safety Inspector</div>
          </div>
          <div class="profile-info-row">
            <div class="profile-info-label">
              <Icon name="clock" size={16} />
              <span>Member Since</span>
            </div>
            <div class="profile-info-value">
              {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date())}
            </div>
          </div>
        </div>
      </article>

      <!-- Quick Actions -->
      <article class="panel">
        <h3 style="margin: 0 0 1.25rem 0; font-family: 'Outfit', sans-serif; font-size: 1.25rem; color: #fff;">Quick Actions</h3>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <a class="ghost-button" href="/settings" style="padding: 0.65rem 1.25rem;">
            <Icon name="settings" size={16} />
            <span>Settings</span>
          </a>
          <a class="ghost-button" href="/upload" style="padding: 0.65rem 1.25rem;">
            <Icon name="upload" size={16} />
            <span>Upload Report</span>
          </a>
          <button class="ghost-button" style="padding: 0.65rem 1.25rem; border-color: rgba(255, 69, 58, 0.2); color: #ff6b6b;" on:click={handleLogout}>
            <Icon name="logout" size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </article>
    {:else}
      <div class="panel empty-state">
        <Icon name="user" size={32} />
        <p>You're not signed in.</p>
        <a class="primary-button" href="/auth">Sign In</a>
      </div>
    {/if}
  </div>
</section>

<style>
  .profile-info-grid {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .profile-info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0;
    border-bottom: 1px solid var(--border);
  }

  .profile-info-row:last-child {
    border-bottom: none;
  }

  .profile-info-label {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    color: var(--text-muted);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .profile-info-value {
    color: #fff;
    font-size: 0.95rem;
    font-weight: 500;
  }
</style>
