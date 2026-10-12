import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  GraduationCap,
  TrendingUp,
  Sparkles,
  Target,
  ShieldCheck,
  FileText,
  Compass,
  UserPlus,
  Upload,
  Send,
  Star,
  ArrowRight,
  CheckCircle2,
  Quote,
  Wallet,
  Clock,
  BrainCircuit,
} from "lucide-react";

const stats = [
  { label: "Total Companies", value: "1,200+", icon: Building2 },
  { label: "Total Internships", value: "8,500+", icon: Briefcase },
  { label: "Students Placed", value: "42,000+", icon: GraduationCap },
  { label: "Success Rate", value: "94%", icon: TrendingUp },
];

const featuredInternships = [
  {
    title: "Frontend Engineering Intern",
    company: "NimbusWorks",
    location: "Bengaluru, India",
    stipend: "₹25,000/mo",
    duration: "3 Months",
    tags: ["React", "TypeScript"],
  },
  {
    title: "Data Science Intern",
    company: "Quantify Labs",
    location: "Remote",
    stipend: "₹30,000/mo",
    duration: "6 Months",
    tags: ["Python", "ML"],
  },
  {
    title: "Product Design Intern",
    company: "Studio Arc",
    location: "Pune, India",
    stipend: "₹20,000/mo",
    duration: "4 Months",
    tags: ["Figma", "UX"],
  },
  {
    title: "Backend Development Intern",
    company: "CoreStack Systems",
    location: "Hyderabad, India",
    stipend: "₹28,000/mo",
    duration: "3 Months",
    tags: ["Node.js", "AWS"],
  },
  {
    title: "Digital Marketing Intern",
    company: "Reach Collective",
    location: "Remote",
    stipend: "₹15,000/mo",
    duration: "2 Months",
    tags: ["SEO", "Analytics"],
  },
  {
    title: "AI Research Intern",
    company: "Cognith AI",
    location: "Mumbai, India",
    stipend: "₹35,000/mo",
    duration: "6 Months",
    tags: ["NLP", "PyTorch"],
  },
];

const whyChooseUs = [
  {
    title: "Smart Matching",
    description:
      "Our AI analyzes your skills and goals to surface internships that genuinely fit you, not just keyword matches.",
    icon: Target,
  },
  {
    title: "Verified Companies",
    description:
      "Every company on the platform is manually vetted, so you apply with confidence and never worry about scams.",
    icon: ShieldCheck,
  },
  {
    title: "Resume Builder",
    description:
      "Build a recruiter-ready resume in minutes with guided templates tailored to internship applications.",
    icon: FileText,
  },
  {
    title: "Career Guidance",
    description:
      "Get personalized roadmaps and mentorship tips to help you choose the right path for your career.",
    icon: Compass,
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Create Profile",
    description: "Tell us about your skills, interests, and career goals.",
    icon: UserPlus,
  },
  {
    step: "02",
    title: "Upload Resume",
    description: "Add your resume so recruiters and our AI can understand you better.",
    icon: Upload,
  },
  {
    step: "03",
    title: "Get AI Recommendations",
    description: "Receive a curated list of internships matched to your profile.",
    icon: BrainCircuit,
  },
  {
    step: "04",
    title: "Apply Internship",
    description: "Apply directly through the portal in just a couple of clicks.",
    icon: Send,
  },
];

const testimonials = [
  {
    name: "Ananya Sharma",
    role: "Computer Science Student",
    quote:
      "The AI recommendations were spot on. I landed a frontend internship within two weeks of creating my profile.",
    initials: "AS",
  },
  {
    name: "Rohan Mehta",
    role: "MBA Aspirant",
    quote:
      "The resume builder alone was worth signing up for. My application shortlist rate improved dramatically.",
    initials: "RM",
  },
  {
    name: "Priya Nair",
    role: "Design Student",
    quote:
      "I loved how transparent the companies were. Verified listings made me trust the process completely.",
    initials: "PN",
  },
];

const faqs = [
  {
    question: "Is this platform free for students?",
    answer:
      "Yes, creating a profile, browsing internships, and applying through the portal is completely free for students.",
  },
  {
    question: "How does the AI recommendation system work?",
    answer:
      "Our AI looks at your skills, interests, resume, and past activity to rank internships that best match your profile, so you spend less time searching and more time applying.",
  },
  {
    question: "Are all the companies verified?",
    answer:
      "Every company is manually reviewed by our team before their listings go live, ensuring you only see genuine opportunities.",
  },
  {
    question: "Can I apply to multiple internships at once?",
    answer:
      "Yes, you can apply to as many internships as you like. Your profile and resume are reused automatically for every application.",
  },
  {
    question: "Do you offer support for remote internships?",
    answer:
      "Absolutely. You can filter internships by location, including a dedicated remote option, right from the search section.",
  },
];

export default function Home() {
  const [keyword, setKeyword] = useState("");

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container mx-auto grid gap-12 px-4 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 text-center lg:text-left">
            <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              AI-Powered Internship Matching
            </Badge>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Launch Your Career with the{" "}
              <span className="text-primary">Right Internship</span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground lg:mx-0">
              Discover internships tailored to your skills using AI-driven
              recommendations, apply in a few clicks, and get closer to your
              dream career every day.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Button size="lg" asChild className="group">
                <Link to="/internships">
                  Find Internship
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/opportunities">Explore Opportunities</Link>
              </Button>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 relative mx-auto flex h-72 w-full max-w-md items-center justify-center sm:h-96">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/20 to-primary/5 blur-2xl" />
            <div className="relative flex h-full w-full items-center justify-center rounded-3xl border bg-card p-8 shadow-xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col items-center gap-2 rounded-2xl border bg-background p-5 shadow-sm transition-transform hover:-translate-y-1">
                  <BrainCircuit className="h-8 w-8 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    AI Matching
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-2xl border bg-background p-5 shadow-sm transition-transform hover:-translate-y-1">
                  <Briefcase className="h-8 w-8 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    8,500+ Roles
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-2xl border bg-background p-5 shadow-sm transition-transform hover:-translate-y-1">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Verified
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-2xl border bg-background p-5 shadow-sm transition-transform hover:-translate-y-1">
                  <GraduationCap className="h-8 w-8 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    42k+ Placed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="border-b bg-muted/40">
        <div className="container mx-auto px-4 py-10">
          <Card className="mx-auto -mt-16 max-w-4xl rounded-2xl border shadow-lg lg:-mt-24">
            <CardContent className="grid gap-4 p-6 md:grid-cols-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Job title, skill, or company"
                  className="pl-9"
                />
              </div>
              <Select>
                <SelectTrigger>
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="bengaluru">Bengaluru</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="data">Data Science</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="ai">AI &amp; Research</SelectItem>
                </SelectContent>
              </Select>
              <Button className="md:col-span-4">
                <Search className="mr-2 h-4 w-4" />
                Search Internships
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="rounded-2xl text-center transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="flex flex-col items-center gap-3 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl font-bold sm:text-3xl">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Internships Section */}
      <section className="border-y bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Internships
              </h2>
              <p className="mt-2 text-muted-foreground">
                Hand-picked opportunities from top verified companies.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/internships">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredInternships.map((internship) => (
              <Card
                key={internship.title}
                className="group flex flex-col rounded-2xl transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <CardHeader className="flex-row items-start gap-4 space-y-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg leading-snug transition-colors group-hover:text-primary">
                      {internship.title}
                    </CardTitle>
                    <CardDescription>{internship.company}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {internship.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wallet className="h-4 w-4" />
                    {internship.stipend}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {internship.duration}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {internship.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Apply Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendation Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden rounded-3xl border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background shadow-lg">
            <CardContent className="grid gap-8 p-8 lg:grid-cols-2 lg:items-center lg:p-12">
              <div className="space-y-5">
                <Badge variant="secondary" className="rounded-full px-4 py-1.5">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  Powered by AI
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Internships Recommended Just for You
                </h2>
                <p className="text-muted-foreground">
                  Our recommendation engine studies your skills, resume, and
                  interests to rank internships by how well they truly fit
                  you, saving you hours of manual searching.
                </p>
                <ul className="space-y-3">
                  {[
                    "Personalized matches based on your profile",
                    "Continuously improves as you interact with listings",
                    "Highlights skill gaps and growth opportunities",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button size="lg">
                  Get My Recommendations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="mx-auto grid w-full max-w-sm grid-cols-2 gap-4">
                {[BrainCircuit, Target, TrendingUp, Sparkles].map((Icon, i) => (
                  <div
                    key={i}
                    className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border bg-background/80 p-4 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
                  >
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="border-y bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Why Choose Us</h2>
            <p className="mt-2 text-muted-foreground">
              Everything you need to land the right internship, in one place.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item) => (
              <Card
                key={item.title}
                className="rounded-2xl text-center transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="flex flex-col items-center gap-3 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-2 text-muted-foreground">
              Four simple steps to your next internship.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, index) => (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md transition-transform hover:-translate-y-1">
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="mt-4 block text-sm font-semibold text-primary">
                  Step {step.step}
                </span>
                <h3 className="mt-1 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
                {index < howItWorks.length - 1 && (
                  <div className="absolute right-[-1rem] top-8 hidden h-px w-8 bg-border lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="border-y bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              What Students Say
            </h2>
            <p className="mt-2 text-muted-foreground">
              Real stories from students who found their path with us.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <Card
                key={t.name}
                className="rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="space-y-4 p-6">
                  <Quote className="h-6 w-6 text-primary/40" />
                  <p className="text-sm text-muted-foreground">{t.quote}</p>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{t.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-primary text-primary"
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-muted-foreground">
              Answers to the questions we hear most often.
            </p>
          </div>
          <Accordion type="single" collapsible className="mx-auto max-w-2xl">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden rounded-3xl bg-primary shadow-xl">
            <CardContent className="flex flex-col items-center gap-6 p-10 text-center text-primary-foreground sm:p-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Start Your Internship Journey Today
              </h2>
              <p className="max-w-xl text-primary-foreground/80">
                Join thousands of students who found the right internship with
                AI-powered recommendations. Your next opportunity is one click
                away.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/signup">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link to="/internships">Browse Internships</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}