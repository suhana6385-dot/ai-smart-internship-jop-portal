import { Toaster } from "sonner";
import { useTheme } from "@/hooks/useTheme";

/**
 * Wraps sonner's <Toaster/> so its color scheme follows our own
 * ThemeContext (the same "dark" class toggle used everywhere else)
 * instead of relying on prefers-color-scheme directly.
 */
export function AppToaster() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
      }}
    />
  );
}
