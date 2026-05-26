<script lang="ts">
  import { onMount } from 'svelte'
  import { fetchReports, fetchViolations } from '$lib/api'
  import { formatDate, statusTone } from '$lib/format'
  import { fetchProjects, resolveProjectName } from '$lib/project-registry'
  import type { Project, Report, Violation } from '@certiflow/shared'
  import Icon from '$lib/components/Icon.svelte'

  type ReportSummary = {
    report: Report
    violations: Violation[]
  }

  let loading = true
  let error = ''
  let summaries: ReportSummary[] = []
  let projects: Project[] = []

  $: totalProjects = projects.length
  $: openReports = summaries.filter(({ report }) => report.status !== 'COMPLETE').length
  $: criticalViolations = summaries.flatMap(({ violations }) => violations).filter((violation) => violation.severity === 'CRITICAL' && !violation.isResolved).length
  $: resolvedThisWeek = summaries
    .flatMap(({ violations }) => violations)
    .filter((violation) => violation.isResolved && Date.now() - violation.detectedAt.getTime() < 7 * 24 * 60 * 60 * 1000).length
  $: recentReports = [...summaries].sort((a, b) => b.report.uploadedAt.getTime() - a.report.uploadedAt.getTime()).slice(0, 6)

  onMount(async () => {
    try {
      projects = await fetchProjects()
      const reports = await fetchReports()
      summaries = await Promise.all(
        reports.map(async (report) => ({
          report,
          violations: await fetchViolations(report.id).catch(() => []),
        }))
      )
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unable to load dashboard data'
    } finally {
      loading = false
    }
  })

  function violationPreview(violations: Violation[]) {
    if (violations.length === 0) {
      return '--'
    }

    const critical = violations.filter((violation) => violation.severity === 'CRITICAL').length
    const major = violations.filter((violation) => violation.severity === 'MAJOR').length
    const minor = violations.filter((violation) => violation.severity === 'MINOR').length

    // Match exact style of text: "1 Critical, 3 Minor" or "--" or "0"
    const parts = []
    if (critical) parts.push(`${critical} Critical`)
    if (major) parts.push(`${major} Major`)
    if (minor) parts.push(`${minor} Minor`)

    return parts.join(', ')
  }
</script>

<section class="page">
  <header class="page-header">
    <div>
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">System Overview & Recent Activity</p>
    </div>
  </header>

  <div class="content-stack">
    {#if loading}
      <div class="panel empty-state">Loading dashboard...</div>
    {:else if error}
      <div class="alert error">{error}</div>
    {:else}
      <div class="grid-4">
        <article class="stat-card">
          <div class="stat-icon-wrapper">
            <Icon name="building" size={20} />
          </div>
          <div class="stat-content">
            <div class="eyebrow">Total Projects</div>
            <div class="big-number">{totalProjects}</div>
          </div>
        </article>

        <article class="stat-card">
          <div class="stat-icon-wrapper">
            <Icon name="file" size={20} />
          </div>
          <div class="stat-content">
            <div class="eyebrow">Open Reports</div>
            <div class="big-number">{openReports}</div>
          </div>
        </article>

        <article class="stat-card accent">
          <div class="stat-icon-wrapper">
            <Icon name="violations" size={20} style="color: var(--danger);" />
          </div>
          <div class="stat-content">
            <div class="eyebrow">Critical Violations</div>
            <div class="big-number">{criticalViolations}</div>
          </div>
        </article>

        <article class="stat-card">
          <div class="stat-icon-wrapper">
            <Icon name="check" size={20} style="color: var(--accent);" />
          </div>
          <div class="stat-content">
            <div class="eyebrow">Resolved This Week</div>
            <div class="big-number">{resolvedThisWeek}</div>
          </div>
        </article>
      </div>

      <section class="panel">
        <div class="page-header" style="padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
          <div>
            <h2 style="margin: 0; font-family: 'Outfit', sans-serif; font-size: 1.4rem;">Recent Reports</h2>
          </div>
          <a class="ghost-button" href="/reports">View all reports</a>
        </div>

        {#if recentReports.length === 0}
          <div class="empty-state">No reports yet. Upload your first report to start the audit flow.</div>
        {:else}
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Date Uploaded</th>
                  <th>Status</th>
                  <th>Violations Found</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {#each recentReports as { report, violations }}
                  <tr>
                    <td style="font-weight: 600; color: #fff;">{resolveProjectName(report.projectId, projects)}</td>
                    <td style="color: var(--text-muted);">{formatDate(report.uploadedAt)}</td>
                    <td>
                      <span class={`badge ${statusTone(report.status)}`}>{report.status}</span>
                    </td>
                    <td>
                      {#if violations.length > 0}
                        <span style="color: {violations.some(v => v.severity === 'CRITICAL' && !v.isResolved) ? 'var(--danger)' : 'var(--accent)'}; font-weight: 500;">
                          {violationPreview(violations)}
                        </span>
                      {:else}
                        <span style="color: var(--accent); font-weight: 500;">0</span>
                      {/if}
                    </td>
                    <td>
                      <a class="ghost-button" href={`/reports/${report.id}`}>View</a>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </section>
    {/if}
  </div>
</section>
