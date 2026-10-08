const { escapeHtml, dataAttributes } = require("./html");

function trialPath(trial) {
  return `/trials/${encodeURIComponent(trial.id)}`;
}

function requireTrial(trial) {
  if (!trial || typeof trial.id !== "string" || trial.id.trim() === "") {
    throw new TypeError("Selected trial must include an id");
  }
  if (typeof trial.name !== "string" || trial.name.trim() === "") {
    throw new TypeError("Selected trial must include a name");
  }
}

function trialCrumb(trial) {
  requireTrial(trial);
  return {
    label: trial.name,
    href: trialPath(trial),
    data: { "breadcrumb-role": "trial" },
  };
}

function visitScheduleBreadcrumb(trial) {
  requireTrial(trial);
  return [
    { label: "Trials", href: "/trials" },
    trialCrumb(trial),
    { label: "Visit Schedule" },
  ];
}

function formsBreadcrumb(trial, visit) {
  requireTrial(trial);
  if (!visit || typeof visit.name !== "string" || visit.name.trim() === "") {
    throw new TypeError("Selected visit must include a name");
  }
  return [
    { label: "Trials", href: "/trials" },
    trialCrumb(trial),
    {
      label: "Visit Schedule",
      href: `${trialPath(trial)}/visit-schedule`,
    },
    { label: visit.name },
  ];
}

function trialDetailBreadcrumb(trial) {
  requireTrial(trial);
  return [{ label: "Trials", href: "/trials" }, { label: trial.name }];
}

function renderBreadcrumb(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new TypeError("Breadcrumb items are required");
  }

  const pieces = items.map((item, index) => {
    const isCurrent = index === items.length - 1 || !item.href;
    const label = escapeHtml(item.label);
    const attrs = dataAttributes(item.data);
    const crumb = isCurrent
      ? `<span class="breadcrumb__current" aria-current="page"${attrs}>${label}</span>`
      : `<a class="breadcrumb__link" href="${escapeHtml(item.href)}"${attrs}>${label}</a>`;
    const separator =
      index === 0
        ? ""
        : '<span class="breadcrumb__separator" aria-hidden="true">/</span>';
    return `<li>${separator}${crumb}</li>`;
  });

  return `<nav class="breadcrumb" aria-label="Breadcrumb"><ol>${pieces.join("")}</ol></nav>`;
}

module.exports = {
  trialPath,
  trialCrumb,
  visitScheduleBreadcrumb,
  formsBreadcrumb,
  trialDetailBreadcrumb,
  renderBreadcrumb,
};
