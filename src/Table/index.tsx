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
import { computed, useComputed } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import type { UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "preact/hooks";
import { mrnSearch } from "../Search";
import type { Patients } from "../types";
import { useClient, usePatients, useSystem } from "../useOrthanc";
import type { DicomTagName } from "./dicom";
import { parseMainDicomTags } from "./helpers";
import { PatientRow } from "./Row";
import { useWatcher } from "./useWatcher";

const DEFAULT_COLUMNS = [
	"PatientName",
	"PatientID",
	"PatientBirthDate",
	"PatientSex",
];

/**
 * Number of hard-coded table columns containing special fields. There are two:
 *
 * 1. "Expand" button
 * 2. "Link to OrthancExplorer2" button
 */
const NUMBER_OF_SPECIAL_COLUMNS = 2;

/**
 * Table of patient data.
 *
 * NOTE: pagination is _not_ handled. For now, we expect the number of patients
 * to be 50-75, which is OK to get all in one request.
 */
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
		<Table variant="compact" isExpandable>
			<Thead>
				<Tr>
					<Th screenReaderText="Row expansion" />
					{mainTags.map((name) => (
						<Th key={name}>{name}</Th>
					))}
					<Th screenReaderText="Actions" />
				</Tr>
			</Thead>
			<TableBody patients={patients} mainTags={mainTags} />
		</Table>
	);
}

function TableBody({
	patients,
	mainTags,
}: {
	patients: UseQueryResult<Patients, Error>;
	mainTags: ReadonlyArray<DicomTagName>;
}) {
	const patientsData = useWatcher(patients.data);
	const mrnSearchLower = useComputed(() => mrnSearch.value.toLowerCase());
	const filteredPatients = useComputed(() =>
		patientsData.value.filter((p) =>
			p.MainDicomTags.PatientID.toLowerCase().includes(mrnSearchLower.value),
		),
	);
	const colSpan = useMemo(
		() => mainTags.length + NUMBER_OF_SPECIAL_COLUMNS,
		[mainTags],
	);
	if (patients.isLoading) {
		return <SkeletonTableBody rowsCount={10} columnsCount={mainTags.length} />;
	}
	if (patients.isSuccess && filteredPatients.value.length > 0) {
		return (
			<>
				{filteredPatients.value.map((patient, rowIndex) => (
					<PatientRow
						key={patient.ID}
						{...{ patient, rowIndex, mainTags, colSpan }}
					/>
				))}
			</>
		);
	}

	const errorMessage =
		patients.isSuccess && filteredPatients.value.length === 0 ? (
			<EmptyPatients />
		) : (
			<ErrorState
				titleText="Something went wrong."
				bodyText={patients.error.toString()}
			/>
		);
	return (
		<Tbody>
			<Tr>
				<Td colSpan={mainTags.length + NUMBER_OF_SPECIAL_COLUMNS}>
					<Bullseye>{errorMessage}</Bullseye>
				</Td>
			</Tr>
		</Tbody>
	);
}

const isSearchInputEmpty = computed(() => mrnSearch.value.length === 0);
const isSearchInputSome = computed(() => !isSearchInputEmpty.value);

function EmptyPatients() {
	return (
		<EmptyState
			titleText="No patients found"
			headingLevel="h2"
			icon={SearchIcon}
			variant={EmptyStateVariant.sm}
		>
			<Show when={isSearchInputSome}>
				<EmptyStateBody>Clear all filters and try again.</EmptyStateBody>
				<EmptyStateFooter>
					<EmptyStateActions>
						<Button
							variant="link"
							onClick={() => {
								mrnSearch.value = "";
							}}
						>
							Clear all filters
						</Button>
					</EmptyStateActions>
				</EmptyStateFooter>
			</Show>
			<Show when={isSearchInputEmpty}>
				<EmptyStateBody>Please upload data to Orthanc.</EmptyStateBody>
				<EmptyStateFooter>
					<EmptyStateActions>
						<Button variant="link" component="a" href="/ui/app/">
							Go to <code>OrthancExplorer2</code>
						</Button>
					</EmptyStateActions>
				</EmptyStateFooter>
			</Show>
		</EmptyState>
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

export { NUMBER_OF_SPECIAL_COLUMNS };
