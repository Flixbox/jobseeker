import { writeFileSync } from "fs";
import { join } from "path";

const VAULT_PATH = "C:\\_dev\\obsidian"; // adjust as per original index.ts

export interface JobData {
	company_name: string;
	job_title: string;
	applied: boolean;
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
	full_post: string;
}

export function processJobData(input: string) {
	try {
		const data: JobData = JSON.parse(input);

		const {
			company_name,
			job_title,
			applied,
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
job_title: "${safeTitle}"
applied: ${applied}
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
---

# Job Evaluation — ${safeCompany} / ${safeTitle}

## Summary Table
| Field | Value |
|-------|-------|
| Applied | ${applied} |
| Forum Vibe Rating | ${forum_vibe_rating} |
| Dev Position | ${is_dev_position} |
| Not Team Lead | ${not_team_lead_position} |
| No Team Lead Growth Expectation | ${not_team_lead_growth_expectation} |
| React Role | ${is_react_role} |
| Modern Tech | ${is_modern_tech_role} |
| Fully Remote | ${fully_remote} |
| Occasional Onsite | ${occasional_onsite_expected} |
| Weekly Onsite | ${weekly_onsite_expected} |
| Inhouse Position | ${inhouse_position} |
| Post-Profit | ${post_profit} |
| Appropriate Industry | ${appropriate_industry} |
| Calm Environment | ${calm_environment} |
| Suggested Salary | ${suggested_salary} |
| Expected Documents | ${expected_documents} |
| Application Medium | ${application_medium} |

---

## Full Job Post
\`\`\`
${full_post}
\`\`\`
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
