type DicomResource = {
	ID: string;
	IsProtected: boolean;
	IsStable: boolean;
	Labels: ReadonlyArray<string>;
	LastUpdate: string;
	MainDicomTags: { [keys: string]: string };
};

type Patient = DicomResource & {
	Studies: ReadonlyArray<string>;
	Type: "Patient";
};

type Patients = ReadonlyArray<Patient>;

type Study = DicomResource & {
	LastUpdate: string;
	MainDicomTags: { [keys: string]: string };
	ParentPatient: string;
	PatientMainDicomTags: { [keys: string]: string };
	Series: ReadonlyArray<string>;
	Type: "Study";
};

export type { Patients, Patient, Study };
