const { execSync, exec } = require("child_process");
const path = require("path");
const fs = require("fs");

execSync("npm run engine:build", { stdio: "inherit" });
execSync("npm run doc:build:prod", { stdio: "inherit" });

fs.cpSync(
  path.join(__dirname, "./docs/_site"),
  path.join(__dirname, "./dist/docs"),
  { recursive: true }
);
