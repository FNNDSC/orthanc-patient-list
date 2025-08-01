type Patient = {
	ID: string;
	IsProtected: boolean;
	IsStable: boolean;
	Labels: ReadonlyArray<string>;
	LastUpdate: string;
	MainDicomTags: { [keys: string]: string };
	Studies: ReadonlyArray<string>;
	Type: "Patient";
};

type Patients = ReadonlyArray<Patient>;

export type { Patients, Patient };
