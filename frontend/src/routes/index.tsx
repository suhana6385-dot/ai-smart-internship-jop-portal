import Privacy from "@/pages/Common/Privacy";
import Terms from "@/pages/Common/Terms";
import CompanyDashboard from "@/pages/Company/Dashboard";
import CompanyProfile from "@/pages/Company/CompanyProfile";
import HomePage from "@/pages/Home/HomePage";
import About from "@/pages/Common/About";
import Contact from "@/pages/Common/Contact";
import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import { MainLayout } from "@/layouts/MainLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { PublicRoute } from "@/routes/PublicRoute";
import { NotFound } from "@/components/ui/NotFound";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { Login } from "@/pages/Auth/Login";
import { Register } from "@/pages/Auth/Register";
import { ForgotPassword } from "@/pages/Auth/ForgotPassword";
import { ResetPassword } from "@/pages/Auth/ResetPassword";
import { Dashboard as StudentDashboard } from "@/pages/Student/Dashboard";
import { Profile as StudentProfile } from "@/pages/Student/Profile";
import { ResumeAnalyzer } from "@/pages/Student/ResumeAnalyzer";
import { ResumeBuilder } from "@/pages/Student/ResumeBuilder";
import { ATSScore } from "@/pages/Student/ATSScore";
import { SkillMatching } from "@/pages/Student/SkillMatching";
import { SkillGap } from "@/pages/Student/SkillGap";
import { CareerRecommendation } from "@/pages/Student/CareerRecommendation";
import { CertificationRecommendation } from "@/pages/Student/CertificationRecommendation";
import { InternshipRecommendation } from "@/pages/Student/InternshipRecommendation";
import { JobRecommendation } from "@/pages/Student/JobRecommendation";
import { IndustryTrend } from "@/pages/Student/IndustryTrend";
import { CoverLetter } from "@/pages/Student/CoverLetter";
import { MockInterview } from "@/pages/Student/MockInterview";
import { ApplicationTracking } from "@/pages/Student/ApplicationTracking";
import { Notifications } from "@/pages/Student/Notifications";
import { Settings as StudentSettings } from "@/pages/Student/Settings";
import { Dashboard as AdminDashboard } from "@/pages/Admin/Dashboard";
import { Students as AdminStudents } from "@/pages/Admin/Students";
import { Companies as AdminCompanies } from "@/pages/Admin/Companies";
import { Jobs as AdminJobs } from "@/pages/Admin/Jobs";
import { Internships as AdminInternships } from "@/pages/Admin/Internships";
import { Reports as AdminReports } from "@/pages/Admin/Reports";
import { Analytics as AdminAnalytics } from "@/pages/Admin/Analytics";

/**
 * Central route configuration.
 *
 * - "/"                    -> MainLayout   (public marketing/site pages)
 * - "/login", "/register"  -> PublicRoute + AuthLayout (signed-out only)
 * - "/dashboard", "/*"     -> ProtectedRoute + DashboardLayout (signed-in only)
 * - "*"                    -> 404 Not Found
 *
 * Auth / Student / Company / Admin *pages* haven't been built yet, so
 * their routes render the generic <ComingSoon /> placeholder. Swap the
 * `element` for the real page component as each one is built — the
 * layout, guard, and path wiring already work end-to-end.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <MainLayout />,
        
         children: [
  { index: true, element: <HomePage /> },
 { path: "about", element: <About /> },
{ path: "contact", element: <Contact /> },
  { path: "privacy", element: <Privacy /> },
  { path: "terms", element: <Terms /> },
],
      },
      {
        element: <PublicRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: "login", element: <Login /> },
              { path: "register", element: <Register /> },
              { path: "forgot-password", element: <ForgotPassword /> },
              { path: "reset-password", element: <ResetPassword /> },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              // Student
              { path: "dashboard", element: <StudentDashboard /> },
              { path: "profile", element: <StudentProfile /> },
              { path: "resume-analyzer", element: <ResumeAnalyzer /> },
              { path: "resume-builder", element: <ResumeBuilder /> },
              { path: "ats-score", element: <ATSScore /> },
              { path: "skill-matching", element: <SkillMatching /> },
              { path: "skill-gap", element: <SkillGap /> },
              { path: "career-recommendation", element: <CareerRecommendation /> },
              { path: "certification-recommendation", element: <CertificationRecommendation /> },
              { path: "internship-recommendation", element: <InternshipRecommendation /> },
              { path: "job-recommendation", element: <JobRecommendation /> },
              { path: "industry-trend", element: <IndustryTrend /> },
              { path: "cover-letter", element: <CoverLetter /> },
              { path: "mock-interview", element: <MockInterview /> },
              { path: "application-tracking", element: <ApplicationTracking /> },
              { path: "notifications", element: <Notifications /> },
              { path: "settings", element: <StudentSettings /> },

              // Company
              { path: "company/dashboard", element: <CompanyDashboard/>},
              { path: "company/profile", element: <CompanyProfile/> },
              { path: "company/post-job", element: <ComingSoon title="Post Job" /> },
              { path: "company/post-internship", element: <ComingSoon title="Post Internship" /> },
              { path: "company/candidate-ranking", element: <ComingSoon title="Candidate Ranking" /> },
              { path: "company/applicants", element: <ComingSoon title="Applicants" /> },
              { path: "company/interviews", element: <ComingSoon title="Interviews" /> },
              { path: "company/reports", element: <ComingSoon title="Company Reports" /> },

              // Admin
              { path: "admin/dashboard", element: <AdminDashboard /> },
              { path: "admin/students", element: <AdminStudents /> },
              { path: "admin/companies", element: <AdminCompanies /> },
              { path: "admin/jobs", element: <AdminJobs /> },
              { path: "admin/internships", element: <AdminInternships /> },
              { path: "admin/certifications", element: <ComingSoon title="Manage Certifications" /> },
              { path: "admin/analytics", element: <AdminAnalytics /> },
              { path: "admin/reports", element: <AdminReports /> },
            ],
          },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
