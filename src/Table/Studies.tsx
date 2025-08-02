import {
	Bullseye,
	Button,
	Card,
	CardBody,
	CardHeader,
	CardTitle,
	Content,
	Grid,
	GridItem,
	Spinner,
	Title,
	Tooltip,
} from "@patternfly/react-core";
import { useClient, useStudy } from "../useOrthanc";
import { useMemo } from "preact/hooks";
import { ExclamationCircleIcon, ThLargeIcon } from "@patternfly/react-icons";
import { ErrorState } from "@patternfly/react-component-groups";

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
		return <Content>{data.RequestedTags.StudyDescription}</Content>;
	}, [isLoading, isError, data]);
	return (
		<Card isCompact>
			{isSuccess && (
				<CardHeader
					actions={{
						actions: (
							<Tooltip content="View in OHIF">
								<Button
									variant="link"
									component="a"
									href={`/ohif/viewer?StudyInstanceUIDs=${data.RequestedTags.StudyInstanceUID}`}
								>
									<ThLargeIcon />
								</Button>
							</Tooltip>
						),
					}}
				>
					<Title headingLevel="h4">
						{data.RequestedTags.AccessionNumber || "(No AccessionNumber)"}
					</Title>
				</CardHeader>
			)}
			<CardBody>{body}</CardBody>
		</Card>
	);
}

export { Studies };
