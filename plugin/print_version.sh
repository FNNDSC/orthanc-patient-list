#!/usr/bin/env bash

if [[ "$GITHUB_REF_NAME" = release/* ]]; then
  printf '%s-%s' "${GITHUB_REF_NAME/release\/}" "$(git describe --always)"
else
  printf '%s-%s' "$(date '+%Y%m%d')" "$(git describe --always --dirty)"
fi
