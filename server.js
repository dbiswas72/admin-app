const { createServer } = require("./src/server");

const port = Number(process.env.PORT) || 3000;

createServer().listen(port, () => {
  console.log(`Admin App listening on http://127.0.0.1:${port}`);
});
