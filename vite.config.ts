/// <reference types="vitest/config" />
import { defineConfig } from "vite";

import { execFileSync } from "node:child_process";

import preact from "@preact/preset-vite";

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
	plugins: [preact()],
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
		// environment: "happy-dom",

		browser: {
			enabled: true,
			provider: 'playwright',
			instances: [
				{
					browser: 'firefox',
					setupFile: [ './vitest.setup.tsx' ]
				}
			]
		},
		
		// // https://testing-library.com/docs/react-testing-library/setup/#auto-cleanup-in-vitest
		// globals: true,

		// server: {
  //     deps: {
		//     // workaround for 'Unknown file extension ".css"'
		//     // See https://github.com/vitest-dev/vitest/discussions/6138
  //       inline: true,
  //     },
  //   },
		// deps: {
		// 	// workaround to make sure preact/compat alias works in dependencies.
		// 	// See https://github.com/vitest-dev/vitest/issues/5915#issuecomment-2179794149
		// 	optimizer: {
		// 		web: {
		// 			enabled: true,
		// 			include: [
		// 				"@patternfly/react-core",
	 //          "@patternfly/react-styles",
		// 			]
		// 		}
		// 	}
		// }
	}
});

function buildDate() {
	const now = new Date();
	return now.toISOString().substring(0, 10);
}
