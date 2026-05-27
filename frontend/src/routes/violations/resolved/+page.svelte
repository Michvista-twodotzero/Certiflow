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
  let severityFilter: 'ALL' | 'CRITICAL' | 'MAJOR' | 'MINOR' = 'ALL'

  $: filteredRows = rows.filter((row) => severityFilter === 'ALL' || row.severity === severityFilter)
  $: counts = {
    ALL: rows.length,
    CRITICAL: rows.filter((row) => row.severity === 'CRITICAL').length,
    MAJOR: rows.filter((row) => row.severity === 'MAJOR').length,
    MINOR: rows.filter((row) => row.severity === 'MINOR').length,
  }

  onMount(async () => {
    try {
      projects = await fetchProjects()
      const reports = await fetchReports()
      const pairs = await Promise.all(
        reports.map(async (report) => {
          const violations = await fetchViolations(report.id).catch(() => [])
          return violations
            .filter((violation) => violation.isResolved)
            .map((violation) => ({ ...violation, projectId: report.projectId }))
        }),
      )

      rows = pairs.flat().sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime())
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unable to load resolved violations'
    } finally {
      loading = false
    }
  })
</script>

<section class="page">
  <header class="page-header">
    <div>
      <h1 class="page-title">Resolved Violations</h1>
      <p class="page-subtitle">Review the issues your team has already closed out.</p>
    </div>
    <a class="ghost-button" href="/violations">
      <Icon name="violations" size={15} />
      <span>Back to Active</span>
    </a>
  </header>

  <div class="content-stack">
    <div class="panel" style="padding: 1rem 1.25rem;">
      <div class="pill-row">
        {#each ['ALL', 'CRITICAL', 'MAJOR', 'MINOR'] as severity}
          <button
            class="status-pill"
            class:active={severityFilter === severity}
            on:click={() => (severityFilter = severity as typeof severityFilter)}
          >
            {severity === 'ALL' ? 'All' : severity.charAt(0) + severity.slice(1).toLowerCase()}
            <span class="pill-count">{counts[severity as keyof typeof counts]}</span>
          </button>
        {/each}
      </div>
    </div>

    {#if loading}
      <div class="panel empty-state">Loading resolved violations...</div>
    {:else if error}
      <div class="alert error">{error}</div>
    {:else if filteredRows.length === 0}
      <div class="panel empty-state">No resolved violations match the current filter.</div>
    {:else}
      <div class="violations-grid">
        {#each filteredRows as violation}
          <article class={`panel violation-card ${severityTone(violation.severity)}`}>
            <div class="violation-meta">
              <span class={`badge ${severityTone(violation.severity)}`}>{violation.severity}</span>
              <span class="badge minor monospace">{violation.ruleReference}</span>
              <span class="badge minor">{resolveProjectName(violation.projectId, projects)}</span>
              <span class="badge complete">Resolved</span>
            </div>

            <p class="violation-description">{violation.description}</p>

            <div class="suggestion-box">
              <div class="suggestion-label">
                <Icon name="wrench" size={14} style="color: var(--accent);" />
                <span class="eyebrow suggestion-eyebrow">Suggested Fix</span>
              </div>
              <p>{violation.suggestion}</p>
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .pill-row {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.45rem 0.8rem;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-muted);
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
  }

  .status-pill.active {
    border-color: rgba(255, 255, 255, 0.16);
    color: #fff;
    background: rgba(255, 255, 255, 0.04);
  }

  .pill-count {
    font-size: 0.7rem;
    opacity: 0.72;
  }

  .violations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
    gap: 1rem;
    align-items: start;
  }

  .monospace {
    font-family: monospace;
  }

  .suggestion-label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.4rem;
  }

  .suggestion-eyebrow {
    margin: 0;
    font-size: 0.7rem;
    color: var(--text-muted);
  }
</style>
