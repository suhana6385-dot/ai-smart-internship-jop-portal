import { useEffect, useMemo, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  CalendarClock,
  CalendarPlus,
  RotateCw,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Inbox,
  FilterX,
  Video,
  Building,
  BriefcaseBusiness,
  Clock,
  UserRound,
  AlertCircle,
} from "lucide-react";

type InterviewType = "Online" | "Offline";
type InterviewStatus = "Scheduled" | "Completed" | "Cancelled" | "Rescheduled";

interface Interview {
  id: string;
  candidateName: string;
  appliedPosition: string;
  date: string;
  time: string;
  type: InterviewType;
  round: string;
  interviewer: string;
  status: InterviewStatus;
}

interface NewInterviewForm {
  candidateName: string;
  appliedPosition: string;
  date: string;
  time: string;
  type: InterviewType | "";
  round: string;
  interviewer: string;
}

interface FormErrors {
  candidateName?: string;
  appliedPosition?: string;
  date?: string;
  time?: string;
  type?: string;
  round?: string;
  interviewer?: string;
}

const initialInterviews: Interview[] = [
  {
    id: "INT-3011",
    candidateName: "Meera Iyer",
    appliedPosition: "Backend Developer",
    date: "Jul 21, 2026",
    time: "10:00 AM",
    type: "Online",
    round: "Technical Round 1",
    interviewer: "Aditya Kumar",
    status: "Scheduled",
  },
  {
    id: "INT-3010",
    candidateName: "Vikram Singh",
    appliedPosition: "Backend Developer",
    date: "Jul 20, 2026",
    time: "2:30 PM",
    type: "Online",
    round: "Technical Round 2",
    interviewer: "Sara Thomas",
    status: "Scheduled",
  },
  {
    id: "INT-3009",
    candidateName: "Karthik Reddy",
    appliedPosition: "UI/UX Design Intern",
    date: "Jul 18, 2026",
    time: "11:00 AM",
    type: "Offline",
    round: "Portfolio Review",
    interviewer: "Neha Joshi",
    status: "Completed",
  },
  {
    id: "INT-3008",
    candidateName: "Ananya Sharma",
    appliedPosition: "Frontend Developer Intern",
    date: "Jul 19, 2026",
    time: "3:00 PM",
    type: "Online",
    round: "HR Round",
    interviewer: "Rohit Malhotra",
    status: "Rescheduled",
  },
  {
    id: "INT-3007",
    candidateName: "Rahul Verma",
    appliedPosition: "Data Analyst Intern",
    date: "Jul 17, 2026",
    time: "1:00 PM",
    type: "Online",
    round: "Technical Round 1",
    interviewer: "Aditya Kumar",
    status: "Cancelled",
  },
  {
    id: "INT-3006",
    candidateName: "Divya Patel",
    appliedPosition: "UI/UX Design Intern",
    date: "Jul 16, 2026",
    time: "4:30 PM",
    type: "Offline",
    round: "Design Challenge",
    interviewer: "Neha Joshi",
    status: "Completed",
  },
  {
    id: "INT-3005",
    candidateName: "Rohan Gupta",
    appliedPosition: "Product Management Intern",
    date: "Jul 22, 2026",
    time: "9:30 AM",
    type: "Online",
    round: "HR Round",
    interviewer: "Sara Thomas",
    status: "Scheduled",
  },
  {
    id: "INT-3004",
    candidateName: "Ishaan Kapoor",
    appliedPosition: "Frontend Developer Intern",
    date: "Jul 15, 2026",
    time: "12:00 PM",
    type: "Online",
    round: "Technical Round 1",
    interviewer: "Rohit Malhotra",
    status: "Completed",
  },
];

const statusOptions: InterviewStatus[] = [
  "Scheduled",
  "Completed",
  "Cancelled",
  "Rescheduled",
];

const typeOptions: InterviewType[] = ["Online", "Offline"];

const statusStyles: Record<InterviewStatus, string> = {
  Scheduled:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  Completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  Rescheduled:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
};

const initialFormData: NewInterviewForm = {
  candidateName: "",
  appliedPosition: "",
  date: "",
  time: "",
  type: "",
  round: "",
  interviewer: "",
};

const PAGE_SIZE = 5;

export default function Interviews() {
  const [isLoading, setIsLoading] = useState(true);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<NewInterviewForm>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setInterviews(initialInterviews);
      setIsLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      const matchesSearch = interview.candidateName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || interview.status === statusFilter;
      const matchesType = typeFilter === "all" || interview.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [interviews, searchQuery, statusFilter, typeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInterviews.length / PAGE_SIZE)
  );

  const paginatedInterviews = filteredInterviews.slice(
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

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
    setCurrentPage(1);
  };

  const handleReschedule = (id: string) => {
    setInterviews((prev) =>
      prev.map((interview) =>
        interview.id === id
          ? { ...interview, status: "Rescheduled" }
          : interview
      )
    );
  };

  const handleCancel = (id: string) => {
    setInterviews((prev) =>
      prev.map((interview) =>
        interview.id === id ? { ...interview, status: "Cancelled" } : interview
      )
    );
  };

  const handleFormChange = (field: keyof NewInterviewForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (data: NewInterviewForm): FormErrors => {
    const newErrors: FormErrors = {};
    if (!data.candidateName.trim()) {
      newErrors.candidateName = "Candidate name is required.";
    }
    if (!data.appliedPosition.trim()) {
      newErrors.appliedPosition = "Applied position is required.";
    }
    if (!data.date.trim()) {
      newErrors.date = "Interview date is required.";
    }
    if (!data.time.trim()) {
      newErrors.time = "Interview time is required.";
    }
    if (!data.type.trim()) {
      newErrors.type = "Please select an interview type.";
    }
    if (!data.round.trim()) {
      newErrors.round = "Interview round is required.";
    }
    if (!data.interviewer.trim()) {
      newErrors.interviewer = "Interviewer name is required.";
    }
    return newErrors;
  };

  const handleScheduleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const newInterview: Interview = {
        id: `INT-${Math.floor(1000 + Math.random() * 9000)}`,
        candidateName: formData.candidateName,
        appliedPosition: formData.appliedPosition,
        date: formData.date,
        time: formData.time,
        type: formData.type as InterviewType,
        round: formData.round,
        interviewer: formData.interviewer,
        status: "Scheduled",
      };
      setInterviews((prev) => [newInterview, ...prev]);
      setFormData(initialFormData);
      setIsDialogOpen(false);
      setCurrentPage(1);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
            <CalendarClock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Interviews
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and track all scheduled candidate interviews.
            </p>
          </div>
        </div>
        <Button
          className="rounded-xl font-semibold"
          onClick={() => setIsDialogOpen(true)}
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          Schedule Interview
        </Button>
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
                value={typeFilter}
                onValueChange={(value) =>
                  handleFilterChange(setTypeFilter, value)
                }
              >
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {typeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
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
            ) : filteredInterviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <Inbox className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  No interviews found
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Try adjusting your search or filters, or schedule a new
                  interview to get started.
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
                          Applied Position
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Date &amp; Time
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Type
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Round
                        </TableHead>
                        <TableHead className="hidden xl:table-cell">
                          Interviewer
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedInterviews.map((interview) => (
                        <TableRow key={interview.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">
                                {interview.candidateName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {interview.id}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <BriefcaseBusiness className="h-3.5 w-3.5 shrink-0" />
                              {interview.appliedPosition}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                                {interview.date}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 shrink-0" />
                                {interview.time}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              {interview.type === "Online" ? (
                                <Video className="h-3.5 w-3.5 shrink-0" />
                              ) : (
                                <Building className="h-3.5 w-3.5 shrink-0" />
                              )}
                              {interview.type}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                            {interview.round}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <UserRound className="h-3.5 w-3.5 shrink-0" />
                              {interview.interviewer}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`rounded-full font-medium ${statusStyles[interview.status]}`}
                            >
                              {interview.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-wrap justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-lg h-8 px-2"
                                title="View Candidate"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-lg h-8 px-2 text-amber-600 dark:text-amber-400 hover:text-amber-700"
                                title="Reschedule"
                                onClick={() => handleReschedule(interview.id)}
                              >
                                <RotateCw className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-lg h-8 px-2 text-red-600 dark:text-red-400 hover:text-red-700"
                                title="Cancel Interview"
                                onClick={() => handleCancel(interview.id)}
                              >
                                <XCircle className="h-3.5 w-3.5" />
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
                    {Math.min(currentPage * PAGE_SIZE, filteredInterviews.length)}{" "}
                    of {filteredInterviews.length} interviews
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>Schedule New Interview</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleScheduleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="candidateName">Candidate Name</Label>
              <Input
                id="candidateName"
                placeholder="e.g. Ananya Sharma"
                value={formData.candidateName}
                onChange={(e) =>
                  handleFormChange("candidateName", e.target.value)
                }
                aria-invalid={!!errors.candidateName}
                className={
                  errors.candidateName
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.candidateName && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.candidateName}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="appliedPosition">Applied Position</Label>
              <Input
                id="appliedPosition"
                placeholder="e.g. Frontend Developer Intern"
                value={formData.appliedPosition}
                onChange={(e) =>
                  handleFormChange("appliedPosition", e.target.value)
                }
                aria-invalid={!!errors.appliedPosition}
                className={
                  errors.appliedPosition
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.appliedPosition && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.appliedPosition}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="date">Interview Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleFormChange("date", e.target.value)}
                  aria-invalid={!!errors.date}
                  className={
                    errors.date
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errors.date && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.date}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="time">Interview Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleFormChange("time", e.target.value)}
                  aria-invalid={!!errors.time}
                  className={
                    errors.time
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errors.time && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.time}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="type">Interview Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    handleFormChange("type", value as InterviewType)
                  }
                >
                  <SelectTrigger
                    id="type"
                    className={
                      errors.type
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.type}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="round">Interview Round</Label>
                <Input
                  id="round"
                  placeholder="e.g. Technical Round 1"
                  value={formData.round}
                  onChange={(e) => handleFormChange("round", e.target.value)}
                  aria-invalid={!!errors.round}
                  className={
                    errors.round
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errors.round && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.round}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="interviewer">Interviewer Name</Label>
              <Input
                id="interviewer"
                placeholder="e.g. Aditya Kumar"
                value={formData.interviewer}
                onChange={(e) =>
                  handleFormChange("interviewer", e.target.value)
                }
                aria-invalid={!!errors.interviewer}
                className={
                  errors.interviewer
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.interviewer && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.interviewer}
                </p>
              )}
            </div>

            <DialogFooter className="mt-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl font-semibold">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Schedule Interview
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}