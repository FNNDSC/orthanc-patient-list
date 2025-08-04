import { Button, Tooltip } from "@patternfly/react-core";
import { ThLargeIcon } from "@patternfly/react-icons";
import { computed } from "@preact/signals";
import * as StudyCart from "../StudyCart";

const multiOhif = computed(
	() =>
		`/ohif/viewer?${StudyCart.selectedStudyUids.value.map((studyUid) => `StudyInstanceUIDs=${encodeURIComponent(studyUid)}`).join("&")}&hangingprotocolId=@ohif/hpCompare`,
);

function OpenMultiSelectButton() {
	return (
		<Tooltip content="View multi-select in OHIF">
			<Button
				variant="stateful"
				state="unread"
				isDisabled={StudyCart.isEmpty.value}
				countOptions={{
					count: StudyCart.selectedStudyUids.value.length,
					isRead: false,
				}}
				component="a"
				href={multiOhif.value}
				icon={<ThLargeIcon />}
			/>
		</Tooltip>
	);
}

export { OpenMultiSelectButton };
