import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Users,
  Mail,
  Phone,
  BriefcaseBusiness,
  Eye,
  Download,
  CheckCircle2,
  XCircle,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Inbox,
  FilterX,
} from "lucide-react";

type ApplicantStatus =
  | "New"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Rejected"
  | "Hired";

interface Applicant {
  id: string;
  name: string;
  appliedFor: string;
  email: string;
  phone: string;
  skills: string[];
  experience: string;
  status: ApplicantStatus;
}

const allApplicants: Applicant[] = [
  {
    id: "APP-1042",
    name: "Ananya Sharma",
    appliedFor: "Frontend Developer Intern",
    email: "ananya.sharma@example.com",
    phone: "+1 (555) 234-1123",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    experience: "1 year",
    status: "New",
  },
  {
    id: "APP-1041",
    name: "Rahul Verma",
    appliedFor: "Data Analyst Intern",
    email: "rahul.verma@example.com",
    phone: "+1 (555) 341-8890",
    skills: ["Python", "SQL", "Power BI"],
    experience: "6 months",
    status: "Shortlisted",
  },
  {
    id: "APP-1040",
    name: "Meera Iyer",
    appliedFor: "Backend Developer",
    email: "meera.iyer@example.com",
    phone: "+1 (555) 552-9081",
    skills: ["Node.js", "MongoDB", "AWS"],
    experience: "2 years",
    status: "Interview Scheduled",
  },
  {
    id: "APP-1039",
    name: "Karthik Reddy",
    appliedFor: "UI/UX Design Intern",
    email: "karthik.reddy@example.com",
    phone: "+1 (555) 776-2234",
    skills: ["Figma", "Prototyping", "User Research"],
    experience: "Fresher",
    status: "Hired",
  },
  {
    id: "APP-1038",
    name: "Sneha Kulkarni",
    appliedFor: "Product Management Intern",
    email: "sneha.kulkarni@example.com",
    phone: "+1 (555) 118-3345",
    skills: ["Roadmapping", "Analytics", "Agile"],
    experience: "1 year",
    status: "Rejected",
  },
  {
    id: "APP-1037",
    name: "Arjun Nair",
    appliedFor: "Frontend Developer Intern",
    email: "arjun.nair@example.com",
    phone: "+1 (555) 992-4471",
    skills: ["React", "JavaScript", "CSS"],
    experience: "8 months",
    status: "New",
  },
  {
    id: "APP-1036",
    name: "Priya Menon",
    appliedFor: "Data Analyst Intern",
    email: "priya.menon@example.com",
    phone: "+1 (555) 664-7723",
    skills: ["Excel", "Python", "Tableau"],
    experience: "1 year",
    status: "Shortlisted",
  },
  {
    id: "APP-1035",
    name: "Vikram Singh",
    appliedFor: "Backend Developer",
    email: "vikram.singh@example.com",
    phone: "+1 (555) 220-9987",
    skills: ["Java", "Spring Boot", "SQL"],
    experience: "3 years",
    status: "Interview Scheduled",
  },
  {
    id: "APP-1034",
    name: "Divya Patel",
    appliedFor: "UI/UX Design Intern",
    email: "divya.patel@example.com",
    phone: "+1 (555) 887-3312",
    skills: ["Sketch", "Wireframing", "Figma"],
    experience: "Fresher",
    status: "New",
  },
  {
    id: "APP-1033",
    name: "Rohan Gupta",
    appliedFor: "Product Management Intern",
    email: "rohan.gupta@example.com",
    phone: "+1 (555) 445-6612",
    skills: ["Strategy", "SQL", "Communication"],
    experience: "2 years",
    status: "Rejected",
  },
  {
    id: "APP-1032",
    name: "Ishaan Kapoor",
    appliedFor: "Frontend Developer Intern",
    email: "ishaan.kapoor@example.com",
    phone: "+1 (555) 774-2298",
    skills: ["Vue.js", "TypeScript", "Tailwind CSS"],
    experience: "1 year",
    status: "Shortlisted",
  },
  {
    id: "APP-1031",
    name: "Tanvi Rao",
    appliedFor: "Data Analyst Intern",
    email: "tanvi.rao@example.com",
    phone: "+1 (555) 330-1198",
    skills: ["Python", "R", "Statistics"],
    experience: "6 months",
    status: "Hired",
  },
];

const jobOptions = Array.from(
  new Set(allApplicants.map((applicant) => applicant.appliedFor))
);

const statusOptions: ApplicantStatus[] = [
  "New",
  "Shortlisted",
  "Interview Scheduled",
  "Rejected",
  "Hired",
];

const statusStyles: Record<ApplicantStatus, string> = {
  New: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  Shortlisted:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  "Interview Scheduled":
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  Hired:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
};

const PAGE_SIZE = 5;

export default function ApplicantsManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setApplicants(allApplicants);
      setIsLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      const matchesSearch =
        applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || applicant.status === statusFilter;
      const matchesJob =
        jobFilter === "all" || applicant.appliedFor === jobFilter;
      return matchesSearch && matchesStatus && matchesJob;
    });
  }, [applicants, searchQuery, statusFilter, jobFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredApplicants.length / PAGE_SIZE)
  );

  const paginatedApplicants = filteredApplicants.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleFilterChange = (
    setter: (value: string) => void,
    value: string
  ) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleStatusUpdate = (id: string, newStatus: ApplicantStatus) => {
    setApplicants((prev) =>
      prev.map((applicant) =>
        applicant.id === id ? { ...applicant, status: newStatus } : applicant
      )
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setJobFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-4"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
          <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Applicants Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Review, shortlist, and manage candidates across all your postings.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <Card className="rounded-2xl border-border/60">
          <CardContent className="p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) =>
                    handleFilterChange(setSearchQuery, e.target.value)
                  }
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  handleFilterChange(setStatusFilter, value)
                }
              >
                <SelectTrigger className="w-full lg:w-56">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={jobFilter}
                onValueChange={(value) => handleFilterChange(setJobFilter, value)}
              >
                <SelectTrigger className="w-full lg:w-64">
                  <SelectValue placeholder="Filter by job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs / Internships</SelectItem>
                  {jobOptions.map((job) => (
                    <SelectItem key={job} value={job}>
                      {job}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="rounded-xl shrink-0"
                onClick={clearFilters}
              >
                <FilterX className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>

            {isLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : filteredApplicants.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <Inbox className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  No applicants found
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Try adjusting your search or filters to find the candidates
                  you're looking for.
                </p>
                <Button
                  variant="outline"
                  className="rounded-xl mt-1"
                  onClick={clearFilters}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-xl border border-border/60">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Applied For
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Contact
                        </TableHead>
                        <TableHead className="hidden xl:table-cell">
                          Skills
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Experience
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Status
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedApplicants.map((applicant) => (
                        <TableRow key={applicant.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">
                                {applicant.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {applicant.id}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <BriefcaseBusiness className="h-3.5 w-3.5 shrink-0" />
                              {applicant.appliedFor}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                {applicant.email}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 shrink-0" />
                                {applicant.phone}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <div className="flex flex-wrap gap-1 max-w-[220px]">
                              {applicant.skills.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="rounded-full text-xs font-normal"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                            {applicant.experience}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge
                              variant="outline"
                              className={`rounded-full font-medium ${statusStyles[applicant.status]}`}
                            >
                              {applicant.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-wrap justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-lg h-8 px-2"
                                title="View Resume"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-lg h-8 px-2"
                                title="Download Resume"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-lg h-8 px-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
                                title="Shortlist"
                                onClick={() =>
                                  handleStatusUpdate(applicant.id, "Shortlisted")
                                }
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-lg h-8 px-2 text-red-600 dark:text-red-400 hover:text-red-700"
                                title="Reject"
                                onClick={() =>
                                  handleStatusUpdate(applicant.id, "Rejected")
                                }
                              >
                                <XCircle className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                className="rounded-lg h-8 px-2"
                                title="Schedule Interview"
                                onClick={() =>
                                  handleStatusUpdate(
                                    applicant.id,
                                    "Interview Scheduled"
                                  )
                                }
                              >
                                <CalendarPlus className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1} -{" "}
                    {Math.min(currentPage * PAGE_SIZE, filteredApplicants.length)}{" "}
                    of {filteredApplicants.length} applicants
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground px-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}