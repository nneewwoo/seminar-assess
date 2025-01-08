#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

PWD="$(dirname "$(readlink -f -- "$0")")"

CHANNEL=""
VERSION=""

function help() {
  local to
  to="$1"

  echo "Usage: $0 <flags>" 1>&"$to"
  echo 1>&"$to"
  echo "flags:" 1>&"$to"
  echo "	--version                                            release version." 1>&"$to"
  echo "	--dist                                               path to store artifacts in." 1>&"$to"
  echo "	--help                                               display this message." 1>&"$to"
}

function error() {
  echo "error: $*" 1>&2
  echo 1>&2
  help 2
  exit 1
}

function info() {
  echo "$@"
}

CONFIG_PATH=""
DIST="release"

function tauri() {
  (cd "$PWD/.." && bun tauri "$@")
}

while [[ $# -gt 0 ]]; do
  case "$1" in
  --help)
    help 1
    exit 1
    ;;
  --version)
    VERSION="$2"
    shift
    shift
    ;;
  --dist)
    DIST="$2"
    shift
    shift
    ;;
  *)
    error "unknown flag $1"
    ;;
  esac
done

[ -z "${VERSION-}" ] && error "--version is not set"

info "building:"
info "	version: $VERSION"
info "	dist: $DIST"

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' exit

CONFIG_PATH=$(readlink -f "$PWD/../crates/seminar-assess-tauri/tauri.conf.release.json")

jq '.version="'"$VERSION"'"' "$CONFIG_PATH" >"$TMP_DIR/tauri.conf.json"

tauri android build \
  --apk \
  --split-per-abi \
  --config "$TMP_DIR/tauri.conf.json"

BUNDLE_DIR=$(readlink -f "$PWD/../crates/seminar-assess-tauri/gen/android/app/build/outputs/")
RELEASE_DIR="$DIST/"
mkdir -p "$RELEASE_DIR"

APKS="$(find "$BUNDLE_DIR/apk" -name "*release.apk")"
if [ -n "$APKS" ]; then
  for APK in $APKS; do
    BASENAME="$(basename "$APK")"
    NEW_NAME=$(echo "$BASENAME" | sed -E 's/(.*)-arm64-release\.apk$/seminar-assess-arm64.apk/')
    NEW_NAME=$(echo "$NEW_NAME" | sed -E 's/(.*)-arm-release\.apk$/seminar-assess-arm.apk/')
    NEW_NAME=$(echo "$NEW_NAME" | sed -E 's/(.*)-x86_64-release\.apk$/seminar-assess-x86_64.apk/')
    NEW_NAME=$(echo "$NEW_NAME" | sed -E 's/(.*)-x86-release\.apk$/seminar-assess-x86.apk/')
    NEW_NAME=$(echo "$NEW_NAME" | sed -E 's/(.*)-universal-release\.apk$/seminar-assess-universal.apk/')
    cp "$APK" "$RELEASE_DIR/$NEW_NAME"
    info "built:"
    info "	- $RELEASE_DIR/$NEW_NAME"
  done
else
  error "No APKs found in $BUNDLE_DIR"
fi
