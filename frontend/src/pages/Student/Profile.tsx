import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Github, Linkedin, MapPin, Pencil } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/Card";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button } from "@/components/ui/Button";
import { InlineLoader } from "@/components/loaders/Loader";
import { useStudentProfileQuery } from "@/hooks/useStudentQueries";
import { useUpdateProfileMutation } from "@/hooks/useStudentMutations";
import { profileSchema } from "@/validations/studentValidation";
import type { ProfileFormValues } from "@/validations/studentValidation";

export function Profile() {
  const { data: profile, isLoading } = useStudentProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      headline: "",
      bio: "",
      location: "",
      careerGoal: "",
      skills: "",
      interests: "",
      linkedin: "",
      github: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        headline: profile.headline,
        bio: profile.bio,
        location: profile.location,
        careerGoal: profile.careerGoal,
        skills: profile.skills.join(", "),
        interests: profile.interests.join(", "),
        linkedin: profile.socialLinks.linkedin ?? "",
        github: profile.socialLinks.github ?? "",
      });
    }
  }, [profile, reset]);

  const onSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate({
      name: values.name,
      headline: values.headline,
      bio: values.bio,
      location: values.location,
      careerGoal: values.careerGoal,
      skills: values.skills.split(",").map((s) => s.trim()).filter(Boolean),
      interests: values.interests.split(",").map((s) => s.trim()).filter(Boolean),
      socialLinks: { linkedin: values.linkedin, github: values.github },
    });
  };

  if (isLoading || !profile) {
    return <InlineLoader label="Loading your profile..." />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
            {profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{profile.name}</h1>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {profile.location}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {profile.socialLinks.linkedin && (
            <Button asChild variant="outline" size="icon">
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="Open LinkedIn profile"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          )}
          {profile.socialLinks.github && (
            <Button asChild variant="outline" size="icon">
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                aria-label="Open GitHub profile"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </motion.div>

      <Card>
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <Pencil className="h-4 w-4 text-primary" />
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput label="Full name" error={errors.name?.message} {...register("name")} />
              <FormInput label="Location" error={errors.location?.message} {...register("location")} />
            </div>

            <FormInput
              label="Headline"
              placeholder="e.g. Final-year CS student | Frontend enthusiast"
              error={errors.headline?.message}
              {...register("headline")}
            />

            <FormTextarea
              label="Bio"
              placeholder="Tell recruiters a bit about yourself..."
              error={errors.bio?.message}
              {...register("bio")}
            />

            <FormInput
              label="Career goal"
              error={errors.careerGoal?.message}
              {...register("careerGoal")}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Skills (comma-separated)"
                error={errors.skills?.message}
                {...register("skills")}
              />
              <FormInput
                label="Interests (comma-separated)"
                error={errors.interests?.message}
                {...register("interests")}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="LinkedIn URL"
                placeholder="https://linkedin.com/in/..."
                error={errors.linkedin?.message}
                {...register("linkedin")}
              />
              <FormInput
                label="GitHub URL"
                placeholder="https://github.com/..."
                error={errors.github?.message}
                {...register("github")}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={!isDirty} isLoading={updateProfileMutation.isPending}>
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;
