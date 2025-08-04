import {
	AboutModal,
	Button,
	Content,
	ContentVariants,
	MastheadBrand,
	MastheadContent,
	MastheadLogo,
	MastheadMain,
	Masthead as PfMasthead,
	Skeleton,
	Title,
	Toolbar,
	ToolbarContent,
	ToolbarItem,
	Tooltip,
} from "@patternfly/react-core";
import { ExclamationCircleIcon, InfoCircleIcon } from "@patternfly/react-icons";
import { useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useCallback, useMemo } from "preact/hooks";
import { MrnSearchInput } from "../Search";
import * as StudyCart from "../StudyCart";
import { useClient, useSystem } from "../useOrthanc";
import ChrisLogo from "./ChRISlogo-color.svg";
import ChrisNodesBackground from "./chris_nodes_gradient.svg";
import { ThemeSelect } from "./ThemeSelect";
import { OpenMultiSelectButton } from "./MultiSelect";

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
							<Show when={StudyCart.hasSome}>
								<Tooltip content="Clear multi-select">
									<Button variant="tertiary" onClick={StudyCart.clear}>
										Cancel
									</Button>
								</Tooltip>
							</Show>
						</ToolbarItem>
						<ToolbarItem>
							<OpenMultiSelectButton />
						</ToolbarItem>
						<ToolbarItem>
							<MrnSearchInput />
						</ToolbarItem>
						<ToolbarItem>
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
