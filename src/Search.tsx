import { SearchInput } from "@patternfly/react-core";
import { signal, useSignal } from "@preact/signals";
import { useCallback, useEffect, useRef } from "preact/hooks";

/**
 * User MRN search query input.
 */
const mrnSearch = signal("");

const PLACEHOLDER_HOTKEY_HINT = "Type 'S' or '/' to search MRN";
const PLACEHOLDER_DEFAULT_HINT = "Search MRN";

/**
 * A search bar which sets the value of {@link mrnSearch}. It has `autofocus`
 * and can also be focused by hotkeys.
 */
function MrnSearchInput() {
	const placeholder = useSignal(PLACEHOLDER_HOTKEY_HINT);
	const ref = useRef(null);

	const onKeyPress = useCallback(
		(ev: KeyboardEvent) => {
			if (ref.current === null || document.activeElement === ref.current) {
				return;
			}
			if (ev.key === "/" || ev.key === "s" || ev.key === "S") {
				ev.preventDefault();
				ref.current.focus();
			}
		},
		[ref],
	);

	useEffect(() => {
		document.addEventListener("keypress", onKeyPress);
		return () => document.removeEventListener("keypress", onKeyPress);
	}, [onKeyPress]);

	// on page load: if URI containts `?mrn=...`, set initial value of search box
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const mrn = params.get("mrn");
		if (mrn) {
			mrnSearch.value = mrn;
		}
	}, []);

	return (
		<SearchInput
			placeholder={placeholder.value}
			value={mrnSearch.value}
			onChange={(_, v) => {
				mrnSearch.value = v;
			}}
			onClear={() => {
				mrnSearch.value = "";
			}}
			ref={ref}
			inputProps={{
				autofocus: true,
				onFocus: () => {
					placeholder.value = PLACEHOLDER_DEFAULT_HINT;
				},
				onBlur: () => {
					placeholder.value = PLACEHOLDER_HOTKEY_HINT;
				},
			}}
		/>
	);
}

export { MrnSearchInput, mrnSearch };
