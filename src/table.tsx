import {
	ErrorState,
	SkeletonTable,
	SkeletonTableBody,
} from "@patternfly/react-component-groups";
import {
	Bullseye,
	Button,
	EmptyState,
	EmptyStateActions,
	EmptyStateBody,
	EmptyStateFooter,
	EmptyStateVariant,
} from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";
import {
	Table,
	TableVariant,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from "@patternfly/react-table";
import type { UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "preact/hooks";
import type { DicomTagName } from "./dicom";
import { parseMainDicomTags } from "./helpers";
import type { Patient, Patients } from "./types";
import { useClient, usePatients, useSystem } from "./useOrthanc";

const DEFAULT_COLUMNS = [
	"PatientName",
	"PatientID",
	"PatientBirthDate",
	"PatientSex",
];

export function PatientsTable() {
	const client = useClient(window.location);
	const patients = usePatients(client);
	const system = useSystem(client);

	const mainTags = useMemo(() => {
		const value = system.data?.MainDicomTags?.Patient as string | undefined;
		if (!value) {
			return null;
		}
		return parseMainDicomTags(value).filter((name) =>
			DEFAULT_COLUMNS.find((t) => name === t),
		);
	}, [system.data]);

	if (!mainTags) {
		return <Loading />;
	}

	return (
		<Table variant="compact">
			<Thead>
				<Tr>
					{mainTags.map((name) => (
						<Th key={name}>{name}</Th>
					))}
				</Tr>
			</Thead>
			<TableBody patients={patients} mainTags={mainTags} onClear={() => {}} />
		</Table>
	);
}

function TableBody({
	patients,
	mainTags,
	onClear,
}: {
	patients: UseQueryResult<Patients, Error>;
	mainTags: ReadonlyArray<DicomTagName>;
	onClear: () => void;
}) {
	if (patients.isLoading) {
		return <SkeletonTableBody rowsCount={10} columnsCount={mainTags.length} />;
	}
	if (patients.isSuccess && patients.data.length > 0) {
		return (
			<Tbody>
				{patients.data.map((patient) => (
					<PatientRow key={patient.ID} patient={patient} mainTags={mainTags} />
				))}
			</Tbody>
		);
	}
	if (patients.isSuccess && patients.data.length === 0) {
		return (
			<Tbody>
				<Tr>
					<Td colSpan={mainTags.length}>
						<Bullseye>
							<EmptyState
								titleText="No patients found"
								headingLevel="h2"
								icon={SearchIcon}
								variant={EmptyStateVariant.sm}
							>
								<EmptyStateBody>
									Clear all filters and try again.
								</EmptyStateBody>
								<EmptyStateFooter>
									<EmptyStateActions>
										<Button variant="link" onChange={onClear}>
											Clear all filters
										</Button>
									</EmptyStateActions>
								</EmptyStateFooter>
							</EmptyState>
						</Bullseye>
					</Td>
				</Tr>
			</Tbody>
		);
	}
	return (
		<Tbody>
			<Tr>
				<Td colSpan={mainTags.length}>
					<ErrorState
						titleText="Something went wrong."
						bodyText={patients.error.toString()}
					/>
				</Td>
			</Tr>
		</Tbody>
	);
}

function PatientRow({
	patient,
	mainTags,
}: {
	patient: Patient;
	mainTags: ReadonlyArray<DicomTagName>;
}) {
	const values = useMemo(
		() =>
			mainTags.map((tag): [DicomTagName, string] => [
				tag,
				patient.MainDicomTags?.[tag] ?? "",
			]),
		[patient.MainDicomTags, mainTags],
	);
	return (
		<Tr>
			{values.map(([tag, value]) => (
				<Td key={tag}>{value}</Td>
			))}
		</Tr>
	);
}

function Loading() {
	return (
		<SkeletonTable
			rowsCount={10}
			columns={DEFAULT_COLUMNS}
			variant={TableVariant.compact}
		/>
	);
}
