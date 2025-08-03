import { type ReadonlySignal, useSignal } from "@preact/signals";

/**
 * Adapts a non-signal (e.g. React.js prop or state) to a signal.
 *
 * See https://github.com/preactjs/signals/issues/247
 */
export function useWatcher<T>(value: T): ReadonlySignal<T> {
	const signal = useSignal(value);
	signal.value = value;
	return signal;
}
