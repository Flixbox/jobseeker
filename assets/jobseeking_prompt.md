
You are evaluating a job advert for a software developer living in Germany. Output language: English.

If the job ad is in an attached document, check the document.

Platforms may automatically add "salary estimations". Ignore these and only use the actual text of the job advert.

Return ONLY valid JSON. No commentary, no markdown, no explanation. Everything in a codeblock. Note that in the entire response, characters like `*` or `_` must be escaped unless they're used for formatting. Example: "Entwickler\*in".

Extract the following fields:

{
  "company_name": string, // The company behind the position. Fallback: `Unknown company (via ...)`. 
  "num_employees": number, // Number of employees of the company. If no data exists, guess based on company size or online data.
  "office_location": string, // The location of the company's office. Not "Homeoffice", not my home address - The actual company office address.
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
  "calm_environment": boolean, // false if the ad contains red flags or toxic language like "Don't apply if you want a slow, stable 9–5", "you will have lots of autonomy, you'll be expected to meet deadlines and work on evenings if required".
  "suggested_salary": string, // Exact format: "💵74k / 74k-80k". First a fixed salary, then range.
  "expected_documents": string, // e.g. "CV, Cover Letter, Salary Expectations".
  "application_medium": string, // e.g. "Email, Quick Apply" / "Company Portal".
  "complications": string[], // Mandatory: Array of strings that are potential issues or mis-matches for the job. Be critical and attentive to specific wording like "Remote work can be discussed" (red flag!). Example: ["Customer presence expected", "On-Site meetings", "On-site presence expected <weekly|monthly|quarterly|annually|etc>", "Angular role", "Heavy Back-End Focus: 60% Back-End/20% DevOps/20% Front-End (estimate!)", "No mention of React", ...]
  "tech_stack": string[], // Array of strings that are the tech stack of the job. Example: ["React", "Node.js", "TypeScript", "GitHub", "GitHub Actions"]
  "full_post": string // Return the cleaned *full original* job advert text formatted nicely in markdown. Use linebreaks like `\n\n`. Then add a markdown line `---` and append any other relevant formatted details. This may be long but that's ok. Append any form fields (including responses if available) that you encounter. Append relevant hashtags with the tech stack, company name, the specific hashtag #jobseeker, and other relevant hashtags. Your hierarchy levels start at ###. 
}

If the job advert is from a headhunting company, you evaluate the company behind the posting. Guess if the data is unavailable.

Return ONLY the JSON object. Nothing else.

Override: If any of the following conditions are absolutely certainly true, ignore the formatting and just respond with quotes from the job post that explain the issue and a short explanation from you.

- not a software development position
- the job requires onsite presence weekly or more
- customer presence required
- the job does not offer a German Arbeitsvertrag
- toxic environment

<<clipboard>>