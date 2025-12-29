import { writeFileSync } from "fs";
import { join } from "path";

const VAULT_PATH = "C:\\_dev\\obsidian\\Jobseeker"; // adjust as per original index.ts

export interface JobData {
	company_name: string;
	num_employees: number;
	job_title: string;
	forum_vibe: string;
	forum_vibe_rating: number;
	is_dev_position: boolean;
	not_team_lead_position: boolean;
	not_team_lead_growth_expectation: boolean;
	is_react_role: boolean;
	is_modern_tech_role: boolean;
	fully_remote: boolean;
	occasional_onsite_expected: boolean;
	weekly_onsite_expected: boolean;
	inhouse_position: boolean;
	post_profit: boolean;
	appropriate_industry: boolean;
	calm_environment: boolean;
	suggested_salary: string;
	expected_documents: string;
	application_medium: string;
	red_flags: string[];
	tech_stack: string[];
	full_post: string;
}

export function processJobData(input: string) {
	let sanitizedInput = input.trim();

	// Check for a common artifact where an extra closing brace is appended
	if (sanitizedInput.endsWith("}")) {
		try {
			// If it doesn't parse but would parse without the last brace
			JSON.parse(sanitizedInput);
		} catch {
			const stripped = sanitizedInput.slice(0, -1).trim();
			try {
				JSON.parse(stripped);
				sanitizedInput = stripped;
				console.log("ℹ️ Automatically removed extra trailing '}' from input.");
			} catch {
				// Both versions are invalid, let the original parse fail below
			}
		}
	}

	try {
		const data: JobData = JSON.parse(sanitizedInput);

		const {
			company_name,
			num_employees,
			job_title,
			forum_vibe,
			forum_vibe_rating,
			is_dev_position,
			not_team_lead_position,
			not_team_lead_growth_expectation,
			is_react_role,
			is_modern_tech_role,
			fully_remote,
			occasional_onsite_expected,
			weekly_onsite_expected,
			inhouse_position,
			post_profit,
			appropriate_industry,
			calm_environment,
			suggested_salary,
			expected_documents,
			application_medium,
			red_flags,
			tech_stack,
			full_post,
		} = data;

		// Sanitize filename
		const sanitize = (str: string) =>
			str
				.replace(/[<>:"/\\|?*\n\r]/g, "")
				.trim()
				.slice(0, 80);

		const safeCompany = sanitize(company_name || "UnknownCompany");
		const safeTitle = sanitize(job_title || "UnknownRole");
		const filename = `${safeCompany} - ${safeTitle}.md`;
		const filePath = join(VAULT_PATH, filename);

		const md = `---
company_name: "${safeCompany}"
num_employees: ${num_employees}
job_title: "${safeTitle}"
applied: false
forum_vibe: ${forum_vibe}
forum_vibe_rating: ${forum_vibe_rating}
is_dev_position: ${is_dev_position}
not_team_lead_position: ${not_team_lead_position}
not_team_lead_growth_expectation: ${not_team_lead_growth_expectation}
is_react_role: ${is_react_role}
is_modern_tech_role: ${is_modern_tech_role}
fully_remote: ${fully_remote}
occasional_onsite_expected: ${occasional_onsite_expected}
weekly_onsite_expected: ${weekly_onsite_expected}
inhouse_position: ${inhouse_position}
post_profit: ${post_profit}
appropriate_industry: ${appropriate_industry}
calm_environment: ${calm_environment}
suggested_salary: "${suggested_salary}"
expected_documents: "${expected_documents}"
application_medium: "${application_medium}"
red_flags: ${red_flags}
---

# Job Evaluation — ${safeCompany} / ${safeTitle}

## Forum Vibe

${forum_vibe}

## Red Flags

${(red_flags || []).map((flag) => `🚩 ${flag}`).join("\n")}

## Tech Stack

${(tech_stack || []).map((tech) => `- ${tech}`).join("\n")}

---

## Full Job Post

${full_post}

`;

		writeFileSync(filePath, md, "utf8");
		console.log("✅ Saved:", filePath);
		return true;
	} catch (err: unknown) {
		console.error("❌ Failed to process job data.");
		if (err instanceof SyntaxError) {
			console.error("❌ Input is not valid JSON. Please check the format.");
		} else if (err instanceof Error) {
			console.error(`❌ Error: ${err.message}`);
		} else {
			console.error("❌ An unknown error occurred.");
		}
		return false;
	}
}
