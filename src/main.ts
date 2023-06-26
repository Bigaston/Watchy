import { LuaFactory } from "wasmoon";

const factory = new LuaFactory();
// Create a standalone lua environment from the factory
const lua = await factory.createEngine();

try {
  // Set a JS function to be a global lua function
  lua.global.set("sum", (x: number, y: number) => x + y);
  // Run a lua string
  await lua.doString(`
    print(sum(10, 10))
    function multiply(x, y)
        return x * y
    end
    `);
  // Get a global lua function as a JS function
  const multiply = lua.global.get("multiply");
  console.log(multiply(10, 10));
} finally {
  // Close the lua environment, so it can be freed
  lua.global.close();
}
