export type RecommendationContact = { label: string; url: string }

export type Recommendation = {
  id: string;
  displayName: string;
  headline: string;
  seniority: string;
  skills: string[];
  matchingRoles: string[];
  avatarUrl?: string;
  summary?: string;
  availability?: string;
  contact: RecommendationContact
}