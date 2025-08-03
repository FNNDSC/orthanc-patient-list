import { computed, signal } from "@preact/signals";

const selectedStudyUids = signal<ReadonlyArray<string>>([]);
const isEmpty = computed(() => selectedStudyUids.value.length === 0);
const hasSome = computed(() => !isEmpty.value);

function clear() {
	selectedStudyUids.value = [];
}

function add(studyInstanceUid: string) {
	selectedStudyUids.value = selectedStudyUids.value.concat([studyInstanceUid]);
}

function remove(studyInstanceUid: string) {
	selectedStudyUids.value = selectedStudyUids.value.filter(
		(u) => u !== studyInstanceUid,
	);
}

function has(studyInstanceUID: string): boolean {
	return !!selectedStudyUids.value.find((u) => u === studyInstanceUID);
}

export { clear, isEmpty, hasSome, add, has, remove, selectedStudyUids };
