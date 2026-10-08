const assert = require("node:assert/strict");
const test = require("node:test");
const {
  visitScheduleBreadcrumb,
  formsBreadcrumb,
  renderBreadcrumb,
} = require("../src/breadcrumbs");

function visibleText(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

test("visit schedule breadcrumb places the selected trial between Trials and Visit Schedule", () => {
  const trial = { id: "il13xtslp-1b", name: "IL13xTSLP 1B" };
  const html = renderBreadcrumb(visitScheduleBreadcrumb(trial));

  assert.equal(visibleText(html), "Trials / IL13xTSLP 1B / Visit Schedule");
  assert.match(
    html,
    /<a class="breadcrumb__link" href="\/trials\/il13xtslp-1b" data-breadcrumb-role="trial">IL13xTSLP 1B<\/a>/
  );
  assert.match(html, /<a class="breadcrumb__link" href="\/trials">Trials<\/a>/);
  assert.match(
    html,
    /<span class="breadcrumb__current" aria-current="page">Visit Schedule<\/span>/
  );
  assert.equal(html.match(/breadcrumb__separator/g).length, 2);
});

test("the trial crumb follows the selected trial when the trial changes", () => {
  const html = renderBreadcrumb(
    visitScheduleBreadcrumb({ id: "dupixent-ole", name: "Dupixent OLE" })
  );

  assert.equal(visibleText(html), "Trials / Dupixent OLE / Visit Schedule");
  assert.match(html, /href="\/trials\/dupixent-ole"/);
  assert.equal(html.includes("IL13xTSLP 1B"), false);
});

test("a trial name is taken from the trial record", () => {
  const html = renderBreadcrumb(
    visitScheduleBreadcrumb({ id: "synthetic-trial-42", name: "Synthetic Trial 42" })
  );

  assert.match(html, /Synthetic Trial 42/);
  assert.match(html, /href="\/trials\/synthetic-trial-42"/);
  assert.equal(html.includes("IL13xTSLP"), false);
});

test("forms breadcrumb keeps the same trial link and separators", () => {
  const html = renderBreadcrumb(
    formsBreadcrumb(
      { id: "il13xtslp-1b", name: "IL13xTSLP 1B" },
      { id: "baseline", name: "Baseline" }
    )
  );

  assert.equal(
    visibleText(html),
    "Trials / IL13xTSLP 1B / Visit Schedule / Baseline"
  );
  assert.match(
    html,
    /<a class="breadcrumb__link" href="\/trials\/il13xtslp-1b" data-breadcrumb-role="trial">IL13xTSLP 1B<\/a>/
  );
  assert.match(html, /href="\/trials\/il13xtslp-1b\/visit-schedule"/);
  assert.equal(html.match(/breadcrumb__separator/g).length, 3);
});

test("trial names are escaped and ids are encoded", () => {
  const html = renderBreadcrumb(
    visitScheduleBreadcrumb({ id: "a/b c", name: `A & B <script>` })
  );

  assert.match(html, /A &amp; B &lt;script&gt;/);
  assert.match(html, /href="\/trials\/a%2Fb%20c"/);
  assert.equal(html.includes("<script>"), false);
});

test("visit schedule breadcrumb requires a selected trial name", () => {
  assert.throws(() => visitScheduleBreadcrumb({ id: "x", name: " " }), TypeError);
  assert.throws(() => visitScheduleBreadcrumb(null), TypeError);
});
