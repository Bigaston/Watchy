const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

console.log(process.env.URL_BASE);

execSync("npm run engine:build", { stdio: "inherit" });
fs.cpSync(
  path.join(__dirname, "../dist_engine/engine.html"),
  path.join(__dirname, "../public/watchy.html")
);
fs.rmSync(path.join(__dirname, "../dist_engine"), { recursive: true });

execSync("npm run editor:build", { stdio: "inherit" });
execSync("npm run doc:build:prod", { stdio: "inherit" });

fs.cpSync(
  path.join(__dirname, "../docs/_site"),
  path.join(__dirname, "../dist/docs"),
  { recursive: true }
);
