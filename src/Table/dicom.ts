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

export { DICOM_TAGS };
export type { DicomTagName, DicomHex };
