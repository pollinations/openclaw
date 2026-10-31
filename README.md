# Pollinations × OpenClaw

[![Made with pollinations.ai](https://cdn.jsdelivr.net/npm/@pollinations/ui@0.1.0-alpha.25/dist/brand/badge-made-with.svg)](https://pollinations.ai)

Setup website for connecting your own OpenClaw installation to Pollinations.
The OpenClaw runtime and Polli CLI are maintained separately.
Agent skills stay in the [Pollinations monorepo](https://github.com/pollinations/pollinations/tree/main/apps/openclaw/skills);
this repository publishes only the setup website and legacy installer shim.

Use **Pollinations AI models** as your OpenClaw brain through a single API.

The maintained setup path is the Polli CLI. It adds a `pollinations` provider
to OpenClaw, mints a dedicated API key, pulls the current compatible model
catalog live (no manual model list to maintain), and installs the Polli skill
so your agent can generate images, audio, and video.

## Setup

**Prerequisite:** install [OpenClaw](https://openclaw.ai/install) and Node.js.

**Step 1:** Install the Polli CLI:

```bash
npm i -g @pollinations/cli
```

**Step 2:** Connect OpenClaw to Pollinations:

```bash
polli harness openclaw on
```

This opens a browser login on first run (or use `--no-browser`), creates a
dedicated key, initializes OpenClaw when needed, and writes the provider into
`~/.openclaw/openclaw.json`. Choose a different default model with `--model
<id>` (any tool-calling text model from `polli models`):

```bash
polli harness openclaw on --model deepseek
```

**Step 3:** See that everything is ready:

```bash
polli harness openclaw status
```

## Using it in OpenClaw

- **Switch models** anytime in chat with `/model pollinations/<name>`.
- **Generate media** with the Polli skill (e.g. "generate an image of a
  lighthouse") once the gateway is running.

## Update / remove

```bash
polli harness openclaw status   # is OpenClaw ready to use Pollinations?
polli harness openclaw off      # remove only the Pollinations setup
```

`off` restores the previous config. If you changed anything since `on`, it
removes only the Pollinations provider, the dedicated key, a `pollinations/*`
default model, and the skill — leaving the rest of your OpenClaw configuration
untouched.

## Legacy one-liner

The old `curl ... | bash -s -- KEY` script still works and forwards to the
same published CLI. The key is passed through the process environment; the
website never receives it:

```bash
curl -fsSL https://raw.githubusercontent.com/pollinations/openclaw/main/setup-pollinations.sh | bash -s -- YOUR_API_KEY
```

## Links

- **API Docs:** https://gen.pollinations.ai/docs
- **Get API Key:** https://enter.pollinations.ai/keys
- **Models:** https://gen.pollinations.ai/v1/models
- **Website:** https://openclaw.pollinations.app
- **GitHub:** https://github.com/pollinations/openclaw
- **Discord:** https://discord.gg/k9F7SyTgqn

## Development and deployment

This is a static site with no runtime npm dependencies. Use Node.js 24 or newer:

```bash
npm ci
npm test
npm run build
python3 -m http.server 16389 --directory dist --bind 127.0.0.1
```

Open `http://127.0.0.1:16389`. The build copies only public assets into `dist`.
The page uses the published CLI for setup; it does not sign in, generate content,
or receive API keys in the browser.

Merge changes into `main`, then promote `main` to `production` through a PR.
With `AUTO_DEPLOY=true`, each production push calls the same pinned
[shared Sites workflow](https://github.com/pollinations/pollinations/blob/75c8b4c4c409ce6537b8fb73c054c0155617a7f9/.github/workflows/deploy-pollinations-site.yml)
as Websim, CatGPT and Sirius. It builds/tests without a deployment credential,
then publishes `dist` as `openclaw` and verifies every file with the released
`@pollinations/cli@0.1.72` on a separate runner.

`POLLINATIONS_API_KEY` belongs in this repository's GitHub `production`
environment. The CI key needs Sites (`account:machines`) access under Polli's
account, with zero generation budget and no model access. Never put it in the
site or build job. Manual deployments use the same workflow on `production`.

The migration keeps the existing `.ai` deployment available until the `.app`
site passes validation. After cutover, `.ai` redirects to `.app`. Roll back by
reverting the source change and promoting the revert; routing can return to the
retained Pages deployment while a failed migration is investigated.

## Attribution

Extracted from `pollinations/pollinations/apps/openclaw` at `a69766cd10`,
preserving 22 app-history commits and their authors. Historical secret-like
strings in the optional meditation script are redacted in this repository's
copied history. MIT license retained. The OpenClaw and Pollinations names,
logos, and the original Builders Night attribution remain credited to their owners.
