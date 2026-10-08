function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function dataAttributes(data) {
  if (!data) return "";
  return Object.entries(data)
    .map(([key, value]) => ` data-${key}="${escapeHtml(value)}"`)
    .join("");
}

module.exports = {
  escapeHtml,
  dataAttributes,
};
