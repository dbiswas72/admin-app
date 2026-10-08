const assert = require("node:assert/strict");
const test = require("node:test");
const { createServer } = require("../src/server");

function visibleBreadcrumb(html) {
  const nav = html.match(/<nav class="breadcrumb"[\s\S]*?<\/nav>/);
  assert.ok(nav, "expected a breadcrumb");
  return nav[0]
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function withServer(fn) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    await fn(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
}

test("visit schedule landing page shows the selected trial name", async () => {
  await withServer(async (base) => {
    const first = await fetch(`${base}/trials/il13xtslp-1b/visit-schedule`);
    const firstHtml = await first.text();
    assert.equal(first.status, 200);
    assert.match(firstHtml, /data-page="visit-schedule"/);
    assert.equal(
      visibleBreadcrumb(firstHtml),
      "Trials / IL13xTSLP 1B / Visit Schedule"
    );

    const second = await fetch(`${base}/trials/abc-101/visit-schedule`);
    const secondHtml = await second.text();
    const secondCrumb = visibleBreadcrumb(secondHtml);
    assert.equal(secondCrumb, "Trials / ABC-101 Phase 3 / Visit Schedule");
    assert.equal(secondCrumb.includes("IL13xTSLP 1B"), false);
  });
});

test("the trial breadcrumb links to that trial's detail page", async () => {
  await withServer(async (base) => {
    const schedule = await fetch(`${base}/trials/il13xtslp-1b/visit-schedule`);
    const html = await schedule.text();
    const href = html.match(/data-breadcrumb-role="trial"[^>]*href="([^"]+)"|href="([^"]+)"[^>]*data-breadcrumb-role="trial"/);
    assert.ok(href, "expected a trial breadcrumb link");
    const path = href[1] || href[2];
    assert.equal(path, "/trials/il13xtslp-1b");

    const detail = await fetch(`${base}${path}`);
    const detailHtml = await detail.text();
    assert.equal(detail.status, 200);
    assert.match(detailHtml, /data-page="trial-detail"/);
    assert.match(detailHtml, /<h1>IL13xTSLP 1B<\/h1>/);
    assert.equal(visibleBreadcrumb(detailHtml), "Trials / IL13xTSLP 1B");
  });
});

test("forms page keeps the trial name and visit schedule still has it", async () => {
  await withServer(async (base) => {
    const forms = await fetch(`${base}/trials/dupixent-ole/visits/week-12/forms`);
    const formsHtml = await forms.text();
    assert.equal(forms.status, 200);
    assert.equal(
      visibleBreadcrumb(formsHtml),
      "Trials / Dupixent OLE / Visit Schedule / Week 12"
    );

    const landing = await fetch(`${base}/trials/dupixent-ole/visit-schedule`);
    const landingHtml = await landing.text();
    assert.equal(
      visibleBreadcrumb(landingHtml),
      "Trials / Dupixent OLE / Visit Schedule"
    );
  });
});

test("unknown trials do not invent a trial name", async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/trials/missing/visit-schedule`);
    const html = await response.text();
    assert.equal(response.status, 404);
    assert.equal(html.includes("IL13xTSLP 1B"), false);
    assert.match(html, /Trial not found/);
  });
});

test("trial API returns the name used by the breadcrumb", async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/api/trials/il13xtslp-1b`);
    const trial = await response.json();
    assert.equal(response.status, 200);
    assert.equal(trial.name, "IL13xTSLP 1B");
    assert.equal(trial.id, "il13xtslp-1b");
  });
});
