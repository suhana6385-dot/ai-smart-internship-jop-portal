import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Copy, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/Card";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { FormSelect } from "@/components/forms/FormSelect";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useGenerateCoverLetterMutation } from "@/hooks/useStudentMutations";
import { coverLetterSchema } from "@/validations/studentValidation";
import type { CoverLetterFormValues } from "@/validations/studentValidation";

const TONE_OPTIONS = [
  { label: "Formal", value: "Formal" },
  { label: "Enthusiastic", value: "Enthusiastic" },
  { label: "Concise", value: "Concise" },
];

export function CoverLetter() {
  const generateMutation = useGenerateCoverLetterMutation();
  const [letter, setLetter] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CoverLetterFormValues>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: { companyName: "", jobTitle: "", tone: "Formal", highlights: "" },
  });

  const onSubmit = (values: CoverLetterFormValues) => {
    generateMutation.mutate(values, {
      onSuccess: (data) => setLetter(data.content),
    });
  };

  const handleCopy = async () => {
    if (!letter) return;
    await navigator.clipboard.writeText(letter);
    toast.success("Copied to clipboard");
  };

  const handleDownload = async () => {
    if (!letter) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(letter, 180);
    doc.setFontSize(11);
    doc.text(lines, 15, 20);
    doc.save("cover-letter.pdf");
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-foreground">AI Cover Letter Generator</h1>
        <p className="text-sm text-muted-foreground">
          Generate a personalized, company-specific cover letter in seconds.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Letter Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormInput
                label="Company name"
                error={errors.companyName?.message}
                {...register("companyName")}
              />
              <FormInput label="Job title" error={errors.jobTitle?.message} {...register("jobTitle")} />
              <FormSelect
                label="Tone"
                options={TONE_OPTIONS}
                error={errors.tone?.message}
                {...register("tone")}
              />
              <FormTextarea
                label="Key highlights"
                placeholder="Mention specific skills, projects or achievements to include..."
                error={errors.highlights?.message}
                {...register("highlights")}
              />
              <Button type="submit" className="w-full" isLoading={generateMutation.isPending}>
                <Sparkles className="h-4 w-4" /> Generate cover letter
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Preview</CardTitle>
            {letter && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCopy}>
                  <Copy className="h-3.5 w-3.5" /> Copy
                </Button>
                <Button size="sm" variant="outline" onClick={handleDownload}>
                  <Download className="h-3.5 w-3.5" /> PDF
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!letter ? (
              <EmptyState
                title="No letter generated yet"
                description="Fill in the details and generate your first cover letter."
              />
            ) : (
              <motion.pre
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-4 text-sm text-foreground"
              >
                {letter}
              </motion.pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CoverLetter;
