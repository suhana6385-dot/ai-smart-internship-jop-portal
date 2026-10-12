import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { store } from "@/redux/store";
import { ThemeProvider } from "@/context/ThemeContext";
import { router } from "@/routes";
import { AppToaster } from "@/components/ui/AppToaster";
import { queryClient } from "@/config/queryClient";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <AppToaster />
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
