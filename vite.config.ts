import preact from "@preact/preset-vite";
import { defineConfig } from "vite";

const ORTHANC_URL = "http://localhost:8042";
const ORTHANC_APIS = [
	"/patients",
	"/studies",
	"/series",
	"/instances",
	"/tools",
	"/system",
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
