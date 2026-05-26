<script lang="ts">
  import { onMount } from 'svelte'
  import { fetchReports, fetchViolations } from '$lib/api'
  import { severityTone } from '$lib/format'
  import { fetchProjects, resolveProjectName } from '$lib/project-registry'
  import type { Project, Violation } from '@certiflow/shared'
  import Icon from '$lib/components/Icon.svelte'

  type ViolationRow = Violation & {
    projectId: string
  }

  let loading = true
  let error = ''
  let rows: ViolationRow[] = []
  let projects: Project[] = []

  onMount(async () => {
    try {
      projects = await fetchProjects()
      const reports = await fetchReports()
      const pairs = await Promise.all(
        reports.map(async (report) => {
          const violations = await fetchViolations(report.id).catch(() => [])
          return violations.map((violation) => ({ ...violation, projectId: report.projectId }))
        })
      )

      rows = pairs.flat().sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime())
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unable to load violations'
    } finally {
      loading = false
    }
  })
</script>

<section class="page">
  <header class="page-header">
    <div>
      <h1 class="page-title">Violations</h1>
      <p class="page-subtitle">All findings across the current report set.</p>
    </div>
  </header>

  <div class="content-stack">
    {#if loading}
      <div class="panel empty-state">Loading violations...</div>
    {:else if error}
      <div class="alert error">{error}</div>
    {:else if rows.length === 0}
      <div class="panel empty-state">No violations have been recorded yet.</div>
    {:else}
      <div class="scroll-container" style="max-height: calc(100vh - 12rem); overflow-y: auto; padding-right: 0.25rem;">
        <div class="violations-list">
          {#each rows as violation}
            <article class={`panel violation-card ${severityTone(violation.severity)}`}>
              <div class="violation-meta">
                <span class={`badge ${severityTone(violation.severity)}`}>{violation.severity}</span>
                <span class="badge minor" style="font-family: monospace;">{violation.ruleReference}</span>
                <span class="badge minor" style="background-color: transparent; border-color: rgba(255,255,255,0.06); font-weight: 500;">
                  {resolveProjectName(violation.projectId, projects)}
                </span>
                {#if violation.sector}
                  <span class="sector-tag">Sector {violation.sector.replace(/sector\s+/gi, '')}</span>
                {/if}
              </div>
              
              <p class="violation-description">{violation.description}</p>
              
              <div class="suggestion-box">
                <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem;">
                  <Icon name="wrench" size={14} style="color: var(--accent);" />
                  <span class="eyebrow" style="margin: 0; font-size: 0.7rem; color: var(--text-muted);">Suggested Fix</span>
                </div>
                <p>{violation.suggestion}</p>
              </div>
            </article>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</section>
