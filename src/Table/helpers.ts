import { DICOM_TAGS, type DicomTagName } from "./dicom";

function parseMainDicomTags(value: string): ReadonlyArray<DicomTagName> {
	return value
		.split(";")
		.map((x) => DICOM_TAGS[x])
		.filter((x) => !!x);
}

export { parseMainDicomTags };
