<script lang="ts">
  import { authSession, logout } from '$lib/auth'
  import { goto } from '$app/navigation'
  import { notifications, playNotificationPing } from '$lib/notifications'
  import { onMount } from 'svelte'
  import { userSettings } from '$lib/settings'
  import { fetchSettings, saveSettings } from '$lib/api'
  import Icon from '$lib/components/Icon.svelte'

  let emailNotifications = true
  let reportAlerts = true
  let notificationSound = true
  let showSaved = false
  let saving = false
  let testingSound = false

  onMount(async () => {
    const localSettings = userSettings.load()
    emailNotifications = localSettings.emailNotifications
    reportAlerts = localSettings.criticalViolationAlerts
    notificationSound = localSettings.notificationSound

    try {
      const remoteSettings = await fetchSettings()
      emailNotifications = remoteSettings.emailNotifications
      reportAlerts = remoteSettings.criticalViolationAlerts
      notificationSound = remoteSettings.notificationSound
      userSettings.set(remoteSettings)
    } catch {
      // Keep local fallback if settings endpoint is unavailable.
    }
  })

  async function handleSave() {
    saving = true

    try {
      const saved = await saveSettings({
        emailNotifications,
        criticalViolationAlerts: reportAlerts,
        notificationSound,
      })

      userSettings.set(saved)
      showSaved = true
      notifications.add('Settings saved successfully.', 'success')
      setTimeout(() => { showSaved = false }, 2500)
    } catch (error) {
      notifications.add(error instanceof Error ? error.message : 'Unable to save settings.', 'warning')
    } finally {
      saving = false
    }
  }

  function handleLogout() {
    logout()
    goto('/auth')
  }

  async function handleTestSound() {
    testingSound = true
    try {
      playNotificationPing()
    } finally {
      window.setTimeout(() => {
        testingSound = false
      }, 600)
    }
  }
</script>

<section class="page">
  <header class="page-header">
    <div>
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Manage your account preferences and notifications.</p>
    </div>
  </header>

  <div class="content-stack">
    {#if showSaved}
      <div class="alert success">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <Icon name="check-circle" size={16} />
          <span>Your preferences have been saved.</span>
        </div>
      </div>
    {/if}

    <!-- Notifications Preferences -->
    <article class="panel">
      <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.25rem;">
        <Icon name="bell" size={20} style="color: var(--accent);" />
        <h2 style="margin: 0; font-family: 'Outfit', sans-serif; font-size: 1.3rem; color: #fff;">Notification Preferences</h2>
      </div>

      <div class="settings-row">
        <div>
          <strong style="color: #fff; font-size: 0.95rem;">Email Notifications</strong>
          <p class="muted" style="margin: 0.2rem 0 0 0; font-size: 0.85rem;">Receive email alerts when a report moves from analyzing to completed or failed.</p>
        </div>
        <label class="toggle">
          <input type="checkbox" bind:checked={emailNotifications} />
          <span class="toggle-slider"></span>
        </label>
      </div>

      <div class="settings-row">
        <div>
          <strong style="color: #fff; font-size: 0.95rem;">In-App Report Alerts</strong>
          <p class="muted" style="margin: 0.2rem 0 0 0; font-size: 0.85rem;">Show bell notifications when a report moves from analyzing to completed or failed.</p>
        </div>
        <label class="toggle">
          <input type="checkbox" bind:checked={reportAlerts} />
          <span class="toggle-slider"></span>
        </label>
      </div>

      <div class="settings-row">
        <div>
          <strong style="color: #fff; font-size: 0.95rem;">Notification Sound</strong>
          <p class="muted" style="margin: 0.2rem 0 0 0; font-size: 0.85rem;">Play a short ping when a new report-status notification arrives.</p>
          <p class="muted" style="margin: 0.35rem 0 0 0; font-size: 0.8rem;">The current sound is generated in code, so there is no MP3 file to edit yet.</p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.9rem; flex-wrap: wrap; justify-content: flex-end;">
          <button class="ghost-button" type="button" on:click={handleTestSound} disabled={testingSound}>
            <Icon name="volume-2" size={14} />
            <span>{testingSound ? 'Playing...' : 'Test Sound'}</span>
          </button>
          <label class="toggle">
            <input type="checkbox" bind:checked={notificationSound} />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
    </article>

    <!-- Appearance -->
    <article class="panel">
      <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.25rem;">
        <Icon name="moon" size={20} style="color: var(--accent);" />
        <h2 style="margin: 0; font-family: 'Outfit', sans-serif; font-size: 1.3rem; color: #fff;">Appearance</h2>
      </div>

      <div class="settings-row">
        <div>
          <strong style="color: #fff; font-size: 0.95rem;">Theme</strong>
          <p class="muted" style="margin: 0.2rem 0 0 0; font-size: 0.85rem;">CertiFlow uses a dark interface optimised for extended monitoring.</p>
        </div>
        <span class="badge minor" style="padding: 0.4rem 0.8rem; font-size: 0.78rem;">Dark Mode</span>
      </div>
    </article>

    <!-- Account & Security -->
    <article class="panel">
      <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.25rem;">
        <Icon name="shield" size={20} style="color: var(--accent);" />
        <h2 style="margin: 0; font-family: 'Outfit', sans-serif; font-size: 1.3rem; color: #fff;">Account & Security</h2>
      </div>

      {#if $authSession}
        <div class="settings-row">
          <div>
            <strong style="color: #fff; font-size: 0.95rem;">Signed in as</strong>
            <p class="muted" style="margin: 0.2rem 0 0 0; font-size: 0.85rem;">
              {$authSession.user.name} &middot; {$authSession.user.email}
            </p>
          </div>
          <a class="ghost-button" href="/profile" style="padding: 0.5rem 1rem; font-size: 0.82rem;">
            <Icon name="user" size={14} />
            <span>View Profile</span>
          </a>
        </div>

        <div class="settings-row" style="border-bottom: none;">
          <div>
            <strong style="color: #ff6b6b; font-size: 0.95rem;">Log Out</strong>
            <p class="muted" style="margin: 0.2rem 0 0 0; font-size: 0.85rem;">End your current session on this device.</p>
          </div>
          <button class="ghost-button" style="border-color: rgba(255, 69, 58, 0.2); color: #ff6b6b; padding: 0.5rem 1rem; font-size: 0.82rem;" on:click={handleLogout}>
            <Icon name="logout" size={14} />
            <span>Log Out</span>
          </button>
        </div>
      {:else}
        <div class="settings-row" style="border-bottom: none;">
          <div>
            <strong style="color: #fff; font-size: 0.95rem;">Not signed in</strong>
            <p class="muted" style="margin: 0.2rem 0 0 0; font-size: 0.85rem;">Sign in to access all features.</p>
          </div>
          <a class="primary-button" href="/auth" style="padding: 0.5rem 1.25rem; font-size: 0.85rem;">Sign In</a>
        </div>
      {/if}
    </article>

    <!-- Save button -->
    <div style="display: flex; justify-content: flex-end;">
      <button class="primary-button" style="padding: 0.75rem 2rem;" on:click={handleSave} disabled={saving}>
        <Icon name="check" size={16} />
        <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
      </button>
    </div>
  </div>
</section>

<style>
  .settings-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 1.1rem 0;
    border-bottom: 1px solid var(--border);
  }

  .settings-row:last-child {
    border-bottom: none;
  }

  .toggle {
    position: relative;
    display: inline-block;
    width: 2.75rem;
    height: 1.5rem;
    flex-shrink: 0;
    cursor: pointer;
  }

  .toggle input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }

  .toggle-slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 999px;
    background-color: var(--panel-muted);
    border: 1px solid var(--border);
    transition: all 0.25s;
  }

  .toggle-slider::before {
    content: '';
    position: absolute;
    height: 1rem;
    width: 1rem;
    left: 0.2rem;
    bottom: 0.19rem;
    background-color: var(--text-muted);
    border-radius: 50%;
    transition: all 0.25s;
  }

  .toggle input:checked + .toggle-slider {
    background-color: rgba(255, 159, 10, 0.2);
    border-color: var(--accent);
  }

  .toggle input:checked + .toggle-slider::before {
    transform: translateX(1.2rem);
    background-color: var(--accent);
  }
</style>
