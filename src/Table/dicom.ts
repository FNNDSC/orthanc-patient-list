const DICOM_TAGS = {
	// Note to future self: consider using a library instead?
	// https://github.com/wearemothership/dicom.ts/blob/7dc20af6f8ce397c26ddae681a1464612b6ce16f/src/parser/dictionary.ts

	"0010,0010": "PatientName",
	"0010,0020": "PatientID",
	"0010,0030": "PatientBirthDate",
	"0010,0040": "PatientSex",
	"0010,1000": "OtherPatientIDs",
} as const;

type ValueUnion<T> = { [K in keyof T]: T[K] }[keyof T];
type DicomTagName = ValueUnion<typeof DICOM_TAGS>;
type DicomHex = keyof typeof DICOM_TAGS;

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
	month: "short",
	year: "numeric",
	day: "2-digit",
});

/**
 * Parse and pretty-print DICOM DA (date string).
 */
function prettyDa(da: string): string {
	const date = parseDa(da);
	if (Number.isNaN(date.getTime())) {
		return da;
	}
	return formatDate(date);
}

function parseDa(da: string): Date {
	if (da.length !== 8) {
		return new Date(NaN);
	}
	const year = parseInt(da.substring(0, 4));
	const monthIndex = parseInt(da.substring(4, 6)) - 1;
	const day = parseInt(da.substring(6, 8));
	return new Date(year, monthIndex, day);
}

function formatDate(date: Date): string {
	const parts = DATE_FORMAT.formatToParts(date);
	parts.reverse();
	return parts.map((part) => part.value).join("");
}

export { DICOM_TAGS, prettyDa };
export type { DicomTagName, DicomHex };
