import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

const ORTHANC_URL = "http://localhost:8042";
const ORTHANC_APIS = [
	"/patients",
	"/studies",
	"/series",
	"/instances",
	"/tools",
];

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact()],
	server: {
		proxy: {
			...Object.fromEntries(ORTHANC_APIS.map((path) => [path, ORTHANC_URL])),
		},
	},
});
