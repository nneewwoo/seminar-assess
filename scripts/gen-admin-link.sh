#!/bin/bash

# set -o errexit
set -o nounset
set -o pipefail

function usage() {
  echo "Usage: $0 --api <api_endpoint>"
  echo
  echo "Arguments:"
  echo "  --api <api_endpoint>   The API endpoint to which the GET request is sent."
  exit 1
}

# Function to generate a random 16-character string with symbols
function generate_random_string() {
  tr -dc 'a-zA-Z0-9!@#$%^&*()_+-=[]{}|;:,.<>?/~' </dev/urandom | head -c 32
}

# Function to URL-encode a string using printf
function url_encode() {
  echo "$(jq -rn --arg x $1 '$x|@uri')"
}

API_URL=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
  --api)
    API_URL="$2"
    shift 2
    ;;
  *)
    usage
    ;;
  esac
done

# Validate API_URL
if [[ -z "$API_URL" ]]; then
  echo "Error: --api argument is required."
  usage
fi

# Generate a random string
RANDOM_STRING=$(generate_random_string)

# URL encode the random string
ENCODED_STRING=$(url_encode "$RANDOM_STRING")

# Construct the full URL
FULL_URL="${API_URL}/account/signup/steps/gen-link/${ENCODED_STRING}"

# Send a GET request to the API
RESPONSE=$(curl -s "$FULL_URL")

LINK=$(echo "$RESPONSE" | jq -r '.body.link')

if [[ -n "$LINK" ]]; then
  echo "Generated link: $LINK"
else
  echo "Failed to generate the link."
  exit 1
fi
