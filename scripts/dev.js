function runTask(name, args, extraEnv = {}) {
  const p = Bun.spawn(["bun", "run", ...args], {
    stdout: "inherit",
    stderr: "inherit",
    env: { ...process.env, ...extraEnv },
  });
  console.log(`🚀 Started ${name} (PID ${p.pid})`);
  return p;
}

const tasks = [
  runTask("watch:entry", ["watch:entry"]),
  runTask("manifest", ["watch:manifest-chromium"]),
  runTask("build:manifest", ["build:manifest-chromium"]),
  runTask("dist", ["watch:dist"], { BROWSER: "chromium" }),
  runTask("uno", ["dev:uno"]),
];

await Promise.all(tasks.map(t => t.exited));