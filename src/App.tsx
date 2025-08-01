import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PatientsTable } from "./table";
import "@patternfly/react-core/dist/styles/base.css";
import { useMemo } from "preact/hooks";

export function App() {
	const queryClient = useMemo(() => new QueryClient(), []);
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<PatientsTable />
			</QueryClientProvider>
		</>
	);
}
