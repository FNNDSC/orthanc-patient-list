import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "preact/hooks";
import { getPatientsOptions } from "./client/@tanstack/react-query.gen";
import { Client, createClient } from "./client/client";
import { Patients } from "./types";

function useClient(location: Location) {
	const baseUrl = `${location.protocol}//${location.host}`;
	return useMemo(() => createClient({ baseUrl }), [location]);
}

function usePatients(client: Client): UseQueryResult<Patients, Error> {
	return useQuery(
		getPatientsOptions({
			client,
			query: {
				expand: "true",
			},
		}),
	) as UseQueryResult<Patients, Error>;
}

export { useClient, usePatients };
