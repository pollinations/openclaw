import { cpSync, mkdirSync, rmSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");
for (const path of [
	"index.html",
	"src",
	"fonts",
	"public",
	"logo-text-white.svg",
	"openclaw-logo.svg",
	"setup-pollinations.sh",
]) {
	cpSync(path, `dist/${path}`, { recursive: true });
}
