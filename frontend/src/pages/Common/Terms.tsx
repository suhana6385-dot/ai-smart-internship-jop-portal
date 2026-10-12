import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  ScrollText,
  CheckCircle2,
  UserCheck,
  UserCog,
  GraduationCap,
  Building2,
  ShieldCheck,
  ClipboardList,
  Copyright,
  AlertTriangle,
  Ban,
  RefreshCw,
  Mail,
  CalendarClock,
  ArrowUp,
  Phone,
  MapPin,
} from "lucide-react";

interface TermsSection {
  id: string;
  icon: typeof ScrollText;
  title: string;
  content: string[];
}

const termsSections: TermsSection[] = [
  {
    id: "acceptance-of-terms",
    icon: CheckCircle2,
    title: "1. Acceptance of Terms",
    content: [
      "By creating an account or otherwise accessing AI Smart Internship & Job Portal, you agree to be bound by these Terms & Conditions and our Privacy Policy.",
      "If you do not agree with any part of these terms, you must discontinue use of the platform immediately.",
      "We may update these terms from time to time, and your continued use of the platform constitutes acceptance of the revised terms.",
    ],
  },
  {
    id: "eligibility",
    icon: UserCheck,
    title: "2. Eligibility",
    content: [
      "You must be at least 16 years of age, or the applicable age of majority in your jurisdiction, to create an account on our platform.",
      "Companies registering on the platform must be legally registered business entities authorized to offer employment or internship opportunities.",
      "By using our platform, you represent that all information you provide during registration is accurate, current, and complete.",
    ],
  },
  {
    id: "user-accounts",
    icon: UserCog,
    title: "3. User Accounts",
    content: [
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
      "You must notify us immediately of any unauthorized use of your account or any other breach of security.",
      "We reserve the right to refuse registration, suspend, or terminate accounts that violate these terms or provide false information.",
    ],
  },
  {
    id: "student-responsibilities",
    icon: GraduationCap,
    title: "4. Student Responsibilities",
    content: [
      "Students are responsible for ensuring that all information in their profile, resume, and applications is truthful and accurately represents their skills and qualifications.",
      "Students agree to conduct themselves professionally when communicating with companies and to honor commitments made during the application and interview process.",
      "Misuse of the platform, including submitting fraudulent documents or misrepresenting qualifications, may result in account suspension or termination.",
    ],
  },
  {
    id: "company-responsibilities",
    icon: Building2,
    title: "5. Company Responsibilities",
    content: [
      "Companies agree to post only genuine, lawful, and accurately described job and internship opportunities on the platform.",
      "Companies must not request payment from students in exchange for internship or job offers, nor engage in discriminatory hiring practices prohibited by applicable law.",
      "Companies are responsible for maintaining the confidentiality of any candidate information accessed through the platform and using it solely for recruitment purposes.",
    ],
  },
  {
    id: "admin-rights",
    icon: ShieldCheck,
    title: "6. Admin Rights",
    content: [
      "Platform administrators reserve the right to review, approve, edit, or remove any content, listing, or account that violates these terms or platform guidelines.",
      "Administrators may access account information as necessary to investigate reported issues, ensure platform integrity, or comply with legal obligations.",
      "Decisions made by administrators regarding account status or content moderation are final and made in the interest of maintaining a safe and trustworthy platform.",
    ],
  },
  {
    id: "job-internship-posting-rules",
    icon: ClipboardList,
    title: "7. Job & Internship Posting Rules",
    content: [
      "All job and internship listings must include accurate details regarding compensation, duration, location, responsibilities, and eligibility requirements.",
      "Listings that are misleading, discriminatory, unpaid without proper disclosure where required by law, or otherwise violate applicable labor regulations are strictly prohibited.",
      "We reserve the right to remove any listing that does not comply with our posting guidelines without prior notice.",
    ],
  },
  {
    id: "intellectual-property",
    icon: Copyright,
    title: "8. Intellectual Property",
    content: [
      "All content on the platform, including but not limited to logos, design, text, graphics, and software, is the property of AI Smart Internship & Job Portal or its licensors and is protected by intellectual property laws.",
      "You retain ownership of the content you upload, such as your resume or company materials, but grant us a limited license to use, display, and process this content to operate the platform.",
      "You may not copy, reproduce, distribute, or create derivative works from platform content without our prior written consent.",
    ],
  },
  {
    id: "limitation-of-liability",
    icon: AlertTriangle,
    title: "9. Limitation of Liability",
    content: [
      "The platform is provided on an \"as is\" and \"as available\" basis without warranties of any kind, either express or implied.",
      "We do not guarantee the accuracy of job or internship listings, the outcome of any application, or the conduct of any student or company using the platform.",
      "To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.",
    ],
  },
  {
    id: "account-suspension-termination",
    icon: Ban,
    title: "10. Account Suspension & Termination",
    content: [
      "We reserve the right to suspend or terminate your account, without prior notice, if you violate these terms, engage in fraudulent activity, or misuse the platform.",
      "You may request deactivation of your account at any time through your account settings or by contacting our support team.",
      "Upon termination, your right to use the platform will immediately cease, though certain provisions of these terms will continue to apply as required by law.",
    ],
  },
  {
    id: "changes-to-terms",
    icon: RefreshCw,
    title: "11. Changes to Terms",
    content: [
      "We may revise these Terms & Conditions periodically to reflect changes in our practices, services, or applicable laws.",
      "Material changes will be communicated through the platform or via email, and the updated \"Last Updated\" date will reflect when changes take effect.",
      "Continued use of the platform after changes are posted constitutes your acceptance of the revised terms.",
    ],
  },
  {
    id: "contact-information",
    icon: Mail,
    title: "12. Contact Information",
    content: [
      "If you have any questions or concerns regarding these Terms & Conditions, please contact our support team using the details below.",
      "We are committed to addressing your concerns promptly and ensuring a fair and transparent experience for all users of our platform.",
    ],
  },
];

const contactDetails = [
  { icon: Mail, label: "legal@aismartinternship.com" },
  { icon: Phone, label: "+1 (555) 123-4567" },
  { icon: MapPin, label: "221B Innovation Avenue, Bengaluru, India" },
];

export default function Terms() {
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
            <ScrollText className="h-8 w-8 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight"
          >
            Terms &amp; Conditions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-4 text-base sm:text-lg text-white/85 max-w-2xl"
          >
            Please read these terms carefully before using AI Smart Internship &
            Job Portal. They govern your access to and use of our platform.
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

      {/* Terms Content */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col gap-8">
          {termsSections.map((section, index) => (
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
                    Questions about these terms?
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Reach out to our legal and support team using any of the
                    details below.
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