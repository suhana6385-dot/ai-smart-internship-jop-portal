import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  ShieldCheck,
  Database,
  Settings2,
  FileText,
  Brain,
  Cookie,
  Lock,
  Share2,
  UserCog,
  Mail,
  CalendarClock,
  ArrowUp,
  Phone,
  MapPin,
} from "lucide-react";

interface PolicySection {
  id: string;
  icon: typeof ShieldCheck;
  title: string;
  content: string[];
}

const policySections: PolicySection[] = [
  {
    id: "introduction",
    icon: ShieldCheck,
    title: "1. Introduction",
    content: [
      "Welcome to AI Smart Internship & Job Portal. We are committed to protecting the privacy and security of every student, company, and visitor who uses our platform.",
      "This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your data. By accessing or using our platform, you agree to the practices described in this policy.",
      "We encourage you to read this document carefully. If you do not agree with any part of this policy, please discontinue use of the platform.",
    ],
  },
  {
    id: "information-we-collect",
    icon: Database,
    title: "2. Information We Collect",
    content: [
      "We collect information you provide directly to us, including your name, email address, phone number, educational background, work experience, and account credentials.",
      "We also collect information automatically when you use our platform, such as your IP address, browser type, device information, pages visited, and interaction patterns.",
      "Companies using our platform provide business details including company name, industry, size, contact information, and job or internship listings they publish.",
    ],
  },
  {
    id: "how-we-use-information",
    icon: Settings2,
    title: "3. How We Use Your Information",
    content: [
      "We use the information we collect to operate, maintain, and improve our platform, including matching students with relevant internships and job opportunities.",
      "Your information helps us personalize your experience, communicate important updates, respond to support requests, and detect or prevent fraudulent activity.",
      "We may also use aggregated, anonymized data for research, analytics, and to improve the overall quality and reliability of our services.",
    ],
  },
  {
    id: "resume-profile-data",
    icon: FileText,
    title: "4. Resume & Profile Data",
    content: [
      "Resumes, portfolios, and profile details you upload are used strictly to help you apply for internships and jobs, and to allow verified companies to evaluate your candidacy.",
      "You retain full control over your resume and profile information. You can edit, update, or delete this data from your dashboard at any time.",
      "We do not sell your resume or profile data to third parties. Access is limited to companies you apply to and platform administrators for support purposes.",
    ],
  },
  {
    id: "ai-recommendations",
    icon: Brain,
    title: "5. AI Recommendations",
    content: [
      "Our platform uses artificial intelligence to analyze your skills, interests, academic background, and activity to recommend relevant internships and job opportunities.",
      "AI-generated recommendations are provided for convenience and guidance only. They do not guarantee placement and should not be considered a substitute for your own judgment.",
      "We continuously refine our recommendation models using aggregated usage patterns while taking reasonable measures to protect individual privacy.",
    ],
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "6. Cookies",
    content: [
      "We use cookies and similar tracking technologies to remember your preferences, keep you signed in, and understand how you interact with our platform.",
      "You can control or disable cookies through your browser settings; however, doing so may affect certain features or functionality of the platform.",
      "We do not use cookies to sell your personal data to advertisers.",
    ],
  },
  {
    id: "data-security",
    icon: Lock,
    title: "7. Data Security",
    content: [
      "We implement industry-standard technical and organizational measures, including encryption, access controls, and regular security audits, to protect your personal information.",
      "While we take reasonable steps to safeguard your data, no method of electronic transmission or storage is completely secure, and we cannot guarantee absolute security.",
      "In the event of a data breach that affects your personal information, we will notify affected users in accordance with applicable laws.",
    ],
  },
  {
    id: "third-party-services",
    icon: Share2,
    title: "8. Third-Party Services",
    content: [
      "We may share limited information with trusted third-party service providers who help us operate the platform, such as cloud hosting, analytics, and email delivery services.",
      "These providers are contractually obligated to protect your data and are prohibited from using it for any purpose other than providing services to us.",
      "Our platform may contain links to third-party websites. We are not responsible for the privacy practices or content of those external sites.",
    ],
  },
  {
    id: "user-rights",
    icon: UserCog,
    title: "9. User Rights",
    content: [
      "You have the right to access, update, or delete your personal information at any time through your account settings or by contacting our support team.",
      "You may request a copy of the personal data we hold about you, object to certain processing activities, or withdraw consent where processing is based on consent.",
      "If you wish to deactivate or permanently delete your account, you can do so from your dashboard settings, and we will remove your data in accordance with our retention policy.",
    ],
  },
  {
    id: "contact-information",
    icon: Mail,
    title: "10. Contact Information",
    content: [
      "If you have any questions, concerns, or requests regarding this Privacy Policy or how your data is handled, please reach out to our support team.",
      "We aim to respond to all privacy-related inquiries within a reasonable timeframe and will work with you to resolve any concerns.",
    ],
  },
];

const contactDetails = [
  { icon: Mail, label: "privacy@aismartinternship.com" },
  { icon: Phone, label: "+1 (555) 123-4567" },
  { icon: MapPin, label: "221B Innovation Avenue, Bengaluru, India" },
];

export default function Privacy() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 dark:from-indigo-950 dark:via-violet-950 dark:to-purple-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_50%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_45%)]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/30"
          >
            <ShieldCheck className="h-8 w-8 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight"
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-4 text-base sm:text-lg text-white/85 max-w-2xl"
          >
            Your trust matters to us. Learn how AI Smart Internship & Job Portal
            collects, uses, and protects your personal information.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-6"
          >
            <Badge className="rounded-full bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/20 px-4 py-1.5">
              <CalendarClock className="mr-1.5 h-3.5 w-3.5" />
              Last Updated: July 18, 2026
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col gap-8">
          {policySections.map((section, index) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
            >
              <Card className="rounded-2xl border-border/60">
                <CardContent className="p-6 sm:p-8 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40 shrink-0">
                      <section.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                      {section.title}
                    </h2>
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-3">
                    {section.content.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
          >
            <Card className="rounded-2xl border-border/60 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40">
              <CardContent className="p-6 sm:p-8 flex flex-col gap-5">
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Have questions about your privacy?
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Reach out to our support team using any of the details below.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {contactDetails.map((detail) => (
                    <div
                      key={detail.label}
                      className="flex items-center gap-2 rounded-xl bg-background/70 dark:bg-background/40 px-4 py-3 ring-1 ring-border/60"
                    >
                      <detail.icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <span className="text-sm text-foreground break-words">
                        {detail.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Back to Top */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex justify-center pt-2"
          >
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={scrollToTop}
            >
              <ArrowUp className="mr-2 h-4 w-4" />
              Back to Top
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
