const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { listTrials, getTrial, getVisit } = require("./trials");
const {
  renderTrialsPage,
  renderTrialDetailPage,
  renderVisitSchedulePage,
  renderFormsPage,
  renderNotFoundPage,
} = require("./pages");

const publicDir = path.join(__dirname, "..", "public");

function send(res, status, body, contentType) {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function sendHtml(res, status, html) {
  send(res, status, html, "text/html; charset=utf-8");
}

function sendJson(res, status, body) {
  send(res, status, JSON.stringify(body), "application/json; charset=utf-8");
}

function serveStatic(res, pathname) {
  const filePath = path.join(publicDir, pathname);
  const relative = path.relative(publicDir, filePath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    sendHtml(res, 404, renderNotFoundPage("Page not found"));
    return;
  }
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    sendHtml(res, 404, renderNotFoundPage("Page not found"));
    return;
  }
  const types = {
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
  };
  send(res, 200, fs.readFileSync(filePath), types[path.extname(filePath)] || "application/octet-stream");
}

function route(req, res) {
  if (req.method !== "GET") {
    send(res, 405, "Method not allowed", "text/plain; charset=utf-8");
    return;
  }

  const url = new URL(req.url, "http://127.0.0.1");
  const parts = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);

  if (url.pathname === "/styles.css") {
    serveStatic(res, "styles.css");
    return;
  }

  if (parts.length === 0) {
    res.writeHead(302, { Location: "/trials" });
    res.end();
    return;
  }

  if (parts[0] === "api" && parts[1] === "trials" && parts.length === 2) {
    sendJson(res, 200, listTrials());
    return;
  }

  if (parts[0] === "api" && parts[1] === "trials" && parts.length === 3) {
    const trial = getTrial(parts[2]);
    if (!trial) {
      sendJson(res, 404, { error: "Trial not found" });
      return;
    }
    sendJson(res, 200, trial);
    return;
  }

  if (parts[0] === "trials" && parts.length === 1) {
    sendHtml(res, 200, renderTrialsPage(listTrials()));
    return;
  }

  if (parts[0] === "trials" && parts.length === 2) {
    const trial = getTrial(parts[1]);
    if (!trial) {
      sendHtml(res, 404, renderNotFoundPage("Trial not found"));
      return;
    }
    sendHtml(res, 200, renderTrialDetailPage(trial));
    return;
  }

  if (parts[0] === "trials" && parts.length === 3 && parts[2] === "visit-schedule") {
    const trial = getTrial(parts[1]);
    if (!trial) {
      sendHtml(res, 404, renderNotFoundPage("Trial not found"));
      return;
    }
    sendHtml(res, 200, renderVisitSchedulePage(trial, listTrials()));
    return;
  }

  if (
    parts[0] === "trials" &&
    parts.length === 5 &&
    parts[2] === "visits" &&
    parts[4] === "forms"
  ) {
    const trial = getTrial(parts[1]);
    const visit = getVisit(trial, parts[3]);
    if (!trial || !visit) {
      sendHtml(res, 404, renderNotFoundPage("Visit not found"));
      return;
    }
    sendHtml(res, 200, renderFormsPage(trial, visit));
    return;
  }

  sendHtml(res, 404, renderNotFoundPage("Page not found"));
}

function createServer() {
  return http.createServer(route);
}

module.exports = {
  createServer,
};
