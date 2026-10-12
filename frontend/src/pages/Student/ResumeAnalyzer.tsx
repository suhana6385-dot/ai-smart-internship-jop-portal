import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, Briefcase, Award, FolderGit2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/Card";
import { Button } from "@/components/ui/Button";
import { InlineLoader } from "@/components/loaders/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { useParsedResumeQuery } from "@/hooks/useStudentQueries";
import { useUploadResumeMutation } from "@/hooks/useStudentMutations";

export function ResumeAnalyzer() {
  const { data: resume, isLoading } = useParsedResumeQuery();
  const uploadMutation = useUploadResumeMutation();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    uploadMutation.mutate(file);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-foreground">Resume Analyzer</h1>
        <p className="text-sm text-muted-foreground">
          Upload your resume to extract skills, projects, experience, and certifications.
        </p>
      </motion.div>

      <Card>
        <CardContent className="p-0">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UploadCloud className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">
                Drag & drop your resume, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">PDF or DOCX, up to 5MB</p>
            </div>
            <Button type="button" size="sm" isLoading={uploadMutation.isPending}>
              Choose file
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
        </CardContent>
      </Card>

      {isLoading || uploadMutation.isPending ? (
        <InlineLoader label={uploadMutation.isPending ? "Analyzing resume..." : "Loading..."} />
      ) : !resume ? (
        <EmptyState
          title="No resume analyzed yet"
          description="Upload a resume above to see the extracted details here."
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-primary" /> {resume.fileName}
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
              </span>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm font-medium text-foreground">Extracted Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <Award className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {resume.certifications.map((cert) => (
                  <li key={cert} className="rounded-md border border-border px-3 py-2 text-sm text-foreground">
                    {cert}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <FolderGit2 className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Projects Detected</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {resume.projects.map((project) => (
                <div key={project.name} className="rounded-md border border-border p-4">
                  <p className="font-medium text-foreground">{project.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <Briefcase className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Experience Detected</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resume.experience.map((exp) => (
                <div key={exp.role} className="rounded-md border border-border p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <p className="font-medium text-foreground">
                      {exp.role} · {exp.organization}
                    </p>
                    <p className="text-xs text-muted-foreground">{exp.duration}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{exp.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;
