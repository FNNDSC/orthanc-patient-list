{
  description = "Development environment for orthanc-patients-list";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, flake-utils, nixpkgs }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = (import nixpkgs) { inherit system; };
      in
      with pkgs;
      {
        devShell = mkShell {
          buildInputs = [
            # you are assumed to have `podman` installed globally
            podman-compose
            bun
            s5cmd
            biome
          ];
        };
      });
}
