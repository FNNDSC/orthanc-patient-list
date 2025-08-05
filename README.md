# Orthanc Patient List UI

[![License](https://img.shields.io/github/license/FNNDSC/orthanc-patient-list)](https://github.com/FNNDSC/orthanc-patient-list/tree/master#GPL-3.0-1-ov-file)
[![Test](https://github.com/FNNDSC/orthanc-patient-list/actions/workflows/test.yml/badge.svg)](https://github.com/FNNDSC/orthanc-patient-list/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/FNNDSC/orthanc-patient-list/graph/badge.svg?token=2266ATLFAP)](https://codecov.io/gh/FNNDSC/orthanc-patient-list)

A minimal Orthanc UI showing a list of patients (in constrast to
[OrthancExplorer2](https://github.com/orthanc-server/orthanc-explorer-2)
which shows a list of studies), built using [Preact](https://preactjs.com/)
and [Patternfly](https://www.patternfly.org/).

<video src="https://github.com/user-attachments/assets/943e0bb3-ee2b-4a81-a61a-db3746491be5" controls muted></video>

## Features

- Patient list
- Click row to view studies of patient
- Multi-select studies and view in OHIF comparison mode
- Light or dark theme

## Deployment

TODO

## Development

A [development shell](https://nix.dev/manual/nix/2.30/command-ref/new-cli/nix3-develop) is provided
by [`flake.nix`](./flake.nix), which requires [Nix](https://nixos.org). If you do not want to use
`nix`, you will have to install prerequisite dependencies manually, which include:

- Bun: https://bun.com/docs/installation
- podman-compose: https://github.com/containers/podman-compose/blob/main/README.md#installation
- (Optional) s5cmd: https://github.com/peak/s5cmd/blob/master/README.md#installation

(Optional) run scripts to download sample data and add to Orthanc:

```shell
podman-compose up -d
bun run data
```

This project uses the bun [Bun](https://bun.com) package manager and JavaScript runtime.

```shell
# install dependencies and generate OpenAPI client
bun install

# start Orthanc and a web development server
bun run dev
```

Once you are done, shut down Orthanc:

```shell
podman-compose down
```

