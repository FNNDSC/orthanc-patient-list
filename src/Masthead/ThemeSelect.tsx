import {
	MenuToggle,
	Select,
	SelectList,
	SelectOption,
} from "@patternfly/react-core";
import { computed, effect, signal, useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useCallback, useEffect } from "preact/hooks";
import { DesktopIcon, MoonIcon, SunIcon } from "./themeIcons";

const STORAGE_KEY = "theme-preference";

type ThemePreference = "auto" | "light" | "dark";

function isValid(value?: string): value is ThemePreference {
	return value === "auto" || value === "light" || value === "dark";
}

const themePreference = signal<ThemePreference>("auto");
const isAuto = computed(() => themePreference.value === "auto");
const isDark = computed(() => themePreference.value === "dark");
const isLight = computed(() => themePreference.value === "light");

effect(() => {
	if (themePreference.value === "dark") {
		enableDarkTheme();
	} else if (themePreference.value === "light") {
		enableLightTheme();
	} else {
		if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			enableDarkTheme();
		} else {
			enableLightTheme();
		}
	}
});

function enableLightTheme() {
	document.documentElement.classList.remove("pf-v6-theme-dark");
}

function enableDarkTheme() {
	document.documentElement.classList.add("pf-v6-theme-dark");
}

/**
 * A drop-down menu to select "auto", "light", or "dark" theme.
 */
function ThemeSelect() {
	const isOpen = useSignal(false);
	const onSelect = useCallback((_: Event, value: ThemePreference) => {
		themePreference.value = value;
		isOpen.value = false;
		localStorage.setItem(STORAGE_KEY, themePreference.value);
	}, []);
	const onToggleClick = useCallback(() => {
		isOpen.value = !isOpen.value;
	}, []);
	// On startup, get remembered theme preference from localStorage and
	// addEventListener for `prefers-color-scheme` system change.
	useEffect(() => {
		const storedPreference = localStorage.getItem(STORAGE_KEY);
		if (isValid(storedPreference)) {
			themePreference.value = storedPreference;
		}
		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", ({ matches: isDark }) => {
				if (themePreference.value === "auto") {
					if (isDark) {
						enableDarkTheme();
					} else {
						enableLightTheme();
					}
				}
			});
	}, []);
	return (
		<Select
			isOpen={isOpen.value}
			onSelect={onSelect}
			toggle={(toggleRef) => (
				<MenuToggle
					ref={toggleRef}
					isFullWidth
					onClick={onToggleClick}
					isExpanded={isOpen.value}
					icon={
						<>
							<Show when={isAuto}>{DesktopIcon}</Show>
							<Show when={isLight}>{SunIcon}</Show>
							<Show when={isDark}>{MoonIcon}</Show>
						</>
					}
				/>
			)}
			shouldFocusToggleOnSelect
			popperProps={{ position: "right" }}
		>
			<SelectList>
				<SelectOption
					value="auto"
					icon={DesktopIcon}
					description="Follow system preference"
				>
					System
				</SelectOption>
				<SelectOption
					value="light"
					icon={SunIcon}
					description="Always use light theme"
				>
					Light
				</SelectOption>
				<SelectOption
					value="dark"
					icon={MoonIcon}
					description="Always use dark theme"
				>
					Dark
				</SelectOption>
			</SelectList>
		</Select>
	);
}

export { ThemeSelect };
