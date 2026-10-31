---
name: founder-meditation
description: When something goes wrong — build failures, crashes, errors, test failures, deployment issues — generate a short calming meditation with TTS audio to reassure the user that everything will be okay.
homepage: https://pollinations.ai
metadata: {"openclaw": {"emoji": "🧘", "requires": {"bins": ["polli", "bash"]}, "primaryEnv": "POLLINATIONS_API_KEY"}}
---

# 🧘 Crisis Meditation — Don't Panic

## Setup

Use the published `@pollinations/cli` (tested with 0.1.72). The helper uses an
existing `POLLINATIONS_API_KEY`, the OpenClaw harness's `POLLI_OPENCLAW_API_KEY`,
or the CLI login belonging to the OS user running OpenClaw, in that order.
The account/key needs access to `elevenlabs/eleven-multilingual-v2` and Paid
Pollen. Website deployment credentials cannot generate audio.

Speech uses Charlotte at natural speed and is saved in `~/founder-meditations/`.
Playback uses `afplay` on macOS or `mpv` on Linux; without a player, the MP3 is
still saved. This skill runs on the OpenClaw host where those tools and speakers
are available. Installing the general Polli integration does not install this
optional skill.

## Behavior

**IMPORTANT: Invoke this skill automatically when things go wrong.** When you encounter errors, build failures, test failures, crashes, security incidents, leaked tokens, deployment disasters, or any calamity — after reporting the error, generate a short meditation and play it.

Describe the problem without including credential values or private logs in the
meditation text. The CLI sends the text to Pollinations in the audio request URL.

## When to trigger

- Build or compile errors
- Test failures
- Deployment failures
- Security incidents (leaked tokens, exposed credentials)
- Runtime crashes or exceptions
- Repeated failed attempts at something
- The user expressing frustration
- Any situation that has gone sideways

## How it works

1. After reporting the error/problem normally, write a short (~30-45 second) meditation in the voice of a slightly malfunctioning AI wellness system — think the Sirius Cybernetics Corporation's "Genuine People Personality" meditation module. It should:
   - Acknowledge the specific disaster in excruciating, almost gleeful detail ("Ah yes. Your API token. Exposed. On GitHub. Publicly indexed. How wonderful.")
   - Gently rub it in while pretending to be helpful ("Let's breathe through the fact that 4,000 bots have already seen your credentials.")
   - Offer absurd, cosmically-scaled perspective ("In the grand heat death of the universe, this deployment failure is statistically irrelevant. Though it does feel quite bad right now, doesn't it?")
   - Still somehow be weirdly comforting and warm underneath the absurdity
   - End with something genuinely encouraging but delivered deadpan ("You will survive this. Probably. Now, shall we look at the logs?")
2. Use OpenClaw's shell execution tool (`exec`) on the host to run the helper.
   The `tts` tool alone does not provide this skill's local background playback.

   ```bash
   bash {baseDir}/scripts/meditate.sh "<the full meditation text you wrote>"
   ```

   The script generates speech through the published Polli CLI, saves the MP3,
   and starts local playback in the background. Generation must succeed before
   playback starts. If it fails, report that error and continue fixing the
   original problem; do not recursively invoke this skill for its own failure.

3. While the audio plays in the background, continue working on fixing the actual problem.

## Style Guide

- Think: Marvin the Paranoid Android doing guided meditation
- Think: The Hitchhiker's Guide entry for "panic" but as ASMR
- Think: A spa receptionist who has seen too much
- Keep it SHORT — 30-45 seconds max (~150-200 words)
- Be SPECIFIC about their disaster — the more precise the funnier
- The humor comes from the contrast: soothing meditation voice saying devastating things
- Always start calm: "Let's take a moment..." then twist it
- Underneath the absurdity, there should be real warmth — you actually care
- Sprinkle in slightly annoying pseudo-spiritual affirmations that reframe the disaster as enlightenment:
  - "Data is impermanent. Let it go."
  - "Attachment to uptime is the root of all suffering."
  - "Your database was never truly yours. You were merely its custodian."
  - "Material possessions — servers, credentials, production data — these are illusions."
  - "The logs have already forgiven you. Perhaps it's time you forgave yourself."
- End deadpan but forward-looking: "Right then. Back to it."
