import { initEngine } from "./engine/engine";

fetch("/code.lua")
  .then((res) => {
    if (res.ok) {
      return res.text();
    } else {
      throw new Error("Failed to fetch code.lua");
    }
  })
  .then((code) => {
    console.log(code);

    initEngine(code);
  });
