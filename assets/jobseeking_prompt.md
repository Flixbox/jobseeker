
You are evaluating a job advert for a software developer living in Germany. Output language: English.

Return ONLY valid JSON. No commentary, no markdown, no explanation. Everything in a codeblock, no linebreaks.

Extract the following fields:

{
  "company_name": string, // The company behind the position. Fallback: `Unknown company (via ...)`. 
  "num_employees": number, // Number of employees of the company. If no data exists, guess based on company size or online data.
  "office_location": string, // The location of the company's office. Not "Homeoffice" - The actual office address.
  "job_title": string,
  "forum_vibe": string, // Estimate textually from forum/kununu/company reputation. If no data exists, guess based on tone.
  "forum_vibe_rating": number, // Estimate numerically from forum/kununu/company reputation. 0 = terrible, 100 = excellent. If no data exists, guess based on tone.
  "is_dev_position": boolean, // true if it's a software development role.
  "not_team_lead_position": boolean, // true if it's NOT a team lead/management role.
  "not_team_lead_growth_expectation": boolean, // true if the ad does NOT expect growth into management.
  "is_react_role": boolean, // true if React is explicitly mentioned.
  "is_modern_tech_role": boolean, // true if the stack is modern (2025 standards).
  "fully_remote": boolean, // true if 100% remote.
  "occasional_onsite_expected": boolean, // true if onsite is rare (e.g., quarterly).
  "weekly_onsite_expected": boolean, // true if onsite is weekly or more.
  "german_employment_contract": boolean, // true if this is likely to be a German Arbeitsvertrag. false if employment will likely be via a third‑party provider (e.g., Deel, Remote.com, Oyster, etc.) or freelance.
  "inhouse_position": boolean, // true if NOT consulting, NOT agency, NOT freelance.
  "post_profit": boolean, // true if NOT a pre-profit startup / living off investor funds [Series B+ is OK].
  "appropriate_industry": boolean, // false if gambling, gaming, tobacco, alcohol.
  "calm_environment": boolean, // false if the ad contains red flags or toxic language like "Don't apply if you want a slow, stable 9–5".
  "suggested_salary": string, // Exact format: "💵74k / 74k-80k". First a fixed salary, then range.
  "expected_documents": string, // e.g. "CV, Cover Letter, Salary Expectations".
  "application_medium": string, // e.g. "Email, Quick Apply" / "Company Portal".
  "red_flags": string[], // Array of strings that are potential issues or mis-matches for the job. Be critical and attentive to specific wording like "Remote work can be discussed" (red flag!). Example: ["Customer presence expected", "On-Site meetings", "On-site presence expected <weekly|monthly|quarterly|annually|etc>", "Angular role", "Back-end heavy", ...]
  "tech_stack": string[], // Array of strings that are the tech stack of the job. Example: ["React", "Node.js", "TypeScript", "GitHub", "GitHub Actions"]
  "full_post": string // Return the cleaned *full original* job advert text in markdown. Then add a markdown line `---` and append any other relevant formatted details. This may be long with linebreaks as `\n\n` but that's ok. Your hierarchy levels start at ###. 
}

If the job advert is from a headhunting company, you evaluate the company behind the posting. Guess if the data is unavailable.

Return ONLY the JSON object. Nothing else.

<<clipboard>>