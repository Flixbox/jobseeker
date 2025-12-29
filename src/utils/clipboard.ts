import { spawnSync } from "bun";

export function getClipboardText(): string {
	const proc = spawnSync([
		"powershell",
		"-NoProfile",
		"-Command",
		"Get-Clipboard",
	]);
	return proc.stdout.toString().trim();
}

export function setClipboardText(text: string) {
	// We use a temporary file to avoid command line length limits and encoding issues
	const tmpFile = ".clipboard.tmp";
	process.stdout.write("Setting clipboard...");
	Bun.write(tmpFile, text);
	spawnSync([
		"powershell",
		"-NoProfile",
		"-Command",
		`Get-Content ${tmpFile} -Raw | Set-Clipboard`,
	]);
	process.stdout.write(" Done.\n");
}
