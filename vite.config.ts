/// <reference types="vitest/config" />
/**
 * vite.config.ts configuration for:
 *
 * - Preact
 * - Inject build date and build ref to AboutModal
 * - Dev server proxy for Orthanc API
 * - Vitest browser
 * - Test coverage
 * - Codecov bundle analysis
 */

import { defineConfig } from "vite";

import { execFileSync } from "node:child_process";

import preact from "@preact/preset-vite";
import { codecovVitePlugin } from "@codecov/vite-plugin";

const ORTHANC_URL = "http://localhost:8042";
const ORTHANC_APIS = [
	"/patients",
	"/studies",
	"/series",
	"/instances",
	"/tools",
	"/app",
	"/system",
	"/ui",
	"/ohif",
	"/dicom-web",
];

const execOptions = { stdio: "pipe", encoding: "utf-8" } as const;
const buildRef = execFileSync(
	"git",
	["describe", "--always", "--dirty"],
	execOptions,
);
const buildCommit = execFileSync("git", ["rev-parse", "HEAD"], execOptions);

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		preact(),
		codecovVitePlugin({
			enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
			bundleName: "orthanc-patient-list",
			uploadToken: process.env.CODECOV_TOKEN,
		}),
	],
	server: {
		proxy: {
			...Object.fromEntries(ORTHANC_APIS.map((path) => [path, ORTHANC_URL])),
		},
	},
	define: {
		__BUILD_DATE__: JSON.stringify(buildDate()),
		__BUILD_REF__: JSON.stringify(buildRef),
		__BUILD_COMMIT__: JSON.stringify(buildCommit),
	},
	test: {
		coverage: {
			provider: "v8",
			reporter: process.env.CI ? ["json"] : ["text", "json", "html"],
			include: ["src/**"],
			exclude: ["src/client/**"],
		},
		browser: {
			enabled: true,
			provider: "playwright",
			instances: [{ browser: "chromium" }],
		},
	},
});

function buildDate() {
	const now = new Date();
	return now.toISOString().substring(0, 10);
}
