import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
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
  Trophy,
  Medal,
  Award,
  BriefcaseBusiness,
  GraduationCap,
  Eye,
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  FilterX,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";

type CandidateStatus = "New" | "Shortlisted" | "Interview Scheduled" | "Hired";

interface Candidate {
  id: string;
  name: string;
  appliedPosition: string;
  aiScore: number;
  atsScore: number;
  skillsMatch: number;
  experience: string;
  education: string;
  status: CandidateStatus;
}

const allCandidates: Candidate[] = [
  {
    id: "CND-2101",
    name: "Ananya Sharma",
    appliedPosition: "Frontend Developer Intern",
    aiScore: 96,
    atsScore: 91,
    skillsMatch: 94,
    experience: "1 year",
    education: "B.Tech, Computer Science",
    status: "Shortlisted",
  },
  {
    id: "CND-2102",
    name: "Vikram Singh",
    appliedPosition: "Backend Developer",
    aiScore: 93,
    atsScore: 88,
    skillsMatch: 90,
    experience: "3 years",
    education: "M.Tech, Software Engineering",
    status: "Interview Scheduled",
  },
  {
    id: "CND-2103",
    name: "Karthik Reddy",
    appliedPosition: "UI/UX Design Intern",
    aiScore: 90,
    atsScore: 85,
    skillsMatch: 88,
    experience: "Fresher",
    education: "B.Des, Design",
    status: "Hired",
  },
  {
    id: "CND-2104",
    name: "Priya Menon",
    appliedPosition: "Data Analyst Intern",
    aiScore: 87,
    atsScore: 82,
    skillsMatch: 85,
    experience: "1 year",
    education: "B.Sc, Statistics",
    status: "New",
  },
  {
    id: "CND-2105",
    name: "Rahul Verma",
    appliedPosition: "Data Analyst Intern",
    aiScore: 84,
    atsScore: 80,
    skillsMatch: 81,
    experience: "6 months",
    education: "B.Tech, Information Technology",
    status: "Shortlisted",
  },
  {
    id: "CND-2106",
    name: "Meera Iyer",
    appliedPosition: "Backend Developer",
    aiScore: 81,
    atsScore: 77,
    skillsMatch: 79,
    experience: "2 years",
    education: "B.E, Computer Engineering",
    status: "New",
  },
  {
    id: "CND-2107",
    name: "Ishaan Kapoor",
    appliedPosition: "Frontend Developer Intern",
    aiScore: 78,
    atsScore: 74,
    skillsMatch: 76,
    experience: "1 year",
    education: "B.Tech, Computer Science",
    status: "New",
  },
  {
    id: "CND-2108",
    name: "Divya Patel",
    appliedPosition: "UI/UX Design Intern",
    aiScore: 75,
    atsScore: 70,
    skillsMatch: 73,
    experience: "Fresher",
    education: "B.Des, Visual Communication",
    status: "Shortlisted",
  },
  {
    id: "CND-2109",
    name: "Rohan Gupta",
    appliedPosition: "Product Management Intern",
    aiScore: 71,
    atsScore: 68,
    skillsMatch: 69,
    experience: "2 years",
    education: "MBA, Business Administration",
    status: "New",
  },
  {
    id: "CND-2110",
    name: "Tanvi Rao",
    appliedPosition: "Data Analyst Intern",
    aiScore: 68,
    atsScore: 64,
    skillsMatch: 66,
    experience: "6 months",
    education: "B.Sc, Mathematics",
    status: "New",
  },
];

const jobOptions = Array.from(
  new Set(allCandidates.map((candidate) => candidate.appliedPosition))
);

const scoreRangeOptions = [
  { label: "All Scores", value: "all" },
  { label: "90% and above", value: "90" },
  { label: "80% - 89%", value: "80" },
  { label: "70% - 79%", value: "70" },
  { label: "Below 70%", value: "below70" },
];

const statusStyles: Record<CandidateStatus, string> = {
  New: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  Shortlisted:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  "Interview Scheduled":
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
  Hired:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
};

const PAGE_SIZE = 5;

function getScoreColor(score: number) {
  if (score >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 75) return "text-indigo-600 dark:text-indigo-400";
  return "text-amber-600 dark:text-amber-400";
}

function getRankBadge(rank: number) {
  if (rank === 1)
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/40">
        <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      </div>
    );
  if (rank === 2)
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <Medal className="h-4 w-4 text-slate-500 dark:text-slate-300" />
      </div>
    );
  if (rank === 3)
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/40">
        <Award className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      </div>
    );
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
      {rank}
    </div>
  );
}

export default function CandidateRanking() {
  const [isLoading, setIsLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobFilter, setJobFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [sortDescending, setSortDescending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCandidates(allCandidates);
      setIsLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  const filteredCandidates = useMemo(() => {
    const filtered = candidates.filter((candidate) => {
      const matchesSearch = candidate.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesJob =
        jobFilter === "all" || candidate.appliedPosition === jobFilter;
      const matchesScore =
        scoreFilter === "all" ||
        (scoreFilter === "90" && candidate.aiScore >= 90) ||
        (scoreFilter === "80" &&
          candidate.aiScore >= 80 &&
          candidate.aiScore < 90) ||
        (scoreFilter === "70" &&
          candidate.aiScore >= 70 &&
          candidate.aiScore < 80) ||
        (scoreFilter === "below70" && candidate.aiScore < 70);
      return matchesSearch && matchesJob && matchesScore;
    });

    return filtered.sort((a, b) =>
      sortDescending ? b.aiScore - a.aiScore : a.aiScore - b.aiScore
    );
  }, [candidates, searchQuery, jobFilter, scoreFilter, sortDescending]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCandidates.length / PAGE_SIZE)
  );

  const paginatedCandidates = filteredCandidates.slice(
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

  const handleStatusUpdate = (id: string, newStatus: CandidateStatus) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === id ? { ...candidate, status: newStatus } : candidate
      )
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setJobFilter("all");
    setScoreFilter("all");
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
          <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Candidate Ranking
          </h1>
          <p className="text-sm text-muted-foreground">
            AI-ranked candidates based on match score, skills, and experience.
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
                  placeholder="Search by candidate name..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) =>
                    handleFilterChange(setSearchQuery, e.target.value)
                  }
                />
              </div>
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
              <Select
                value={scoreFilter}
                onValueChange={(value) =>
                  handleFilterChange(setScoreFilter, value)
                }
              >
                <SelectTrigger className="w-full lg:w-52">
                  <SelectValue placeholder="Filter by score" />
                </SelectTrigger>
                <SelectContent>
                  {scoreRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="rounded-xl shrink-0"
                onClick={() => setSortDescending((prev) => !prev)}
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                AI Score {sortDescending ? "High to Low" : "Low to High"}
              </Button>
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
            ) : filteredCandidates.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <Inbox className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  No candidates found
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
                        <TableHead>Rank</TableHead>
                        <TableHead>Candidate</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Applied Position
                        </TableHead>
                        <TableHead>AI Match Score</TableHead>
                        <TableHead className="hidden lg:table-cell">
                          ATS Score
                        </TableHead>
                        <TableHead className="hidden xl:table-cell">
                          Skills Match
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Experience
                        </TableHead>
                        <TableHead className="hidden xl:table-cell">
                          Education
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Status
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCandidates.map((candidate, index) => {
                        const rank =
                          (currentPage - 1) * PAGE_SIZE + index + 1;
                        return (
                          <TableRow key={candidate.id}>
                            <TableCell>{getRankBadge(rank)}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium text-foreground">
                                  {candidate.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {candidate.id}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <BriefcaseBusiness className="h-3.5 w-3.5 shrink-0" />
                                {candidate.appliedPosition}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1 w-28">
                                <span
                                  className={`text-sm font-semibold ${getScoreColor(candidate.aiScore)}`}
                                >
                                  {candidate.aiScore}%
                                </span>
                                <Progress
                                  value={candidate.aiScore}
                                  className="h-1.5"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <span
                                className={`text-sm font-medium ${getScoreColor(candidate.atsScore)}`}
                              >
                                {candidate.atsScore}%
                              </span>
                            </TableCell>
                            <TableCell className="hidden xl:table-cell">
                              <span
                                className={`text-sm font-medium ${getScoreColor(candidate.skillsMatch)}`}
                              >
                                {candidate.skillsMatch}%
                              </span>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                              {candidate.experience}
                            </TableCell>
                            <TableCell className="hidden xl:table-cell">
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                                {candidate.education}
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge
                                variant="outline"
                                className={`rounded-full font-medium ${statusStyles[candidate.status]}`}
                              >
                                {candidate.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex flex-wrap justify-end gap-1.5">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-lg h-8 px-2"
                                  title="View Profile"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-lg h-8 px-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
                                  title="Shortlist"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      candidate.id,
                                      "Shortlisted"
                                    )
                                  }
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="rounded-lg h-8 px-2"
                                  title="Schedule Interview"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      candidate.id,
                                      "Interview Scheduled"
                                    )
                                  }
                                >
                                  <CalendarPlus className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1} -{" "}
                    {Math.min(currentPage * PAGE_SIZE, filteredCandidates.length)}{" "}
                    of {filteredCandidates.length} candidates
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