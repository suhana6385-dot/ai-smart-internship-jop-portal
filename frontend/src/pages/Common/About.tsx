import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Target,
  Eye,
  BookOpen,
  Brain,
  ShieldCheck,
  FileText,
  Compass,
  LayoutDashboard,
  MousePointerClick,
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  Lightbulb,
  Handshake,
  Shield,
  Rocket,
  Zap,
  Globe,
  LineChart,
  ArrowRight,
  UserPlus,
} from "lucide-react";

const keyFeatures = [
  {
    icon: Brain,
    title: "AI Internship Recommendation",
    description:
      "Smart matching that studies your skills, interests, and goals to surface internships you're actually a fit for.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Companies",
    description:
      "Every listed company is screened and verified, so you apply with confidence and never worry about legitimacy.",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description:
      "Build a polished, recruiter-ready resume in minutes with guided templates built for internship applications.",
  },
  {
    icon: Compass,
    title: "Career Guidance",
    description:
      "Get personalized direction on skills to learn, roles to target, and paths that align with your ambitions.",
  },
  {
    icon: LayoutDashboard,
    title: "Student Dashboard",
    description:
      "Track applications, saved internships, and progress in one clean, organized workspace built for you.",
  },
  {
    icon: MousePointerClick,
    title: "Easy Application Process",
    description:
      "Apply to multiple internships in just a few clicks with a streamlined, friction-free application flow.",
  },
];

const whyChooseUs = [
  {
    icon: Zap,
    title: "Faster Matching",
    description:
      "Our AI narrows thousands of listings down to the ones worth your time, in seconds.",
  },
  {
    icon: Globe,
    title: "Wide Opportunity Network",
    description:
      "Access internships across industries, locations, and experience levels from one platform.",
  },
  {
    icon: LineChart,
    title: "Real Growth Tracking",
    description:
      "See your progress, skill gaps, and application outcomes with clear, actionable insights.",
  },
  {
    icon: Handshake,
    title: "Built With Students in Mind",
    description:
      "Every feature is designed around what students actually need to land their first opportunity.",
  },
];

const platformStats = [
  { icon: Users, value: "50,000+", label: "Students Registered" },
  { icon: Building2, value: "1,200+", label: "Companies" },
  { icon: Briefcase, value: "8,500+", label: "Internships" },
  { icon: TrendingUp, value: "92%", label: "Placement Success Rate" },
];

const coreValues = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We continuously push our AI models forward to deliver smarter, more relevant matches every day.",
  },
  {
    icon: Shield,
    title: "Trust",
    description:
      "Every company and opportunity on our platform is verified, so students can apply with full confidence.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Clear application statuses, honest company details, and no hidden fees or surprises anywhere.",
  },
  {
    icon: Rocket,
    title: "Student Success",
    description:
      "Every decision we make is measured against one question: does this help a student succeed?",
  },
];

const platformHighlights = [
  {
    icon: Brain,
    title: "AI Matching Engine",
    description:
      "A recommendation system trained on real hiring patterns to connect students with the right roles faster.",
  },
  {
    icon: ShieldCheck,
    title: "Verification Layer",
    description:
      "A dedicated screening process that keeps fake postings and unverified recruiters off the platform.",
  },
  {
    icon: LayoutDashboard,
    title: "Unified Dashboard",
    description:
      "One workspace bringing applications, resumes, and guidance together instead of scattered tools.",
  },
];

export default function About() {
  return (
    <main className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 dark:from-indigo-950 dark:via-violet-950 dark:to-purple-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_50%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_45%)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/30 animate-in fade-in zoom-in duration-700">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight max-w-3xl">
            About AI Smart Internship Portal
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/85 max-w-2xl">
            An AI-powered platform that connects students with the right internships,
            simplifying discovery, applications, and career growth in one place.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-xl">
            {[Brain, ShieldCheck, Rocket].map((Icon, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm px-3 py-4 ring-1 ring-white/20 transition-transform duration-300 hover:-translate-y-1"
              >
                <Icon className="h-6 w-6" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
              <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Our Mission
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Our mission is to remove the guesswork from finding an internship. By
              using AI to understand each student's skills, interests, and career
              goals, we help match them with opportunities where they can genuinely
              thrive, instead of leaving them to search through endless listings that
              don't fit.
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40 p-8 sm:p-10 ring-1 ring-border">
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">
              Focused on outcomes
            </p>
            <p className="text-2xl font-semibold text-foreground">
              The right internship, matched by intelligence, not luck.
            </p>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/40 p-8 sm:p-10 ring-1 ring-border">
              <p className="text-sm font-medium text-violet-600 dark:text-violet-400 mb-2">
                Looking ahead
              </p>
              <p className="text-2xl font-semibold text-foreground">
                A single bridge connecting every student to every opportunity.
              </p>
            </div>
            <div className="order-1 lg:order-2 flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40">
                <Eye className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Our Vision
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                We envision a future where every student, regardless of background or
                location, has direct access to meaningful internships, and where
                companies can effortlessly discover talent that fits their needs. Our
                platform aims to become the trusted bridge between ambitious students
                and forward-thinking organizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/40">
              <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Our Story
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              This platform was built after seeing how many talented students
              struggled to find internships that matched their skills, while
              companies struggled to find candidates ready to contribute. We combined
              AI-driven matching with a simple, transparent application experience to
              close that gap, giving students a faster path to real opportunities and
              companies a reliable way to discover them.
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 p-8 sm:p-10 ring-1 ring-border">
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
              Why we started
            </p>
            <p className="text-2xl font-semibold text-foreground">
              Built to fix a broken, frustrating internship search.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-3">
              Key Features
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Everything you need in one platform
            </h2>
            <p className="mt-3 text-muted-foreground text-base sm:text-lg">
              Purpose-built tools that guide you from discovery to offer.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {keyFeatures.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="rounded-2xl border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                    <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Students Choose Us */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-3">
            Why Students Choose Us
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Designed around real student needs
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="rounded-2xl border-border/60 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/40">
                  <Icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 dark:from-indigo-950 dark:via-violet-950 dark:to-purple-950 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Platform Statistics
            </h2>
            <p className="mt-3 text-white/80 text-base sm:text-lg">
              Numbers that reflect the trust students and companies place in us.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {platformStats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20 px-6 py-8 text-center transition-transform duration-300 hover:-translate-y-1"
              >
                <Icon className="h-7 w-7" />
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-sm text-white/80">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Core Values */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-3">
            Our Core Values
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            What guides every decision we make
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {coreValues.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="rounded-2xl border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/40">
                  <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Meet Our Platform */}
      <section className="bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-3">
              Meet Our Platform
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              The systems working behind every match
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {platformHighlights.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="rounded-2xl border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                    <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 dark:from-indigo-950 dark:via-violet-950 dark:to-purple-950 text-white px-6 sm:px-12 py-14 sm:py-16 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="relative flex flex-col items-center gap-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight max-w-xl">
              Start Your Internship Journey Today
            </h2>
            <p className="text-white/85 max-w-md text-base sm:text-lg">
              Join thousands of students already discovering internships matched to
              their goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-white text-indigo-700 hover:bg-white/90 rounded-xl font-semibold"
              >
                Explore Internships
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20 rounded-xl font-semibold"
              >
                Create Account
                <UserPlus className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
