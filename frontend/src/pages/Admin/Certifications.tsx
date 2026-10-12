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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  BadgeCheck,
  Award,
  CheckCircle2,
  Search,
  Plus,
  Download,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  FilterX,
  Building2,
  Clock3,
  Tag,
  AlertCircle,
} from "lucide-react";

type CertificationStatus = "Active" | "Inactive" | "Draft";

interface Certification {
  id: string;
  name: string;
  provider: string;
  category: string;
  duration: string;
  status: CertificationStatus;
}

interface CertificationForm {
  name: string;
  provider: string;
  category: string;
  duration: string;
  status: CertificationStatus | "";
}

interface FormErrors {
  name?: string;
  provider?: string;
  category?: string;
  duration?: string;
  status?: string;
}

const initialCertifications: Certification[] = [
  {
    id: "CERT-101",
    name: "Full Stack Web Development",
    provider: "NovaTech Academy",
    category: "Software Development",
    duration: "8 weeks",
    status: "Active",
  },
  {
    id: "CERT-102",
    name: "Data Analytics with Python",
    provider: "DataWave Institute",
    category: "Data Science",
    duration: "6 weeks",
    status: "Active",
  },
  {
    id: "CERT-103",
    name: "UI/UX Design Fundamentals",
    provider: "PixelCraft School",
    category: "Design",
    duration: "4 weeks",
    status: "Active",
  },
  {
    id: "CERT-104",
    name: "Cloud Computing with AWS",
    provider: "CloudReady Academy",
    category: "Cloud Computing",
    duration: "10 weeks",
    status: "Draft",
  },
  {
    id: "CERT-105",
    name: "Digital Marketing Essentials",
    provider: "MarketPro Institute",
    category: "Marketing",
    duration: "5 weeks",
    status: "Inactive",
  },
  {
    id: "CERT-106",
    name: "Machine Learning Foundations",
    provider: "AI Learning Hub",
    category: "AI & Machine Learning",
    duration: "12 weeks",
    status: "Active",
  },
  {
    id: "CERT-107",
    name: "Project Management Basics",
    provider: "LeadWay Academy",
    category: "Management",
    duration: "6 weeks",
    status: "Active",
  },
  {
    id: "CERT-108",
    name: "Cybersecurity Essentials",
    provider: "SecureNet Institute",
    category: "Cybersecurity",
    duration: "8 weeks",
    status: "Draft",
  },
];

const categoryOptions = Array.from(
  new Set(initialCertifications.map((cert) => cert.category))
);

const statusOptions: CertificationStatus[] = ["Active", "Inactive", "Draft"];

const statusStyles: Record<CertificationStatus, string> = {
  Active:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  Inactive: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  Draft: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
};

const initialFormData: CertificationForm = {
  name: "",
  provider: "",
  category: "",
  duration: "",
  status: "",
};

const PAGE_SIZE = 6;

export default function CertificationsManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CertificationForm>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [certToDelete, setCertToDelete] = useState<Certification | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCertifications(initialCertifications);
      setIsLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  const totalCertifications = certifications.length;
  const activeCertifications = certifications.filter(
    (cert) => cert.status === "Active"
  ).length;

  const filteredCertifications = useMemo(() => {
    return certifications.filter((cert) => {
      const matchesSearch =
        cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.provider.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || cert.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || cert.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [certifications, searchQuery, categoryFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCertifications.length / PAGE_SIZE)
  );

  const paginatedCertifications = filteredCertifications.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleFilterChange = (setter: (value: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const handleFormChange = (field: keyof CertificationForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (data: CertificationForm): FormErrors => {
    const newErrors: FormErrors = {};
    if (!data.name.trim()) {
      newErrors.name = "Certification name is required.";
    }
    if (!data.provider.trim()) {
      newErrors.provider = "Provider name is required.";
    }
    if (!data.category.trim()) {
      newErrors.category = "Category is required.";
    }
    if (!data.duration.trim()) {
      newErrors.duration = "Duration is required.";
    }
    if (!data.status.trim()) {
      newErrors.status = "Please select a status.";
    }
    return newErrors;
  };

  const handleAddCertification = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const newCertification: Certification = {
        id: `CERT-${Math.floor(100 + Math.random() * 900)}`,
        name: formData.name,
        provider: formData.provider,
        category: formData.category,
        duration: formData.duration,
        status: formData.status as CertificationStatus,
      };
      setCertifications((prev) => [newCertification, ...prev]);
      setFormData(initialFormData);
      setIsDialogOpen(false);
      setCurrentPage(1);
    }
  };

  const confirmDelete = () => {
    if (certToDelete) {
      setCertifications((prev) =>
        prev.filter((cert) => cert.id !== certToDelete.id)
      );
      setCertToDelete(null);
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
            <BadgeCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Certifications Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage certification programs available to students on the platform.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="rounded-xl">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            className="rounded-xl font-semibold"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Certification
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2">
        {[
          {
            icon: Award,
            label: "Total Certifications",
            value: totalCertifications,
            color: "indigo",
          },
          {
            icon: CheckCircle2,
            label: "Active Certifications",
            value: activeCertifications,
            color: "emerald",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <Card className="rounded-2xl border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="p-5 flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${
                    stat.color === "indigo"
                      ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400"
                      : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                  }`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-7 w-16 mb-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="rounded-2xl border-border/60">
          <CardContent className="p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or provider..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) =>
                    handleFilterChange(setSearchQuery, e.target.value)
                  }
                />
              </div>
              <Select
                value={categoryFilter}
                onValueChange={(value) =>
                  handleFilterChange(setCategoryFilter, value)
                }
              >
                <SelectTrigger className="w-full lg:w-56">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  handleFilterChange(setStatusFilter, value)
                }
              >
                <SelectTrigger className="w-full lg:w-48">
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
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : filteredCertifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <Inbox className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  No certifications found
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Try adjusting your search or filters, or add a new
                  certification to get started.
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
                        <TableHead>Certification Name</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Provider
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Category
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Duration
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCertifications.map((cert) => (
                        <TableRow key={cert.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">
                                {cert.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {cert.id}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Building2 className="h-3.5 w-3.5 shrink-0" />
                              {cert.provider}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Tag className="h-3.5 w-3.5 shrink-0" />
                              {cert.category}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Clock3 className="h-3.5 w-3.5 shrink-0" />
                              {cert.duration}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`rounded-full font-medium ${statusStyles[cert.status]}`}
                            >
                              {cert.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-wrap justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-lg h-8 px-2"
                                title="View"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-lg h-8 px-2"
                                title="Edit"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-lg h-8 px-2 text-red-600 dark:text-red-400 hover:text-red-700"
                                title="Delete"
                                onClick={() => setCertToDelete(cert)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
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
                    {Math.min(
                      currentPage * PAGE_SIZE,
                      filteredCertifications.length
                    )}{" "}
                    of {filteredCertifications.length} certifications
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
            <DialogTitle>Add New Certification</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleAddCertification}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Certification Name</Label>
              <Input
                id="name"
                placeholder="e.g. Full Stack Web Development"
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                aria-invalid={!!errors.name}
                className={
                  errors.name
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.name && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="provider">Provider</Label>
              <Input
                id="provider"
                placeholder="e.g. NovaTech Academy"
                value={formData.provider}
                onChange={(e) => handleFormChange("provider", e.target.value)}
                aria-invalid={!!errors.provider}
                className={
                  errors.provider
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.provider && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.provider}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g. Software Development"
                  value={formData.category}
                  onChange={(e) => handleFormChange("category", e.target.value)}
                  aria-invalid={!!errors.category}
                  className={
                    errors.category
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errors.category && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.category}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g. 8 weeks"
                  value={formData.duration}
                  onChange={(e) => handleFormChange("duration", e.target.value)}
                  aria-invalid={!!errors.duration}
                  className={
                    errors.duration
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                {errors.duration && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.duration}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleFormChange("status", value as CertificationStatus)
                }
              >
                <SelectTrigger
                  id="status"
                  className={
                    errors.status
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.status}
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
                <Plus className="mr-2 h-4 w-4" />
                Add Certification
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!certToDelete}
        onOpenChange={(open) => !open && setCertToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {certToDelete?.name}
              </span>
              ? This action cannot be undone and will permanently remove this
              certification from the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
