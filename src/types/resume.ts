export type Classification =
  | "LCA Role"
  | "UI/UX Internship"
  | "Both"
  | "Neither/Uncertain";

export type JobId = "jd1_lca" | "jd2_uiux";

export interface Evaluation {
  score: number;
  evidence: string[];
  missing_criteria: string[];
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  location: string;
  education: string;
  experience_years: number;
  tools: string[];
  skills: string[];
  source_file: string;
  classification: Classification;
  jd1_lca: Evaluation;
  jd2_uiux: Evaluation;
  parse_error?: boolean;
  error_message?: string;
}

export interface JobDescription {
  id: JobId;
  title: string;
  team: string;
  location: string;
  employment: string;
  description: string;
  requirements: string[];
  accent: "green" | "violet";
}

export interface FilterState {
  search: string;
  classification: Classification | "All classifications";
  sort: "score" | "experience";
}
