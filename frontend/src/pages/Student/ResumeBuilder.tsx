import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import { Download, LayoutTemplate, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/Card";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface ExperienceEntry {
  role: string;
  organization: string;
  duration: string;
  description: string;
}

interface ResumeBuilderFormValues {
  name: string;
  email: string;
  phone: string;
  headline: string;
  summary: string;
  skills: string;
  education: string;
  experience: ExperienceEntry[];
}

const TEMPLATES = [
  { id: "classic", label: "Classic", accent: "border-l-4 border-slate-700" },
  { id: "modern", label: "Modern", accent: "border-l-4 border-primary" },
  { id: "minimal", label: "Minimal", accent: "" },
] as const;

export function ResumeBuilder() {
  const [template, setTemplate] = useState<(typeof TEMPLATES)[number]["id"]>("modern");
  const [isExporting, setIsExporting] = useState(false);

  const { register, control, watch } = useForm<ResumeBuilderFormValues>({
    defaultValues: {
      name: "Ananya Sharma",
      email: "ananya.sharma@example.com",
      phone: "+91 98765 43210",
      headline: "Final-year CS student | Frontend & ML enthusiast",
      summary:
        "Motivated Computer Science student with hands-on experience building full-stack web applications. Seeking an SDE internship to apply strong fundamentals in React and Node.js.",
      skills: "React, TypeScript, Node.js, Python, SQL, Git",
      education: "B.Tech in Computer Science, VIT (2022 – 2026)",
      experience: [
        {
          role: "Frontend Intern",
          organization: "Pixel Craft Studio",
          duration: "May 2025 – Jul 2025",
          description: "Built responsive UI components and improved page load time by 30%.",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "experience" });
  const values = watch();
  const activeTemplate = TEMPLATES.find((t) => t.id === template)!;

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      let y = 18;

      doc.setFontSize(16);
      doc.text(values.name, 15, y);
      y += 7;
      doc.setFontSize(10);
      doc.text(`${values.email}  ·  ${values.phone}`, 15, y);
      y += 6;
      doc.text(values.headline, 15, y);
      y += 10;

      doc.setFontSize(12);
      doc.text("Summary", 15, y);
      y += 5;
      doc.setFontSize(10);
      doc.text(doc.splitTextToSize(values.summary, 180), 15, y);
      y += 18;

      doc.setFontSize(12);
      doc.text("Skills", 15, y);
      y += 5;
      doc.setFontSize(10);
      doc.text(doc.splitTextToSize(values.skills, 180), 15, y);
      y += 12;

      doc.setFontSize(12);
      doc.text("Education", 15, y);
      y += 5;
      doc.setFontSize(10);
      doc.text(values.education, 15, y);
      y += 10;

      doc.setFontSize(12);
      doc.text("Experience", 15, y);
      y += 5;
      doc.setFontSize(10);
      values.experience.forEach((exp) => {
        doc.text(`${exp.role} — ${exp.organization} (${exp.duration})`, 15, y);
        y += 5;
        doc.text(doc.splitTextToSize(exp.description, 180), 15, y);
        y += 12;
      });

      doc.save(`${values.name.replace(/\s+/g, "_")}_Resume.pdf`);
      toast.success("Resume PDF downloaded");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-foreground">AI Resume Builder</h1>
        <p className="text-sm text-muted-foreground">
          Fill in your details, pick a template, and export an ATS-friendly PDF resume.
        </p>
      </motion.div>

      <Card>
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <LayoutTemplate className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Template</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={cn(
                "rounded-md border px-4 py-2 text-sm font-medium transition-colors",
                template === t.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-accent"
              )}
            >
              {t.label}
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput label="Full name" {...register("name")} />
              <FormInput label="Phone" {...register("phone")} />
            </div>
            <FormInput label="Email" type="email" {...register("email")} />
            <FormInput label="Headline" {...register("headline")} />
            <FormTextarea label="Summary" {...register("summary")} />
            <FormInput label="Skills (comma-separated)" {...register("skills")} />
            <FormInput label="Education" {...register("education")} />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Experience</p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    append({ role: "", organization: "", duration: "", description: "" })
                  }
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              </div>
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-2 rounded-md border border-border p-3">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <FormInput placeholder="Role" {...register(`experience.${index}.role`)} />
                    <FormInput
                      placeholder="Organization"
                      {...register(`experience.${index}.organization`)}
                    />
                  </div>
                  <FormInput placeholder="Duration" {...register(`experience.${index}.duration`)} />
                  <FormTextarea
                    placeholder="Description"
                    {...register(`experience.${index}.description`)}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => remove(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </Button>
                </div>
              ))}
            </div>

            <Button className="w-full" onClick={handleDownload} isLoading={isExporting}>
              <Download className="h-4 w-4" /> Download as PDF
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn("rounded-md bg-white p-6 text-slate-800 shadow-sm", activeTemplate.accent)}>
              <h2 className="text-xl font-bold">{values.name}</h2>
              <p className="text-xs text-slate-500">
                {values.email} · {values.phone}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-600">{values.headline}</p>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Summary</p>
                <p className="mt-1 text-sm">{values.summary}</p>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Skills</p>
                <p className="mt-1 text-sm">{values.skills}</p>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Education</p>
                <p className="mt-1 text-sm">{values.education}</p>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Experience</p>
                {values.experience.map((exp, i) => (
                  <div key={i} className="mt-2">
                    <p className="text-sm font-medium">
                      {exp.role} — {exp.organization}
                    </p>
                    <p className="text-xs text-slate-500">{exp.duration}</p>
                    <p className="mt-0.5 text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ResumeBuilder;
