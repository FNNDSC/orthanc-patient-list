import { Button, Content, Flex, FlexItem } from "@patternfly/react-core";
import { css } from "@patternfly/react-styles";
import Display from "@patternfly/react-styles/css/utilities/Display/display";
import styles from "./style.module.css";
import { useCallback, useEffect } from "preact/hooks";
import { computed, effect, signal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
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

export function StatusBar() {
	const rotateThemePreference = useCallback(() => {
		if (themePreference.value === "light") {
			themePreference.value = "dark";
		} else if (themePreference.value === "auto") {
			themePreference.value = "light";
		} else {
			themePreference.value = "auto";
		}
		localStorage.setItem(STORAGE_KEY, themePreference.value);
	}, []);
	useEffect(() => {
		const storedPreference = localStorage.getItem(STORAGE_KEY);
		console.dir({ storedPreference });
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
		<Flex
			className={styles.statusBar}
			justifyContent={{ default: "justifyContentSpaceBetween" }}
		>
			<FlexItem>
				<Content>
					Patients List UI
					<span className={css(Display.displayNone, Display.displayInlineOnSm)}>
						{" "}
						for <em>Orthanc</em> open-source PACS.
					</span>{" "}
					&copy; 2025 <a href="https://fnndsc.org">FNNDSC</a>
				</Content>
			</FlexItem>
			<FlexItem>
				<Button size="sm" variant="tertiary" onClick={rotateThemePreference}>
					<Show when={isAuto}>{DesktopIcon}</Show>
					<Show when={isLight}>{SunIcon}</Show>
					<Show when={isDark}>{MoonIcon}</Show>
				</Button>
			</FlexItem>
		</Flex>
	);
}
