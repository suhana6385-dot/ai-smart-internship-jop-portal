import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm">AI Internship Portal</span>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            Helping students discover internships and jobs that actually
            match their skills.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Company</p>
            <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Legal</p>
            <Link to="/privacy" className="block text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="block text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Account</p>
            <Link to="/login" className="block text-sm text-muted-foreground hover:text-foreground">
              Log in
            </Link>
            <Link to="/register" className="block text-sm text-muted-foreground hover:text-foreground">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {year} AI Smart Internship & Job Recommendation Portal. All rights reserved.
      </div>
    </footer>
  );
}
