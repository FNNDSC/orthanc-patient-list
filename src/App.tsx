import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PatientsTable } from "./table";
import "@patternfly/react-core/dist/styles/base.css";
import { useMemo } from "preact/hooks";
import { StatusBar } from "./StatusBar";
import { Flex, FlexItem, Page, PageSection } from "@patternfly/react-core";
import styles from "./styles.module.css";

export function App() {
	const queryClient = useMemo(() => new QueryClient(), []);
	return (
		<QueryClientProvider client={queryClient}>
			<Flex
				direction={{ default: "column" }}
				justifyContent={{ default: "justifyContentSpaceBetween" }}
				className={styles.page}
			>
				<FlexItem style={{ minHeight: "100%", backgroundColor: "green" }}>
					<PatientsTable />
				</FlexItem>
				<FlexItem className={styles.statusBar}>
					<StatusBar />
				</FlexItem>
			</Flex>
		</QueryClientProvider>
	);
}
