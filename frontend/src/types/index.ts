import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type UserRole = "student" | "company" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: LucideIcon;
  roles?: UserRole[];
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}
