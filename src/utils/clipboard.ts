import { spawnSync } from "bun";
import { writeFileSync, existsSync, unlinkSync } from "fs";
import { join } from "path";

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
	// Use absolute path for the temporary file
	const tmpFile = join(process.cwd(), ".clipboard.tmp");

	try {
		writeFileSync(tmpFile, text, { encoding: "utf8" });

		// We use a more aggressive PowerShell command to set the clipboard.
		// We explicitly set the encoding to UTF8 and use -Raw for the file.
		// We also check for errors.
		const script = `
            $ErrorActionPreference = "Stop"
            try {
                $content = Get-Content -LiteralPath "${tmpFile}" -Raw -Encoding utf8
                Set-Clipboard -Value $content
            } catch {
                Write-Error $_
                exit 1
            }
        `;

		const res = spawnSync(["powershell", "-NoProfile", "-Command", script]);

		if (res.exitCode !== 0) {
			console.error("❌ Set-Clipboard failed!");
			console.error(res.stderr.toString());
		} else {
			// success
		}
	} catch (err) {
		console.error("❌ Error writing temporary clipboard file:", err);
	}
}
