/**
 * Sanitizes a string that is expected to be JSON.
 * Handles common LLM artifacts like markdown code blocks and trailing characters.
 */
export function sanitizeJson(input: string): string {
	let sanitized = input.trim();

	// Remove markdown code block wrappers if present
	// Match ```json ... ``` or ``` ... ```
	const codeBlockRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/i;
	const match = sanitized.match(codeBlockRegex);
	if (match?.[1]) {
		sanitized = match[1].trim();
	}

	// Remove leading/trailing backticks that might be left over
	sanitized = sanitized.replace(/^```|```$/g, "").trim();

	// Fix common trailing brace issue (sometimes LLMs add an extra one or cut off)
	// If it doesn't parse, try removing a character if it looks like a trailing artifact
	try {
		JSON.parse(sanitized);
		return sanitized;
	} catch {
		// If it ends with extra characters after the last }, try to truncate it
		const lastBraceIndex = sanitized.lastIndexOf("}");
		if (lastBraceIndex !== -1 && lastBraceIndex < sanitized.length - 1) {
			const candidate = sanitized.substring(0, lastBraceIndex + 1);
			try {
				JSON.parse(candidate);
				console.log(
					"ℹ️ Automatically sanitized JSON by truncating trailing artifacts.",
				);
				return candidate;
			} catch {
				// Fall through
			}
		}

		// Try the user's specific fix: remove last char if it's a brace but it failed
		if (sanitized.endsWith("}")) {
			const stripped = sanitized.slice(0, -1).trim();
			try {
				JSON.parse(stripped);
				console.log("ℹ️ Automatically removed extra trailing '}' from input.");
				return stripped;
			} catch {
				// Fall through
			}
		}
	}

	return sanitized;
}
