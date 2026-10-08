const { escapeHtml } = require("./html");
const {
  renderBreadcrumb,
  visitScheduleBreadcrumb,
  formsBreadcrumb,
  trialDetailBreadcrumb,
  trialPath,
} = require("./breadcrumbs");

function layout({ title, main }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <header class="app-header">
    <a class="app-header__brand" href="/trials">Admin App</a>
  </header>
  ${main}
</body>
</html>`;
}

function page({ title, breadcrumb, body, pageName }) {
  return layout({
    title: `${title} · Admin App`,
    main: `<main class="page" data-page="${escapeHtml(pageName)}">
      ${breadcrumb}
      ${body}
    </main>`,
  });
}

function renderTrialsPage(trials) {
  const cards = trials
    .map(
      (trial) => `<article class="trial-card">
        <h2><a href="${escapeHtml(trialPath(trial))}">${escapeHtml(trial.name)}</a></h2>
        <p>${escapeHtml(trial.protocolNumber)} · ${escapeHtml(trial.phase)} · ${escapeHtml(trial.status)}</p>
        <a class="text-link" href="${escapeHtml(trialPath(trial))}/visit-schedule">Visit Schedule</a>
      </article>`
    )
    .join("");

  return page({
    title: "Trials",
    pageName: "trials",
    breadcrumb: renderBreadcrumb([{ label: "Trials" }]),
    body: `<h1>Trials</h1>
      <div class="trial-list">${cards}</div>`,
  });
}

function renderTrialDetailPage(trial) {
  return page({
    title: trial.name,
    pageName: "trial-detail",
    breadcrumb: renderBreadcrumb(trialDetailBreadcrumb(trial)),
    body: `<h1>${escapeHtml(trial.name)}</h1>
      <dl class="meta">
        <div><dt>Protocol</dt><dd>${escapeHtml(trial.protocolNumber)}</dd></div>
        <div><dt>Phase</dt><dd>${escapeHtml(trial.phase)}</dd></div>
        <div><dt>Status</dt><dd>${escapeHtml(trial.status)}</dd></div>
        <div><dt>Indication</dt><dd>${escapeHtml(trial.indication)}</dd></div>
      </dl>
      <a class="button" href="${escapeHtml(trialPath(trial))}/visit-schedule">Open visit schedule</a>`,
  });
}

function renderVisitRows(trial) {
  return trial.visits
    .map(
      (visit) => `<tr>
        <td>${escapeHtml(visit.name)}</td>
        <td>${escapeHtml(visit.window)}</td>
        <td><a class="text-link" href="${escapeHtml(trialPath(trial))}/visits/${encodeURIComponent(visit.id)}/forms">Forms</a></td>
      </tr>`
    )
    .join("");
}

function renderTrialSwitcher(trials, selectedId) {
  const links = trials
    .map((trial) => {
      const current = trial.id === selectedId ? ' aria-current="true"' : "";
      return `<a href="${escapeHtml(trialPath(trial))}/visit-schedule"${current}>${escapeHtml(trial.name)}</a>`;
    })
    .join("");
  return `<nav class="trial-switcher" aria-label="Switch trial">${links}</nav>`;
}

function renderVisitSchedulePage(trial, trials) {
  const rows = renderVisitRows(trial);
  return page({
    title: `Visit Schedule · ${trial.name}`,
    pageName: "visit-schedule",
    breadcrumb: renderBreadcrumb(visitScheduleBreadcrumb(trial)),
    body: `<h1>Visit Schedule</h1>
      <p class="lede" data-selected-trial="${escapeHtml(trial.id)}">${escapeHtml(trial.name)}</p>
      ${renderTrialSwitcher(trials, trial.id)}
      <table class="visits">
        <thead>
          <tr><th>Visit</th><th>Window</th><th></th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`,
  });
}

function renderFormsPage(trial, visit) {
  return page({
    title: `${visit.name} · Forms`,
    pageName: "forms",
    breadcrumb: renderBreadcrumb(formsBreadcrumb(trial, visit)),
    body: `<h1>${escapeHtml(visit.name)}</h1>
      <p class="lede">Forms for ${escapeHtml(trial.name)}</p>
      <ul class="form-list">
        <li>Informed consent</li>
        <li>Eligibility</li>
        <li>Visit procedures</li>
      </ul>`,
  });
}

function renderNotFoundPage(message) {
  return page({
    title: "Not found",
    pageName: "not-found",
    breadcrumb: renderBreadcrumb([
      { label: "Trials", href: "/trials" },
      { label: "Not found" },
    ]),
    body: `<h1>Not found</h1><p>${escapeHtml(message)}</p>`,
  });
}

module.exports = {
  renderTrialsPage,
  renderTrialDetailPage,
  renderVisitSchedulePage,
  renderFormsPage,
  renderNotFoundPage,
};
