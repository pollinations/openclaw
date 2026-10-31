#!/bin/bash
# Generate meditation audio with the published Polli CLI, then play locally.
# Usage: bash meditate.sh "Your meditation text here"

set -euo pipefail

TEXT="${1:-}"
if [ -z "$TEXT" ]; then
    echo "Usage: meditate.sh \"<meditation text>\""
    exit 1
fi

OUT_DIR="${HOME}/founder-meditations"
mkdir -p "$OUT_DIR"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
OUT_FILE="${OUT_DIR}/meditation-${TIMESTAMP}.mp3"

# Reuse the harness credential when present; otherwise Polli can use its login.
printf '%s' "$TEXT" | \
    POLLINATIONS_API_KEY="${POLLINATIONS_API_KEY:-${POLLI_OPENCLAW_API_KEY:-}}" \
    polli gen audio --model elevenlabs/eleven-multilingual-v2 \
        --voice charlotte --format mp3 --output "$OUT_FILE"

# Return while audio plays so the agent can continue fixing the original issue.
if command -v afplay >/dev/null 2>&1; then
    afplay "$OUT_FILE" >/dev/null 2>&1 &
elif command -v mpv >/dev/null 2>&1; then
    mpv --no-video "$OUT_FILE" >/dev/null 2>&1 &
else
    echo "Audio saved to $OUT_FILE. Install mpv for automatic playback."
fi
