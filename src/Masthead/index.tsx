import {
	AboutModal,
	Button,
	Content,
	ContentVariants,
	MastheadBrand,
	MastheadContent,
	MastheadLogo,
	MastheadMain,
	MenuToggle,
	Masthead as PfMasthead,
	Select,
	SelectList,
	SelectOption,
	Skeleton,
	Title,
	Toolbar,
	ToolbarContent,
	ToolbarItem,
} from "@patternfly/react-core";
import { ExclamationCircleIcon, InfoCircleIcon } from "@patternfly/react-icons";
import { computed, effect, signal, useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useCallback, useEffect, useMemo } from "preact/hooks";
import { useClient, useSystem } from "../useOrthanc";
import ChrisLogo from "./ChRISlogo-color.svg";
import ChrisNodesBackground from "./chris_nodes_gradient.svg";
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

/**
 * Masthead component showing name of this Orthanc server and a toolbar with
 * AboutModal and dark theme chooser.
 */
function Masthead() {
	const client = useClient(window.location);
	const system = useSystem(client);
	const isAboutModalOpen = useSignal(false);
	const toggleAboutModalOpen = useCallback(() => {
		isAboutModalOpen.value = !isAboutModalOpen.value;
	}, []);
	const title = useMemo(() => {
		if (system.isSuccess) {
			return (
				<div>
					<Title headingLevel="h3">{system.data.Name}</Title>
					<Content component={ContentVariants.small}>Patient List</Content>
				</div>
			);
		} else if (system.isError) {
			return (
				<>
					<ExclamationCircleIcon /> Error loading name.
				</>
			);
		} else {
			return <Skeleton screenreaderText="Loading name" />;
		}
	}, [system]);
	return (
		<PfMasthead>
			<MastheadMain>
				<MastheadBrand>
					<MastheadLogo>{title}</MastheadLogo>
				</MastheadBrand>
			</MastheadMain>
			<MastheadContent>
				<Toolbar>
					<ToolbarContent>
						<ToolbarItem align={{ default: "alignEnd" }}>
							<ThemeSelect />
						</ToolbarItem>
						<ToolbarItem>
							<Button
								variant="plain"
								icon={<InfoCircleIcon />}
								onClick={toggleAboutModalOpen}
							></Button>
						</ToolbarItem>
					</ToolbarContent>
				</Toolbar>
			</MastheadContent>
			<AboutModal
				productName="Orthanc Patient List"
				trademark="&copy; FNNDSC 2025"
				brandImageSrc={ChrisLogo}
				brandImageAlt="ChRIS project logo"
				isOpen={isAboutModalOpen.value}
				onClose={() => {
					isAboutModalOpen.value = false;
				}}
				backgroundImageSrc={ChrisNodesBackground}
			>
				<Content component={ContentVariants.p}>
					A custom user interface for{" "}
					<a href="https://orthanc.uclouvain.be/">Orthanc</a> open-source PACS
					server.
					<br />
					Developed as part of the{" "}
					<a href="https://chrisproject.org/">
						<em>ChRIS</em>
					</a>{" "}
					project.
				</Content>
				<Content>
					<dl>
						<dt>License</dt>
						<dd>
							<a
								href={`https://github.com/FNNDSC/orthanc-patient-list/blob/${__BUILD_COMMIT__}/LICENCE`}
							>
								GPL-3.0
							</a>
						</dd>
						<dt>Build date</dt>
						<dd>{__BUILD_DATE__}</dd>
						<dt>Git ref</dt>
						<dd>{__BUILD_REF__}</dd>
					</dl>
				</Content>
			</AboutModal>
		</PfMasthead>
	);
}

export { Masthead };
