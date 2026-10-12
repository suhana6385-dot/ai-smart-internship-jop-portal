import { useRef, useState, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Building2,
  Clock3,
  Award,
  Wallet,
  MapPin,
  Laptop,
  Plus,
  X,
  GraduationCap,
  FileText,
  ClipboardCheck,
  Gift,
  Users,
  CalendarClock,
  CalendarDays,
  ImagePlus,
  Rocket,
  Save,
  RotateCcw,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type EmploymentType = "Full-time" | "Part-time" | "Contract";
type WorkMode = "On-site" | "Remote" | "Hybrid";

interface JobFormData {
  jobTitle: string;
  companyName: string;
  employmentType: EmploymentType | "";
  experienceRequired: string;
  salaryPackage: string;
  jobLocation: string;
  workMode: WorkMode | "";
  qualifications: string;
  description: string;
  responsibilities: string;
  benefits: string;
  openings: string;
  deadline: string;
  joiningDate: string;
  logoUrl: string;
}

interface FormErrors {
  jobTitle?: string;
  employmentType?: string;
  experienceRequired?: string;
  salaryPackage?: string;
  jobLocation?: string;
  workMode?: string;
  skills?: string;
  qualifications?: string;
  description?: string;
  responsibilities?: string;
  openings?: string;
  deadline?: string;
  joiningDate?: string;
}

const initialFormData: JobFormData = {
  jobTitle: "",
  companyName: "NovaTech Solutions",
  employmentType: "",
  experienceRequired: "",
  salaryPackage: "",
  jobLocation: "",
  workMode: "",
  qualifications: "",
  description: "",
  responsibilities: "",
  benefits: "",
  openings: "",
  deadline: "",
  joiningDate: "",
  logoUrl: "",
};

const employmentTypeOptions: EmploymentType[] = [
  "Full-time",
  "Part-time",
  "Contract",
];

const workModeOptions: WorkMode[] = ["On-site", "Remote", "Hybrid"];

export default function PostJob() {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (field: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      if (errors.skills) {
        setErrors((prev) => ({ ...prev, skills: undefined }));
      }
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const validate = (data: JobFormData): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required.";
    }
    if (!data.employmentType.trim()) {
      newErrors.employmentType = "Please select employment type.";
    }
    if (!data.experienceRequired.trim()) {
      newErrors.experienceRequired = "Experience required is required.";
    }
    if (!data.salaryPackage.trim()) {
      newErrors.salaryPackage = "Salary package is required.";
    }
    if (!data.jobLocation.trim()) {
      newErrors.jobLocation = "Job location is required.";
    }
    if (!data.workMode.trim()) {
      newErrors.workMode = "Please select a work mode.";
    }
    if (skills.length === 0) {
      newErrors.skills = "Add at least one required skill.";
    }
    if (!data.qualifications.trim()) {
      newErrors.qualifications = "Qualifications are required.";
    }
    if (!data.description.trim()) {
      newErrors.description = "Job description is required.";
    } else if (data.description.trim().length < 30) {
      newErrors.description = "Description must be at least 30 characters.";
    }
    if (!data.responsibilities.trim()) {
      newErrors.responsibilities = "Roles & responsibilities are required.";
    }
    if (!data.openings.trim()) {
      newErrors.openings = "Number of openings is required.";
    } else if (!/^\d+$/.test(data.openings) || Number(data.openings) < 1) {
      newErrors.openings = "Enter a valid number of openings.";
    }
    if (!data.deadline.trim()) {
      newErrors.deadline = "Application deadline is required.";
    }
    if (!data.joiningDate.trim()) {
      newErrors.joiningDate = "Joining date is required.";
    }
    if (
      data.deadline &&
      data.joiningDate &&
      new Date(data.deadline) > new Date(data.joiningDate)
    ) {
      newErrors.joiningDate = "Joining date must be after the application deadline.";
    }

    return newErrors;
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setSkills([]);
    setSkillInput("");
    setErrors({});
    setSuccessMessage("");
  };

  const handlePublish = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsPublishing(true);
      setTimeout(() => {
        setIsPublishing(false);
        setSuccessMessage("Your job has been published successfully.");
        setTimeout(() => setSuccessMessage(""), 4500);
      }, 1200);
    }
  };

  const handleSaveDraft = () => {
    setIsSavingDraft(true);
    setTimeout(() => {
      setIsSavingDraft(false);
      setSuccessMessage("Job saved as draft.");
      setTimeout(() => setSuccessMessage(""), 4500);
    }, 900);
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
          <Briefcase className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Post Job
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a new full-time or part-time job listing for candidates.
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 rounded-xl bg-green-50 dark:bg-green-950/40 ring-1 ring-green-200 dark:ring-green-900 px-4 py-3 text-sm text-green-700 dark:text-green-400"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handlePublish} className="flex flex-col gap-6" noValidate>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <Card className="rounded-2xl border-border/60">
            <CardContent className="p-6 sm:p-8 flex flex-col gap-6">
              <h2 className="text-lg font-semibold text-foreground">
                Basic Information
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g. Frontend Developer"
                    value={formData.jobTitle}
                    onChange={(e) => handleChange("jobTitle", e.target.value)}
                    aria-invalid={!!errors.jobTitle}
                    className={
                      errors.jobTitle
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                  />
                  {errors.jobTitle && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.jobTitle}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      className="pl-9 bg-muted/50"
                      value={formData.companyName}
                      disabled
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select
                    value={formData.employmentType}
                    onValueChange={(value) =>
                      handleChange("employmentType", value as EmploymentType)
                    }
                  >
                    <SelectTrigger
                      id="employmentType"
                      className={
                        errors.employmentType
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {employmentTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.employmentType && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.employmentType}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="experienceRequired">Experience Required</Label>
                  <div className="relative">
                    <Clock3 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="experienceRequired"
                      placeholder="e.g. 1 - 3 years"
                      className={`pl-9 ${
                        errors.experienceRequired
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                      value={formData.experienceRequired}
                      onChange={(e) =>
                        handleChange("experienceRequired", e.target.value)
                      }
                    />
                  </div>
                  {errors.experienceRequired && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.experienceRequired}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="salaryPackage">Salary Package</Label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="salaryPackage"
                      placeholder="e.g. $60,000 - $80,000 / year"
                      className={`pl-9 ${
                        errors.salaryPackage
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                      value={formData.salaryPackage}
                      onChange={(e) =>
                        handleChange("salaryPackage", e.target.value)
                      }
                    />
                  </div>
                  {errors.salaryPackage && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.salaryPackage}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="jobLocation">Job Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="jobLocation"
                      placeholder="e.g. Bengaluru, India"
                      className={`pl-9 ${
                        errors.jobLocation
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                      value={formData.jobLocation}
                      onChange={(e) => handleChange("jobLocation", e.target.value)}
                    />
                  </div>
                  {errors.jobLocation && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.jobLocation}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="workMode">Work Mode</Label>
                  <div className="relative">
                    <Laptop className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Select
                      value={formData.workMode}
                      onValueChange={(value) =>
                        handleChange("workMode", value as WorkMode)
                      }
                    >
                      <SelectTrigger
                        id="workMode"
                        className={`pl-9 ${
                          errors.workMode
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }`}
                      >
                        <SelectValue placeholder="Select work mode" />
                      </SelectTrigger>
                      <SelectContent>
                        {workModeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.workMode && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.workMode}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="openings">Number of Openings</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="openings"
                      type="number"
                      min="1"
                      placeholder="e.g. 3"
                      className={`pl-9 ${
                        errors.openings
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                      value={formData.openings}
                      onChange={(e) => handleChange("openings", e.target.value)}
                    />
                  </div>
                  {errors.openings && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.openings}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="rounded-2xl border-border/60">
            <CardContent className="p-6 sm:p-8 flex flex-col gap-5">
              <h2 className="text-lg font-semibold text-foreground">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="rounded-full pl-3 pr-2 py-1.5 flex items-center gap-1.5 text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-3">
                <Input
                  placeholder="Add a required skill (e.g. TypeScript)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  className={
                    errors.skills
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl shrink-0"
                  onClick={handleAddSkill}
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add
                </Button>
              </div>
              {errors.skills && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.skills}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="rounded-2xl border-border/60">
            <CardContent className="p-6 sm:p-8 flex flex-col gap-6">
              <h2 className="text-lg font-semibold text-foreground">
                Job Details
              </h2>

              <div className="flex flex-col gap-2">
                <Label htmlFor="qualifications" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  Qualifications
                </Label>
                <Textarea
                  id="qualifications"
                  rows={3}
                  placeholder="e.g. Bachelor's degree in Computer Science or a related field."
                  value={formData.qualifications}
                  onChange={(e) => handleChange("qualifications", e.target.value)}
                  className={
                    errors.qualifications
                      ? "border-destructive focus-visible:ring-destructive resize-none"
                      : "resize-none"
                  }
                />
                {errors.qualifications && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.qualifications}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Job Description
                </Label>
                <Textarea
                  id="description"
                  rows={5}
                  placeholder="Describe the role, team, and what the candidate will be working on."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className={
                    errors.description
                      ? "border-destructive focus-visible:ring-destructive resize-none"
                      : "resize-none"
                  }
                />
                {errors.description && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="responsibilities"
                  className="flex items-center gap-2"
                >
                  <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                  Roles &amp; Responsibilities
                </Label>
                <Textarea
                  id="responsibilities"
                  rows={4}
                  placeholder="List the key responsibilities for this role, one per line."
                  value={formData.responsibilities}
                  onChange={(e) =>
                    handleChange("responsibilities", e.target.value)
                  }
                  className={
                    errors.responsibilities
                      ? "border-destructive focus-visible:ring-destructive resize-none"
                      : "resize-none"
                  }
                />
                {errors.responsibilities && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.responsibilities}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="benefits" className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-muted-foreground" />
                  Benefits
                </Label>
                <Textarea
                  id="benefits"
                  rows={3}
                  placeholder="e.g. Health insurance, paid time off, performance bonus, remote flexibility."
                  value={formData.benefits}
                  onChange={(e) => handleChange("benefits", e.target.value)}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="rounded-2xl border-border/60">
            <CardContent className="p-6 sm:p-8 flex flex-col gap-6">
              <h2 className="text-lg font-semibold text-foreground">
                Timeline &amp; Company Logo
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="deadline" className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    Application Deadline
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleChange("deadline", e.target.value)}
                    aria-invalid={!!errors.deadline}
                    className={
                      errors.deadline
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                  />
                  {errors.deadline && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.deadline}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="joiningDate" className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    Joining Date
                  </Label>
                  <Input
                    id="joiningDate"
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => handleChange("joiningDate", e.target.value)}
                    aria-invalid={!!errors.joiningDate}
                    className={
                      errors.joiningDate
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                  />
                  {errors.joiningDate && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.joiningDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Label className="flex items-center gap-2">
                  <ImagePlus className="h-4 w-4 text-muted-foreground" />
                  Company Logo (Optional)
                </Label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="h-24 w-24 rounded-2xl overflow-hidden bg-muted ring-1 ring-border flex items-center justify-center shrink-0">
                    {formData.logoUrl ? (
                      <img
                        src={formData.logoUrl}
                        alt="Company logo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <ImagePlus className="mr-2 h-3.5 w-3.5" />
                    Upload Logo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex flex-col sm:flex-row justify-end gap-3"
        >
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={handleReset}
            disabled={isPublishing || isSavingDraft}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="rounded-xl font-semibold min-w-[150px]"
            onClick={handleSaveDraft}
            disabled={isPublishing || isSavingDraft}
          >
            {isSavingDraft ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </>
            )}
          </Button>
          <Button
            type="submit"
            className="rounded-xl font-semibold min-w-[150px]"
            disabled={isPublishing || isSavingDraft}
          >
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Rocket className="mr-2 h-4 w-4" />
                Publish Job
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
