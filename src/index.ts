import { getClipboardText, setClipboardText } from "./utils/clipboard";
import { simulatePaste } from "./utils/keyboard";
import { processJobData } from "./jobseeker";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

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
		console.error("Prompt file not found:", PROMPT_FILE);
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
	if (processJobData(clipboard)) {
		console.log("✓ Job saved");
	}
}

main().catch(console.error);
