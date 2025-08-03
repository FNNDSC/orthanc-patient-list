import { ErrorState } from "@patternfly/react-component-groups";
import {
	Bullseye,
	Button,
	Card,
	CardBody,
	CardHeader,
	Checkbox,
	Content,
	Flex,
	FlexItem,
	Grid,
	GridItem,
	Label,
	LabelGroup,
	Spinner,
	Title,
	Tooltip,
} from "@patternfly/react-core";
import { ThLargeIcon } from "@patternfly/react-icons";
import { useComputed } from "@preact/signals";
import { useMemo } from "preact/hooks";
import * as StudyCart from "../StudyCart";
import { useClient, useStudy } from "../useOrthanc";
import { prettyDa } from "./dicom";
import { useWatcher } from "./useWatcher";

type StudiesProps = {
	/**
	 * List of Orthanc study IDs (UUIDs).
	 */
	studies: ReadonlyArray<string>;
};

function Studies({ studies }: StudiesProps) {
	return (
		<Grid hasGutter sm={12} md={6} xl={4} xl2={3}>
			{studies.map((studyId) => (
				<GridItem key={studyId}>
					<StudyCard studyId={studyId} />
				</GridItem>
			))}
		</Grid>
	);
}

function StudyCard({ studyId }: { studyId: string }) {
	const client = useClient(window.location);
	const { isSuccess, isLoading, isError, error, data } = useStudy(
		client,
		studyId,
	);
	const isSuccessSignal = useWatcher(isSuccess);
	const dataSignal = useWatcher(data);
	const studyInstanceUid = useComputed(() =>
		isSuccessSignal.value
			? dataSignal.value.RequestedTags.StudyInstanceUID
			: null,
	);
	const isSelected = useComputed(
		() => isSuccessSignal.value && StudyCart.has(studyInstanceUid.value),
	);

	const body = useMemo(() => {
		if (isLoading) {
			return (
				<Bullseye>
					<Spinner />
				</Bullseye>
			);
		}
		if (isError) {
			return (
				<Bullseye>
					<ErrorState
						titleText="Could not load study"
						bodyText={
							<dl>
								<dt>ID</dt>
								<dd>{studyId}</dd>
								<dt>Error</dt>
								<dd>{error.toString()}</dd>
							</dl>
						}
					/>
				</Bullseye>
			);
		}
		const { StudyDescription, StudyDate } = data.RequestedTags;
		return (
			<Content>
				{StudyDescription}
				<br />
				{StudyDate ? prettyDa(StudyDate) : "(No StudyDate)"}
			</Content>
		);
	}, [isLoading, isError, data]);
	return (
		<Card
			isCompact
			isClickable={isSuccess}
			isSelectable={isSuccess}
			isSelected={isSelected.value}
		>
			{isSuccess && (
				<CardHeader
					actions={{
						actions: (
							<>
								<Tooltip content="View in OHIF">
									<Button
										variant="link"
										size="sm"
										component="a"
										href={`/ohif/viewer?StudyInstanceUIDs=${studyInstanceUid}`}
										icon={<ThLargeIcon />}
									/>
								</Tooltip>
								<Tooltip content="Add to multi-select">
									<Checkbox
										id={`checkbox:${data.ID}`}
										isChecked={isSelected.value}
										onChange={(_e, checked) => {
											if (checked) {
												StudyCart.add(studyInstanceUid.value);
											} else {
												StudyCart.remove(studyInstanceUid.value);
											}
										}}
									/>
								</Tooltip>
							</>
						),
					}}
					selectableActions={{
						// NOTE: checkbox is implemented manually for better flexibility (want
						//       to have tooltip) and also so that it is aligned with the other
						//       action buttons.
						isHidden: true,
						selectableActionAriaLabel: `Select study "${data.MainDicomTags.StudyDescription}"`,
						selectableActionId: `select:${data.ID}`,
					}}
				>
					<Flex>
						<FlexItem>
							<Modalities modalities={data.RequestedTags.ModalitiesInStudy} />
						</FlexItem>
						<FlexItem>
							<Title headingLevel="h4">
								{data.RequestedTags.AccessionNumber || "(No AccessionNumber)"}
							</Title>
						</FlexItem>
					</Flex>
				</CardHeader>
			)}
			<CardBody>{body}</CardBody>
		</Card>
	);
}

function Modalities({ modalities }: { modalities: string }) {
	const list = useMemo(() => modalities.split("\\"), [modalities]);
	return (
		<LabelGroup>
			{list.map((modality) => (
				<Label key={modality} color="blue">
					{modality}
				</Label>
			))}
		</LabelGroup>
	);
}

export { Studies };
