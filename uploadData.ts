/**
 * Upload directory of DICOM files to Orthanc (and show a progress bar).
 */
import * as path from "node:path";
import { readdir } from "node:fs/promises";
import { SingleBar, Presets } from "cli-progress";

const DATA_DIR = "data";

const files = (await readdir(path.join(import.meta.dir, DATA_DIR)))
	.filter((f) => f.endsWith(".dcm"))
	.map((f) => path.join(import.meta.dir, DATA_DIR, f));

const bar = new SingleBar({}, Presets.shades_classic);
bar.start(files.length, 0);

for (const file of files) {
	let res = await fetch("http://localhost:8042/instances", {
		method: "POST",
		headers: {
			Expect: "",
			"Contnt-Type": "application/dicom",
		},
		body: await Bun.file(file).stream(),
	});
	if (res.status !== 200) {
		throw new Error(`HTTP status ${res.status}`);
	}
	bar.increment();
}

bar.stop();
