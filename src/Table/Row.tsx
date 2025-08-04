import { Button, Tooltip } from "@patternfly/react-core";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import { Tbody, Td, Tr } from "@patternfly/react-table";
import { useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useCallback, useEffect, useMemo } from "preact/hooks";
import { mrnSearch } from "../Search";
import type { Patient } from "../types";
import type { DicomTagName } from "./dicom";
import { Studies } from "./Studies";

function PatientRow({
	patient,
	mainTags,
	rowIndex,
	colSpan,
}: {
	rowIndex: number;
	patient: Patient;
	mainTags: ReadonlyArray<DicomTagName>;
	colSpan: number;
}) {
	const isExpanded = useSignal(false);
	const values = useMemo(
		() =>
			mainTags.map((tag): [DicomTagName, string] => [
				tag,
				patient.MainDicomTags?.[tag] ?? "",
			]),
		[patient.MainDicomTags, mainTags],
	);

	// on page load: if URI contains `?expand=...` expand the specified row
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const expanded = params.get("expand");
		if (expanded && parseInt(expanded) === rowIndex) {
			isExpanded.value = true;
		}
	}, []);

	// set URI `?mrn=...&expand=...`
	const updateUri = useCallback(() => {
		const url = new URL(window.location.href);
		const params = isExpanded.value
			? { mrn: mrnSearch.value, expand: `${rowIndex}` }
			: {};
		url.search = new URLSearchParams(params).toString();
		history.replaceState(null, "", url.toString());
	}, []);

	return (
		<Tbody isExpanded={isExpanded.value}>
			<Tr isContentExpanded={isExpanded.value}>
				<Td
					expand={{
						rowIndex,
						isExpanded: isExpanded.value,
						onToggle: () => {
							isExpanded.value = !isExpanded.value;
							updateUri();
						},
						expandId: "patient-expand-",
					}}
				></Td>
				{values.map(([tag, value]) => (
					<Td key={tag} dataLabel={tag}>
						{value}
					</Td>
				))}
				<Td>
					<LinkToOrthancUi patient={patient} />
				</Td>
			</Tr>
			<Tr isExpanded={isExpanded.value}>
				<Td colSpan={colSpan}>
					<Show when={isExpanded}>
						<Studies studies={patient.Studies} />
					</Show>
				</Td>
			</Tr>
		</Tbody>
	);
}

function LinkToOrthancUi({ patient }: { patient: Patient }) {
	const patientId = useMemo(() => patient.MainDicomTags.PatientID, [patient]);
	const urlPath = useMemo(
		() =>
			`/ui/app/#/filtered-studies?PatientID=${encodeURIComponent(`"${patientId}"`)}`,
		[patientId],
	);
	if (!patientId) {
		return "";
	}
	const icon = (
		<Tooltip content={`See studies of "${patientId}" in OrthancExplorer2`}>
			<ExternalLinkAltIcon />
		</Tooltip>
	);
	return (
		<Button size="sm" variant="link" icon={icon} component="a" href={urlPath} />
	);
}

export { PatientRow };
