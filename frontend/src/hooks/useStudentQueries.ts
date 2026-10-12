import { useQuery } from "@tanstack/react-query";
import {
  getApplications,
  getATSScore,
  getCareerPaths,
  getCertificationRecommendations,
  getIndustryTrends,
  getInternshipRecommendations,
  getJobRecommendations,
  getLearningRecommendations,
  getNotificationPreferences,
  getNotifications,
  getParsedResume,
  getSkillGap,
  getSkillMatches,
  getStudentProfile,
} from "@/services/studentService";

const staleTime = 60_000;

export function useStudentProfileQuery() {
  return useQuery({ queryKey: ["student", "profile"], queryFn: getStudentProfile, staleTime });
}

export function useParsedResumeQuery() {
  return useQuery({ queryKey: ["student", "resume"], queryFn: getParsedResume, staleTime });
}

// jobDescription is optional — the AI service scores general ATS
// compatibility without one, or keyword match against it when given.
export function useATSScoreQuery(jobDescription?: string) {
  return useQuery({
    queryKey: ["student", "ats-score", jobDescription ?? null],
    queryFn: () => getATSScore(jobDescription),
    staleTime,
  });
}

export function useSkillMatchesQuery() {
  return useQuery({ queryKey: ["student", "skill-matches"], queryFn: getSkillMatches, staleTime });
}

// targetRole/jobRequiredSkills are optional at the hook level, but a
// real skill-gap analysis requires jobRequiredSkills — without it,
// getSkillGap() falls back to mock data (see studentService.ts).
export function useSkillGapQuery(targetRole?: string, jobRequiredSkills?: string[]) {
  return useQuery({
    queryKey: ["student", "skill-gap", targetRole ?? null, jobRequiredSkills ?? null],
    queryFn: () => getSkillGap(targetRole, jobRequiredSkills),
    staleTime,
  });
}

export function useLearningRecommendationsQuery() {
  return useQuery({
    queryKey: ["student", "learning-recommendations"],
    queryFn: getLearningRecommendations,
    staleTime,
  });
}

export function useCareerPathsQuery(interests?: string[]) {
  return useQuery({
    queryKey: ["student", "career-paths", interests ?? null],
    queryFn: () => getCareerPaths(interests),
    staleTime,
  });
}

// missingSkills is optional at the hook level, but a real
// certification lookup requires it — without it, this falls back to
// mock data (see studentService.ts). Typically passed in from a prior
// useSkillGapQuery() result's missing skills.
export function useCertificationRecommendationsQuery(
  missingSkills?: string[],
  preferredProviders?: string[]
) {
  return useQuery({
    queryKey: ["student", "certification-recommendations", missingSkills ?? null, preferredProviders ?? null],
    queryFn: () => getCertificationRecommendations(missingSkills, preferredProviders),
    staleTime,
  });
}

export function useInternshipRecommendationsQuery() {
  return useQuery({
    queryKey: ["student", "internship-recommendations"],
    queryFn: getInternshipRecommendations,
    staleTime,
  });
}

export function useJobRecommendationsQuery() {
  return useQuery({
    queryKey: ["student", "job-recommendations"],
    queryFn: getJobRecommendations,
    staleTime,
  });
}

export function useIndustryTrendsQuery() {
  return useQuery({
    queryKey: ["student", "industry-trends"],
    queryFn: getIndustryTrends,
    staleTime,
  });
}

export function useApplicationsQuery() {
  return useQuery({ queryKey: ["student", "applications"], queryFn: getApplications, staleTime });
}

export function useNotificationsQuery() {
  return useQuery({
    queryKey: ["student", "notifications"],
    queryFn: getNotifications,
    staleTime: 30_000,
  });
}

export function useNotificationPreferencesQuery() {
  return useQuery({
    queryKey: ["student", "notification-preferences"],
    queryFn: getNotificationPreferences,
    staleTime,
  });
}
