import { writeFileSync } from "fs";
import { join } from "path";
import { notifyError, notifySuccess } from "./utils/notifications";
import { sanitizeJson } from "./utils/json";

const VAULT_PATH = process.env.VAULT_PATH || join(process.cwd(), "vault");

export interface JobData {
	company_name: string;
	forum_vibe: string;
	job_title: string;
	red_flags: string[];
	tech_stack: string[];
	full_post: string;
	[key: string]: unknown;
}

export function processJobData(input: string) {
	const sanitizedInput = sanitizeJson(input);

	try {
		const data: JobData = JSON.parse(sanitizedInput);

		// Sanitize filename
		const sanitize = (str: string) =>
			str
				.replace(/[<>:"/\\|?*\n\r]/g, "")
				.trim()
				.slice(0, 80);

		const safeCompany = sanitize(data.company_name || "UnknownCompany");
		const safeTitle = sanitize(data.job_title || "UnknownRole");
		const filename = `${safeCompany} - ${safeTitle}.md`;
		const filePath = join(VAULT_PATH, filename);

		// Procedurally generate YAML frontmatter
		const yamlFrontmatter = Object.entries(data)
			.filter(([key]) => key !== "full_post")
			.map(([key, value]) => {
				if (Array.isArray(value)) {
					return `${key}: [${value.map((v) => `"${v}"`).join(", ")}]`;
				}
				if (typeof value === "string") {
					return `${key}: "${value.replace(/"/g, '\\"')}"`;
				}
				return `${key}: ${value}`;
			})
			.join("\n");

		const md = `---
${yamlFrontmatter}
applied: false
---

# Job Evaluation — ${safeCompany} / ${safeTitle}

## Forum Vibe

${data.forum_vibe}

## Red Flags

${(data.red_flags || []).map((flag) => `🚩 ${flag}`).join("\n")}

---

## Full Job Post

${data.full_post}
`;

		writeFileSync(filePath, md, "utf8");
		notifySuccess("Job Saved", `Saved to: ${filePath}`);
		return true;
	} catch (err: unknown) {
		if (err instanceof SyntaxError) {
			notifyError("Invalid JSON", "The clipboard content is not valid JSON.");
		} else if (err instanceof Error) {
			notifyError("Error", err.message);
		} else {
			notifyError("Error", "An unknown error occurred.");
		}
		return false;
	}
}
