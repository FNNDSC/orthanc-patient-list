import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PatientsTable } from "./table";
import "@patternfly/react-core/dist/styles/base.css";
import { Page, PageSection } from "@patternfly/react-core";
import { useMemo } from "preact/hooks";
import { Masthead } from "./Masthead";

export function App() {
	const queryClient = useMemo(() => new QueryClient(), []);
	return (
		<QueryClientProvider client={queryClient}>
			<Page isContentFilled masthead={<Masthead />}>
				<PageSection isFilled>
					<PatientsTable />
				</PageSection>
			</Page>
		</QueryClientProvider>
	);
}
