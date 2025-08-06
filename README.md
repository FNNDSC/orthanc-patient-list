# Orthanc Patient List UI

[![License](https://img.shields.io/github/license/FNNDSC/orthanc-patient-list)](https://github.com/FNNDSC/orthanc-patient-list/tree/master#GPL-3.0-1-ov-file)
[![CI](https://github.com/FNNDSC/orthanc-patient-list/actions/workflows/ci.yml/badge.svg)](https://github.com/FNNDSC/orthanc-patient-list/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/FNNDSC/orthanc-patient-list/graph/badge.svg?token=2266ATLFAP)](https://codecov.io/gh/FNNDSC/orthanc-patient-list)

A minimal Orthanc UI showing a list of patients (in contrast to
[OrthancExplorer2](https://github.com/orthanc-server/orthanc-explorer-2)
which shows a list of studies), built using [Preact](https://preactjs.com/)
and [Patternfly](https://www.patternfly.org/).

<video src="https://github.com/user-attachments/assets/943e0bb3-ee2b-4a81-a61a-db3746491be5" controls muted></video>

## Features

- Patient list
- Click row to view studies of patient
- Multi-select studies and view in OHIF comparison mode
- Light or dark theme
- Easy installation as an Orthanc Plugin

## Installation

Download the plugin from https://github.com/FNNDSC/orthanc-patient-list/releases/latest

Pre-compiled binaries are only available for Linux x86_64, and the UI will be
served from the URI path `/pui`. If you want to change this, you need to build
from source.

### Build from Source

Install [Bun](https://bun.com/docs/installation) and [Cargo](https://rustup.rs/),
then run

```shell
bun install
env BASE_PATH=/my/custom/patients_list bun run build:plugin
```

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

## Plugin Wrapper

[./plugin](./plugin) contains a small Rust wrapper which packages the bundled
web app as a native Orthanc plugin using
[orthanc_sdk::serve_static_file](https://docs.rs/orthanc_sdk/0.2.0/orthanc_sdk/fn.serve_static_file.html).

## Notes

- Pagination not _yet_ implemented, so performance will suffer with >1,000 patients.
- Authentication is not handled in the code here because it is not necessary.
  Since this app is deployed as an Orthanc plugin, it will be protected by
  the same mechanism used to secure Orthanc, e.g. built-in basic auth or a
  reverse-proxy e.g. [oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/).
  When Orthanc is configured to use basic auth, the web browser will know to
  prompt for credentials, and it will also include the `Authorization` header
  in every outgoing API request.

