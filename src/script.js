// Old consent links can carry credentials. Clear them without displaying them.
const url = new URL(window.location.href);
if (url.searchParams.has("api_key") || /(?:^#|&)api_key=/.test(url.hash)) {
	history.replaceState(null, "", url.pathname);
}

document.querySelectorAll("[data-copy]").forEach((button) => {
	button.addEventListener("click", async () => {
		const code = document
			.getElementById(button.dataset.copy)
			.querySelector(".code-inner");
		const status = document.getElementById("copy-status");
		try {
			await navigator.clipboard.writeText(code.textContent.trim());
			status.textContent = "Command copied.";
		} catch {
			status.textContent =
				"Could not copy. Select the command and copy it manually.";
		}
	});
});
