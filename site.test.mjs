import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";

test("meditation rejects missing text before calling generation or playback", () => {
	const result = spawnSync(
		"/bin/bash",
		["skills/founder-meditation/scripts/meditate.sh"],
		{
			encoding: "utf8",
			env: { PATH: "/usr/bin:/bin" },
		},
	);
	assert.equal(result.status, 1);
	assert.match(result.stdout, /Usage: meditate\.sh/);
});

test("standalone build contains every referenced local asset and no repository metadata", () => {
	execFileSync(process.execPath, ["build.mjs"]);
	const output = resolve("dist");
	const files = readdirSync(output, { recursive: true });
	for (const file of files) {
		if (!/\.(html|css)$/.test(file)) continue;
		const content = readFileSync(resolve(output, file), "utf8");
		const urls = file.endsWith(".html")
			? [...content.matchAll(/(?:src|href)="([^"]+)"/g)].map(
					(match) => match[1],
				)
			: [...content.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(
					(match) => match[1],
				);
		for (const url of urls) {
			if (/^(?:https?:|#|data:)/.test(url)) continue;
			const target = url.startsWith("/")
				? resolve(output, url.slice(1))
				: resolve(output, dirname(file), url);
			assert.ok(existsSync(target), `${file} references missing asset ${url}`);
		}
	}
	const manifest = JSON.parse(
		readFileSync("dist/public/manifest.json", "utf8"),
	);
	for (const icon of manifest.icons) {
		assert.ok(existsSync(resolve(output, icon.src.slice(1))), icon.src);
	}
	for (const path of [
		".git",
		".github",
		"package.json",
		"README.md",
		"deploy.json",
	]) {
		assert.ok(
			!existsSync(resolve(output, path)),
			`${path} must not be published`,
		);
	}
});
