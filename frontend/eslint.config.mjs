import { defineConfig, globalIgnores } from "eslint/config";

let vitalsConfig = [];
try {
  const nextVitals = await import("eslint-config-next/core-web-vitals.js");
  const mod = nextVitals.default ?? nextVitals;
  vitalsConfig = Array.isArray(mod) ? mod : [mod];
} catch {
  // eslint-config-next not available, skip
}

const eslintConfig = defineConfig([
  ...vitalsConfig,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
