/**
 * React hooks wrappers for Orthanc API.
 */

import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { useMemo } from "preact/hooks";
import {
	getPatientsOptions,
	getSystemOptions,
	getStudiesByIdOptions
} from "./client/@tanstack/react-query.gen";
import { type Client, createClient } from "./client/client";
import type { Patients, Study } from "./types";
import { GetSystemResponse } from "./client";

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

type StudyDetails = {
	RequestedTags: {
		AccessionNumber: string;
		StudyDescription: string;
		ModalitiesInStudy: string;
		StudyInstanceUID: string;
	}
};

function useStudy(client: Client, studyId: string): UseQueryResult<Study & StudyDetails, Error> {
	return useQuery(
		getStudiesByIdOptions({
			client,
			path: {
				id: studyId
			},
			query: {
				"requested-tags": "AccessionNumber;StudyDescription;ModalitiesInStudy;StudyInstanceUID"
			}
		})
	) as UseQueryResult<Study & StudyDetails, Error>;
}

export { useClient, usePatients, useSystem, useStudy };
