<script lang="ts">
  import { onMount } from 'svelte'
  import { submitReport } from '$lib/api'
  import { fetchProjects } from '$lib/project-registry'
  import { notifications } from '$lib/notifications'
  import type { Project, ReportType } from '@certiflow/shared'
  import Icon from '$lib/components/Icon.svelte'

  let selectedProject = ''
  let projectName = ''
  let reportType: ReportType = 'DAILY_SAFETY_LOG'
  let notes = ''
  let file: File | null = null
  let loading = false
  let successMessage = ''
  let errorMessage = ''
  let projects: Project[] = []
  let fileInput: HTMLInputElement

  onMount(async () => {
    try {
      projects = await fetchProjects()
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Unable to load projects'
    }
  })

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    file = input.files?.[0] ?? null
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault()
    file = event.dataTransfer?.files?.[0] ?? null
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault()
  }

  async function handleSubmit() {
    if (!selectedProject || !projectName || !file) {
      errorMessage = 'Please choose a project and attach a file.'
      return
    }

    loading = true
    errorMessage = ''
    successMessage = ''

    try {
      await submitReport({
        projectId: selectedProject,
        projectName,
        reportType,
        notes,
        file,
      })

      successMessage = 'Report submitted. The audit job is now queued.'
      notifications.add('Report uploaded successfully and queued for AI audit.', 'success')
      notes = ''
      file = null
      selectedProject = ''
      projectName = ''
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Submission failed'
    } finally {
      loading = false
    }
  }

  function applyProjectSelection(projectId: string) {
    selectedProject = projectId
    projectName = projects.find((project) => project.id === projectId)?.name || ''
  }
</script>

<section class="page">
  <div class="content-stack" style="margin-top: 1rem;">
    <div class="upload-card" style="max-width: 44rem; margin: 0 auto; width: 100%;">
      <div style="margin-bottom: 1.5rem;">
        <h1 style="font-family: 'Outfit', sans-serif; font-size: 1.85rem; margin: 0 0 0.4rem 0; color: #fff; font-weight: 700;">Submit Site Report</h1>
        <p style="color: var(--text-muted); margin: 0; font-size: 0.95rem;">Upload documentation for automated compliance analysis.</p>
      </div>

      {#if successMessage}
        <div class="alert success" style="margin-bottom: 1.25rem;">{successMessage}</div>
      {/if}

      {#if errorMessage}
        <div class="alert error" style="margin-bottom: 1.25rem;">{errorMessage}</div>
      {/if}

      <div class="stack">
        <div class="field-grid">
          <div class="field">
            <label for="project">Project</label>
            <select id="project" bind:value={selectedProject} on:change={(event) => applyProjectSelection((event.target as HTMLSelectElement).value)}>
              <option value="">Select Project...</option>
              {#each projects as project}
                <option value={project.id}>{project.name}</option>
              {/each}
            </select>
          </div>

          <div class="field">
            <label for="reportType">Report Type</label>
            <select id="reportType" bind:value={reportType}>
              <option value="DAILY_SAFETY_LOG">Daily Safety Log</option>
              <option value="SITE_PHOTO">Site Photo</option>
              <option value="INCIDENT_REPORT">Incident Report</option>
            </select>
          </div>
        </div>

        <div class="field">
          <label for="drop-zone">Documentation</label>
          <div
            class="drop-zone"
            on:drop={handleDrop}
            on:dragover={handleDragOver}
            on:click={() => fileInput.click()}
            on:keydown={(e) => e.key === 'Enter' && fileInput.click()}
            role="button"
            tabindex="0"
          >
            <Icon name="cloud" size={32} class="drop-zone-icon" />
            {#if file}
              <p style="color: var(--accent); margin: 0;"><strong>{file.name}</strong></p>
              <p class="muted" style="margin: 0;">Ready to upload.</p>
            {:else}
              <p style="margin: 0; font-weight: 600; color: #fff;">Drop files here or click to upload</p>
              <p class="muted" style="margin: 0;">Supports PDF, JPG, PNG, CSV (Max 50MB)</p>
            {/if}
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.tif,.tiff,.csv"
              bind:this={fileInput}
              on:change={handleFileChange}
              style="display: none;"
            />
          </div>
        </div>

        <div class="field">
          <label for="notes">Additional Notes (Optional)</label>
          <textarea
            id="notes"
            bind:value={notes}
            placeholder="Provide any context required for the AI auditor..."
            rows="5"
          ></textarea>
        </div>

        <button
          class="primary-button"
          style="width: 100%; padding: 0.95rem 1rem; font-weight: 700; margin-top: 0.5rem;"
          on:click={handleSubmit}
          disabled={loading}
        >
          <Icon name="robot" size={18} />
          <span>{loading ? 'Submitting...' : 'Submit for AI Audit'}</span>
        </button>
      </div>
    </div>
  </div>
</section>
