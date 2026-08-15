#!/usr/bin/env bash
# Quick curl loop to sanity-check /api/health before trusting the keep-alive cron.
# Usage: ./dev/ping-test.sh [url] [interval_seconds]

URL="${1:-http://localhost:${PORT:-8000}/api/health}"
INTERVAL="${2:-10}"

echo "Pinging $URL every ${INTERVAL}s (Ctrl+C to stop)"

while true; do
  timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  status=$(curl -s -o /dev/null -w '%{http_code}' "$URL")
  echo "[$timestamp] $URL -> $status"
  sleep "$INTERVAL"
done
