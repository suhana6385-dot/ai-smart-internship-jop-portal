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
  Building2,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Plus,
  X,
  CheckCircle2,
  Loader2,
  Save,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface CompanyProfileData {
  logoUrl: string;
  companyName: string;
  industry: string;
  companySize: string;
  website: string;
  email: string;
  phone: string;
  headquarters: string;
  about: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
}

interface FormErrors {
  companyName?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  email?: string;
  phone?: string;
  headquarters?: string;
  about?: string;
}

const initialProfile: CompanyProfileData = {
  logoUrl: "",
  companyName: "NovaTech Solutions",
  industry: "",
  companySize: "",
  website: "https://novatechsolutions.com",
  email: "hr@novatechsolutions.com",
  phone: "+1 (555) 987-6543",
  headquarters: "San Francisco, CA, USA",
  about:
    "NovaTech Solutions builds AI-driven productivity tools for modern enterprises, helping teams work smarter across engineering, design, and operations.",
  linkedin: "https://linkedin.com/company/novatechsolutions",
  twitter: "https://twitter.com/novatechsol",
  facebook: "",
  instagram: "",
};

const initialSkills = ["React", "Node.js", "Python", "Machine Learning", "AWS"];

const industryOptions = [
  "Information Technology",
  "Finance",
  "Healthcare",
  "Education",
  "E-Commerce",
  "Manufacturing",
  "Consulting",
];

const companySizeOptions = [
  "1 - 10 employees",
  "11 - 50 employees",
  "51 - 200 employees",
  "201 - 500 employees",
  "501 - 1000 employees",
  "1000+ employees",
];

export default function CompanyProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<CompanyProfileData>(initialProfile);
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (field: keyof CompanyProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prev) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const validate = (data: CompanyProfileData): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.companyName.trim()) {
      newErrors.companyName = "Company name is required.";
    }
    if (!data.industry.trim()) {
      newErrors.industry = "Please select an industry.";
    }
    if (!data.companySize.trim()) {
      newErrors.companySize = "Please select company size.";
    }
    if (!data.website.trim()) {
      newErrors.website = "Website URL is required.";
    } else if (!/^https?:\/\/.+\..+/.test(data.website)) {
      newErrors.website = "Enter a valid website URL.";
    }
    if (!data.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!data.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[+]?[\d\s-]{7,15}$/.test(data.phone)) {
      newErrors.phone = "Enter a valid phone number.";
    }
    if (!data.headquarters.trim()) {
      newErrors.headquarters = "Headquarters location is required.";
    }
    if (!data.about.trim()) {
      newErrors.about = "Please add a short description about your company.";
    } else if (data.about.trim().length < 20) {
      newErrors.about = "Description must be at least 20 characters.";
    }

    return newErrors;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(profile);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
      }, 1200);
    }
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    setSkills(initialSkills);
    setErrors({});
    setSkillInput("");
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
          <Building2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Company Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Keep your company information up to date for students and applicants.
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 rounded-xl bg-green-50 dark:bg-green-950/40 ring-1 ring-green-200 dark:ring-green-900 px-4 py-3 text-sm text-green-700 dark:text-green-400"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Your company profile has been updated successfully.
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <Card className="rounded-2xl border-border/60">
            <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="flex flex-col items-center gap-3">
                <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-muted ring-1 ring-border flex items-center justify-center">
                  {profile.logoUrl ? (
                    <img
                      src={profile.logoUrl}
                      alt="Company logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-9 w-9 text-muted-foreground" />
                  )}
                </div>
                <input
                  ref={fileInputRef}
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
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-3.5 w-3.5" />
                  Upload Logo
                </Button>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-lg font-semibold text-foreground">
                  Company Logo
                </h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Upload a square image, ideally 512x512px, in PNG or JPG format.
                  This will be shown on your job and internship postings.
                </p>
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
            <CardContent className="p-6 sm:p-8 flex flex-col gap-6">
              <h2 className="text-lg font-semibold text-foreground">
                Company Information
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={profile.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                    aria-invalid={!!errors.companyName}
                    className={
                      errors.companyName
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                  />
                  {errors.companyName && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.companyName}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={profile.industry}
                    onValueChange={(value) => handleChange("industry", value)}
                  >
                    <SelectTrigger
                      id="industry"
                      aria-invalid={!!errors.industry}
                      className={
                        errors.industry
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industryOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.industry && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.industry}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select
                    value={profile.companySize}
                    onValueChange={(value) => handleChange("companySize", value)}
                  >
                    <SelectTrigger
                      id="companySize"
                      aria-invalid={!!errors.companySize}
                      className={
                        errors.companySize
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {companySizeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.companySize && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.companySize}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      className={`pl-9 ${
                        errors.website
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                      value={profile.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                      aria-invalid={!!errors.website}
                    />
                  </div>
                  {errors.website && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.website}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className={`pl-9 ${
                        errors.email
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                      value={profile.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      aria-invalid={!!errors.email}
                    />
                  </div>
                  {errors.email && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      className={`pl-9 ${
                        errors.phone
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                      value={profile.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      aria-invalid={!!errors.phone}
                    />
                  </div>
                  {errors.phone && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="headquarters">Headquarters Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="headquarters"
                      className={`pl-9 ${
                        errors.headquarters
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                      value={profile.headquarters}
                      onChange={(e) => handleChange("headquarters", e.target.value)}
                      aria-invalid={!!errors.headquarters}
                    />
                  </div>
                  {errors.headquarters && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.headquarters}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="about">About Company</Label>
                <Textarea
                  id="about"
                  rows={5}
                  value={profile.about}
                  onChange={(e) => handleChange("about", e.target.value)}
                  aria-invalid={!!errors.about}
                  className={
                    errors.about
                      ? "border-destructive focus-visible:ring-destructive resize-none"
                      : "resize-none"
                  }
                />
                {errors.about && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.about}
                  </p>
                )}
              </div>
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
                Social Media Links
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="linkedin"
                      className="pl-9"
                      placeholder="https://linkedin.com/company/yourcompany"
                      value={profile.linkedin}
                      onChange={(e) => handleChange("linkedin", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="twitter"
                      className="pl-9"
                      placeholder="https://twitter.com/yourcompany"
                      value={profile.twitter}
                      onChange={(e) => handleChange("twitter", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <div className="relative">
                    <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="facebook"
                      className="pl-9"
                      placeholder="https://facebook.com/yourcompany"
                      value={profile.facebook}
                      onChange={(e) => handleChange("facebook", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="instagram"
                      className="pl-9"
                      placeholder="https://instagram.com/yourcompany"
                      value={profile.instagram}
                      onChange={(e) => handleChange("instagram", e.target.value)}
                    />
                  </div>
                </div>
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
            <CardContent className="p-6 sm:p-8 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-semibold text-foreground">
                  Skills Hiring For
                </h2>
              </div>
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
                  placeholder="Add a skill (e.g. TypeScript)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
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
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="rounded-xl font-semibold min-w-[160px]"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}