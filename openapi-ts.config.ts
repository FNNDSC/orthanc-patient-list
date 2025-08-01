import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
	input: "https://orthanc.uclouvain.be/api/orthanc-openapi.json",
	output: "src/client",
	plugins: ["@tanstack/react-query"],
});
