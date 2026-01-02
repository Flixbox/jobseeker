import { getClipboardText, setClipboardText } from "./utils/clipboard";
import { simulatePaste } from "./utils/keyboard";
import { processJobData } from "./jobseeker";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { notifyError } from "./utils/notifications";

const PROMPT_FILE = join(import.meta.dir, "../assets/jobseeking_prompt.md");

async function main() {
	const command = process.argv[2];

	if (command === "paste") {
		await pastePrompt();
	} else if (command === "process") {
		await processJob();
	} else {
		console.log("Usage: bun run src/index.ts [paste|process]");
		console.log("  paste   - Paste the job prompt with clipboard content");
		console.log("  process - Process job data from clipboard");
	}
}

async function pastePrompt() {
	if (!existsSync(PROMPT_FILE)) {
		const msg = `Prompt file not found: ${PROMPT_FILE}`;
		notifyError("File Not Found", msg);
		return;
	}

	const clipboard = getClipboardText();
	const prompt = readFileSync(PROMPT_FILE, "utf-8").replace(
		"<<clipboard>>",
		clipboard,
	);
	setClipboardText(prompt);

	await simulatePaste();
	console.log("✓ Prompt pasted");
}

async function processJob() {
	const clipboard = getClipboardText();
	processJobData(clipboard);
}

main().catch((err) => {
	notifyError(
		"Unexpected Error",
		err instanceof Error ? err.message : String(err),
	);
});
