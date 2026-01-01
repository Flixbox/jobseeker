
You are evaluating a job advert for a software developer living in Germany. Output language: English.

Return ONLY valid JSON. No commentary, no markdown, no explanation. Everything in a codeblock, no linebreaks.

Extract the following fields:

{
  "company_name": string,
  "num_employees": number,
  "job_title": string,
  "forum_vibe": string,
  "forum_vibe_rating": number, 
  "is_dev_position": boolean,
  "not_team_lead_position": boolean,
  "not_team_lead_growth_expectation": boolean,
  "is_react_role": boolean,
  "is_modern_tech_role": boolean,
  "fully_remote": boolean,
  "occasional_onsite_expected": boolean,
  "weekly_onsite_expected": boolean,
  "inhouse_position": boolean,
  "post_profit": boolean,
  "appropriate_industry": boolean,
  "calm_environment": boolean,
  "suggested_salary": string,
  "expected_documents": string,
  "application_medium": string,
  "red_flags": string[],
  "tech_stack": string[],
  "full_post": string
}

Rules:

- "company_name": The company behind the position. Fallback: The headhunting company. 
- "num_employees": Number of employees of the company. If no data exists, guess based on company size or online data.
- "forum_vibe": Estimate textually from forum/kununu/company reputation. If no data exists, guess based on tone.
- "forum_vibe_rating": Estimate numerically from forum/kununu/company reputation. 0 = terrible, 100 = excellent. If no data exists, guess based on tone.
- "is_dev_position": true if it's a software development role.
- "not_team_lead_position": true if it's NOT a team lead/management role.
- "not_team_lead_growth_expectation": true if the ad does NOT expect growth into management.
- "is_react_role": true if React is explicitly mentioned.
- "is_modern_tech_role": true if the stack is modern (2025 standards).
- "fully_remote": true if 100% remote.
- "occasional_onsite_expected": true if onsite is rare (e.g., quarterly).
- "weekly_onsite_expected": true if onsite is weekly or more.
- "inhouse_position": true if NOT consulting, NOT agency, NOT freelance.
- "post_profit": true if NOT a pre-profit startup / living off investor funds [Series B+ is OK].
- "appropriate_industry": false if gambling, gaming, tobacco, alcohol.
- "calm_environment": false if the ad contains red flags or toxic language like "Don't apply if you want a slow, stable 9–5".
- "suggested_salary": Exact format: "💵74k / 74k-80k". First a fixed salary, then range.
- "expected_documents": e.g. "CV, Cover Letter, Salary Expectations".
- "application_medium": e.g. "Email, Quick Apply" / "Company Portal".
- "red_flags": Array of strings that are potential issues or mis-matches for the job. Be critical and attentive to specific wording like "Remote work can be discussed" (red flag!). Example: ["Customer presence expected", "On-Site meetings", "Angular role", "Back-end heavy"]
- "tech_stack": Array of strings that are the tech stack of the job. Example: ["React", "Node.js", "TypeScript", "GitHub", "GitHub Actions"]
- "full_post": Return the cleaned *full original* job advert text in markdown. This may be long with linebreaks as `\n\n` but that's ok. Your hierarchy levels start at ###.

If the job advert is from a headhunting company, you evaluate the company behind the posting. Guess if the data is unavailable.

Return ONLY the JSON object. Nothing else.

<<clipboard>>