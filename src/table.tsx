import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import { useClient, usePatients } from "./getClient";

export function PatientsTable() {
	const client = useClient(window.location);
	const patients = usePatients(client);
	return (
		<Table variant="compact">
			<Thead>
				<Tr>
					<Th>PatientID</Th>
					<Th>Name</Th>
					<Th>Sex</Th>
					<Th>Date of Birth</Th>
				</Tr>
			</Thead>
			<Tbody>
				{patients.data &&
					patients.data.map((patient) => (
						<Tr key={patient.ID}>
							<Td>{patient.MainDicomTags.PatientID}</Td>
							<Td>{patient.MainDicomTags.PatientName}</Td>
							<Td>{patient.MainDicomTags.PatientSex}</Td>
							<Td>{patient.MainDicomTags.PatientBirthDate}</Td>
						</Tr>
					))}
			</Tbody>
		</Table>
	);
}
