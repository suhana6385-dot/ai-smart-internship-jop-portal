import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertTriangle, KeyRound, Moon, Sun, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/Card";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/modals/Modal";
import { InlineLoader } from "@/components/loaders/Loader";
import { useTheme } from "@/hooks/useTheme";
import { useNotificationPreferencesQuery } from "@/hooks/useStudentQueries";
import {
  useChangePasswordMutation,
  useUpdateNotificationPreferencesMutation,
} from "@/hooks/useStudentMutations";
import { changePasswordSchema } from "@/validations/studentValidation";
import type { ChangePasswordFormValues } from "@/validations/studentValidation";
import type { NotificationPreferences } from "@/types/student";

const PREFERENCE_LABELS: { key: keyof NotificationPreferences; label: string }[] = [
  { key: "newJobs", label: "New job matches" },
  { key: "internshipAlerts", label: "Internship alerts" },
  { key: "interviewReminders", label: "Interview reminders" },
  { key: "resumeAlerts", label: "Resume score alerts" },
  { key: "certificationReminders", label: "Certification reminders" },
];

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { data: preferences, isLoading } = useNotificationPreferencesQuery();
  const updatePreferencesMutation = useUpdateNotificationPreferencesMutation();
  const changePasswordMutation = useChangePasswordMutation();
  const [localPrefs, setLocalPrefs] = useState<NotificationPreferences | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    if (preferences) setLocalPrefs(preferences);
  }, [preferences]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const onChangePassword = (values: ChangePasswordFormValues) => {
    changePasswordMutation.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      { onSuccess: () => reset() }
    );
  };

  const togglePreference = (key: keyof NotificationPreferences) => {
    if (!localPrefs) return;
    const next = { ...localPrefs, [key]: !localPrefs[key] };
    setLocalPrefs(next);
    updatePreferencesMutation.mutate(next);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account security, notifications, and appearance preferences.
        </p>
      </motion.div>

      <Card>
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          {theme === "dark" ? (
            <Moon className="h-4 w-4 text-primary" />
          ) : (
            <Sun className="h-4 w-4 text-primary" />
          )}
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Theme</p>
            <p className="text-xs text-muted-foreground">Currently using {theme} mode</p>
          </div>
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            Switch to {theme === "dark" ? "light" : "dark"} mode
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <KeyRound className="h-4 w-4 text-primary" />
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4" noValidate>
            <PasswordInput
              label="Current password"
              error={errors.currentPassword?.message}
              {...register("currentPassword")}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PasswordInput
                label="New password"
                error={errors.newPassword?.message}
                {...register("newPassword")}
              />
              <PasswordInput
                label="Confirm new password"
                error={errors.confirmNewPassword?.message}
                {...register("confirmNewPassword")}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" isLoading={changePasswordMutation.isPending}>
                Update password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading || !localPrefs ? (
            <InlineLoader />
          ) : (
            PREFERENCE_LABELS.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
                <span className="text-sm text-foreground">{label}</span>
                <button
                  role="switch"
                  aria-checked={localPrefs[key]}
                  onClick={() => togglePreference(key)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    localPrefs[key] ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      localPrefs[key] ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-foreground">Delete account</p>
            <p className="text-xs text-muted-foreground">
              This permanently removes your profile, resume, and application history.
            </p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => setConfirmDeleteOpen(true)}>
            <Trash2 className="h-3.5 w-3.5" /> Delete account
          </Button>
        </CardContent>
      </Card>

      <Modal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title="Delete your account?"
        description="This action cannot be undone. All your data will be permanently removed."
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setConfirmDeleteOpen(false)}>
              Yes, delete my account
            </Button>
          </>
        }
      />
    </div>
  );
}

export default Settings;
