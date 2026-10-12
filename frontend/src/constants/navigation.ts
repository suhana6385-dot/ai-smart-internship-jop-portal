import {
  Home,
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  BarChart3,
  Settings,
  Info,
  Mail,
  FileSearch,
  LayoutTemplate,
  Target,
  TrendingUp,
  Compass,
  BadgeCheck,
  GraduationCap,
  LineChart,
  PenSquare,
  MessageSquareText,
  ClipboardList,
  Bell,
  Users2,
  Building2,
  FileBarChart,
} from "lucide-react";
import type { NavItem } from "@/types";

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/", icon: Home },
  { label: "About", path: "/about", icon: Info },
  { label: "Contact", path: "/contact", icon: Mail },
];

export const STUDENT_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: ["student"] },
  { label: "Profile", path: "/profile", icon: User, roles: ["student"] },
  { label: "Resume Analyzer", path: "/resume-analyzer", icon: FileSearch, roles: ["student"] },
  { label: "Resume Builder", path: "/resume-builder", icon: LayoutTemplate, roles: ["student"] },
  { label: "ATS Score", path: "/ats-score", icon: FileText, roles: ["student"] },
  { label: "Skill Matching", path: "/skill-matching", icon: Target, roles: ["student"] },
  { label: "Skill Gap", path: "/skill-gap", icon: TrendingUp, roles: ["student"] },
  { label: "Career Recommendation", path: "/career-recommendation", icon: Compass, roles: ["student"] },
  { label: "Certifications", path: "/certification-recommendation", icon: BadgeCheck, roles: ["student"] },
  { label: "Internships", path: "/internship-recommendation", icon: GraduationCap, roles: ["student"] },
  { label: "Jobs", path: "/job-recommendation", icon: Briefcase, roles: ["student"] },
  { label: "Industry Trends", path: "/industry-trend", icon: LineChart, roles: ["student"] },
  { label: "Cover Letter", path: "/cover-letter", icon: PenSquare, roles: ["student"] },
  { label: "Mock Interview", path: "/mock-interview", icon: MessageSquareText, roles: ["student"] },
  { label: "Applications", path: "/application-tracking", icon: ClipboardList, roles: ["student"] },
  { label: "Notifications", path: "/notifications", icon: Bell, roles: ["student"] },
  { label: "Settings", path: "/settings", icon: Settings, roles: ["student"] },
];

export const COMPANY_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/company/dashboard", icon: LayoutDashboard, roles: ["company"] },
  { label: "Post Job", path: "/company/post-job", icon: Briefcase, roles: ["company"] },
  { label: "Applicants", path: "/company/applicants", icon: User, roles: ["company"] },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, roles: ["admin"] },
  { label: "Students", path: "/admin/students", icon: Users2, roles: ["admin"] },
  { label: "Companies", path: "/admin/companies", icon: Building2, roles: ["admin"] },
  { label: "Jobs", path: "/admin/jobs", icon: Briefcase, roles: ["admin"] },
  { label: "Internships", path: "/admin/internships", icon: GraduationCap, roles: ["admin"] },
  { label: "Reports", path: "/admin/reports", icon: FileBarChart, roles: ["admin"] },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3, roles: ["admin"] },
];

export function getDashboardNavItems(role?: string): NavItem[] {
  switch (role) {
    case "company":
      return COMPANY_NAV_ITEMS;
    case "admin":
      return ADMIN_NAV_ITEMS;
    case "student":
    default:
      return STUDENT_NAV_ITEMS;
  }
}
