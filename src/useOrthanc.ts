/**
 * React hooks wrappers for Orthanc API.
 */

import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { useMemo } from "preact/hooks";
import type { GetSystemResponse } from "./client";
import {
	getPatientsOptions,
	getSystemOptions,
} from "./client/@tanstack/react-query.gen";
import { type Client, createClient } from "./client/client";
import type { Patients } from "./types";

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

function useSystem(client: Client): UseQueryResult<GetSystemResponse, Error> {
	return useQuery(
		getSystemOptions({
			client,
		}),
	);
}

export { useClient, usePatients, useSystem };
