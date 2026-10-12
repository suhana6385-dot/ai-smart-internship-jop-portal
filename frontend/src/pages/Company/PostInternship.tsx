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
  ClipboardList,
  Building2,
  Tag,
  MapPin,
  Clock,
  Wallet,
  Users,
  Plus,
  X,
  ListChecks,
  FileText,
  ClipboardCheck,
  Gift,
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

type LocationType = "On-site" | "Remote" | "Hybrid";

interface InternshipFormData {
  title: string;
  companyName: string;
  category: string;
  locationType: LocationType | "";
  location: string;
  duration: string;
  stipend: string;
  openings: string;
  eligibility: string;
  description: string;
  responsibilities: string;
  benefits: string;
  deadline: string;
  startDate: string;
  bannerUrl: string;
}

interface FormErrors {
  title?: string;
  category?: string;
  locationType?: string;
  location?: string;
  duration?: string;
  stipend?: string;
  openings?: string;
  skills?: string;
  eligibility?: string;
  description?: string;
  responsibilities?: string;
  deadline?: string;
  startDate?: string;
}

const initialFormData: InternshipFormData = {
  title: "",
  companyName: "NovaTech Solutions",
  category: "",
  locationType: "",
  location: "",
  duration: "",
  stipend: "",
  openings: "",
  eligibility: "",
  description: "",
  responsibilities: "",
  benefits: "",
  deadline: "",
  startDate: "",
  bannerUrl: "",
};

const categoryOptions = [
  "Software Development",
  "Data Science",
  "AI & Machine Learning",
  "UI/UX Design",
  "Product Management",
  "Marketing",
  "Human Resources",
  "Finance",
];

const locationTypeOptions: LocationType[] = ["On-site", "Remote", "Hybrid"];

export default function PostInternship() {
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<InternshipFormData>(initialFormData);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    field: keyof InternshipFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBannerUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, bannerUrl: reader.result as string }));
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

  const validate = (data: InternshipFormData): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.title.trim()) {
      newErrors.title = "Internship title is required.";
    }
    if (!data.category.trim()) {
      newErrors.category = "Please select a category.";
    }
    if (!data.locationType.trim()) {
      newErrors.locationType = "Please select a location type.";
    }
    if (!data.location.trim()) {
      newErrors.location = "Location is required.";
    }
    if (!data.duration.trim()) {
      newErrors.duration = "Duration is required.";
    }
    if (!data.stipend.trim()) {
      newErrors.stipend = "Stipend information is required.";
    }
    if (!data.openings.trim()) {
      newErrors.openings = "Number of openings is required.";
    } else if (!/^\d+$/.test(data.openings) || Number(data.openings) < 1) {
      newErrors.openings = "Enter a valid number of openings.";
    }
    if (skills.length === 0) {
      newErrors.skills = "Add at least one required skill.";
    }
    if (!data.eligibility.trim()) {
      newErrors.eligibility = "Eligibility criteria is required.";
    }
    if (!data.description.trim()) {
      newErrors.description = "Job description is required.";
    } else if (data.description.trim().length < 30) {
      newErrors.description = "Description must be at least 30 characters.";
    }
    if (!data.responsibilities.trim()) {
      newErrors.responsibilities = "Responsibilities are required.";
    }
    if (!data.deadline.trim()) {
      newErrors.deadline = "Application deadline is required.";
    }
    if (!data.startDate.trim()) {
      newErrors.startDate = "Start date is required.";
    }
    if (
      data.deadline &&
      data.startDate &&
      new Date(data.deadline) > new Date(data.startDate)
    ) {
      newErrors.startDate = "Start date must be after the application deadline.";
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
        setSuccessMessage("Your internship has been published successfully.");
        setTimeout(() => setSuccessMessage(""), 4500);
      }, 1200);
    }
  };

  const handleSaveDraft = () => {
    setIsSavingDraft(true);
    setTimeout(() => {
      setIsSavingDraft(false);
      setSuccessMessage("Internship saved as draft.");
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
          <ClipboardList className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Post Internship
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a new internship listing to reach qualified student candidates.
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
                  <Label htmlFor="title">Internship Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Frontend Developer Intern"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    aria-invalid={!!errors.title}
                    className={
                      errors.title
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                  />
                  {errors.title && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.title}
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
                  <Label htmlFor="category">Internship Category</Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange("category", value)}
                    >
                      <SelectTrigger
                        id="category"
                        className={`pl-9 ${
                          errors.category
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }`}
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.category && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.category}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="locationType">Location Type</Label>
                  <Select
                    value={formData.locationType}
                    onValueChange={(value) =>
                      handleChange("locationType", value as LocationType)
                    }
                  >
                    <SelectTrigger
                      id="locationType"
                      className={
                        errors.locationType
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.locationType && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.locationType}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="e.g. Bengaluru, India"
                      className={`pl-9 ${
                        errors.location
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                    />
                  </div>
                  {errors.location && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.location}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="duration">Duration</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="duration"
                      placeholder="e.g. 3 months"
                      className={`pl-9 ${
                        errors.duration
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                      value={formData.duration}
                      onChange={(e) => handleChange("duration", e.target.value)}
                    />
                  </div>
                  {errors.duration && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.duration}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="stipend">Stipend</Label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="stipend"
                      placeholder="e.g. $800/month"
                      className={`pl-9 ${
                        errors.stipend
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                      value={formData.stipend}
                      onChange={(e) => handleChange("stipend", e.target.value)}
                    />
                  </div>
                  {errors.stipend && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.stipend}
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
                      placeholder="e.g. 5"
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
                  placeholder="Add a required skill (e.g. React)"
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
                Internship Details
              </h2>

              <div className="flex flex-col gap-2">
                <Label htmlFor="eligibility" className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-muted-foreground" />
                  Eligibility Criteria
                </Label>
                <Textarea
                  id="eligibility"
                  rows={3}
                  placeholder="e.g. Final year students pursuing a degree in Computer Science or related fields."
                  value={formData.eligibility}
                  onChange={(e) => handleChange("eligibility", e.target.value)}
                  className={
                    errors.eligibility
                      ? "border-destructive focus-visible:ring-destructive resize-none"
                      : "resize-none"
                  }
                />
                {errors.eligibility && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.eligibility}
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
                  placeholder="Describe the internship role, team, and what the intern will be working on."
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
                  Responsibilities
                </Label>
                <Textarea
                  id="responsibilities"
                  rows={4}
                  placeholder="List the key responsibilities of the intern, one per line."
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
                  placeholder="e.g. Certificate of completion, mentorship, flexible hours, letter of recommendation."
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
                Timeline &amp; Banner
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
                  <Label htmlFor="startDate" className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    aria-invalid={!!errors.startDate}
                    className={
                      errors.startDate
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                  />
                  {errors.startDate && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.startDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Label className="flex items-center gap-2">
                  <ImagePlus className="h-4 w-4 text-muted-foreground" />
                  Internship Banner (Optional)
                </Label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="h-28 w-full sm:w-48 rounded-xl overflow-hidden bg-muted ring-1 ring-border flex items-center justify-center shrink-0">
                    {formData.bannerUrl ? (
                      <img
                        src={formData.bannerUrl}
                        alt="Internship banner"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImagePlus className="h-7 w-7 text-muted-foreground" />
                    )}
                  </div>
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => bannerInputRef.current?.click()}
                  >
                    <ImagePlus className="mr-2 h-3.5 w-3.5" />
                    Upload Banner
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
                Save as Draft
              </>
            )}
          </Button>
          <Button
            type="submit"
            className="rounded-xl font-semibold min-w-[170px]"
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
                Publish Internship
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
