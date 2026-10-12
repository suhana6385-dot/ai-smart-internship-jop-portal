import { useState, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  GraduationCap,
  Building2,
  LifeBuoy,
  Compass,
  Map,
  ArrowRight,
  MessageCircleQuestion,
  AlertCircle,
} from "lucide-react";

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "support@aismartinternship.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 123-4567",
  },
  {
    icon: MapPin,
    label: "Office Address",
    value: "221B Innovation Avenue, Bengaluru, India",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon - Fri, 9:00 AM - 6:00 PM",
  },
];

const whyContactUs = [
  {
    icon: GraduationCap,
    title: "Student Support",
    description:
      "Get help with your profile, applications, or finding the right internship match.",
  },
  {
    icon: Building2,
    title: "Employer Support",
    description:
      "Reach out for hiring assistance, posting internships, or account verification.",
  },
  {
    icon: LifeBuoy,
    title: "Technical Support",
    description:
      "Facing a bug or login issue? Our technical team is ready to help you out.",
  },
  {
    icon: Compass,
    title: "Career Guidance",
    description:
      "Talk to our guidance team about career paths, skills, and internship readiness.",
  },
];

const faqs = [
  {
    question: "How does the AI internship matching work?",
    answer:
      "Our AI analyzes your skills, interests, academic background, and career goals to recommend internships that best fit your profile, updating suggestions as your profile evolves.",
  },
  {
    question: "Is the platform free for students?",
    answer:
      "Yes, creating an account, browsing internships, and applying through the platform is completely free for all students.",
  },
  {
    question: "How are companies verified on the platform?",
    answer:
      "Every company goes through a verification process that checks business legitimacy and hiring history before they're allowed to post internships.",
  },
  {
    question: "Can I edit my application after submitting it?",
    answer:
      "Once submitted, applications cannot be edited, but you can withdraw and reapply with updated information from your student dashboard.",
  },
  {
    question: "How long does it take to hear back from a company?",
    answer:
      "Response times vary by company, but most recruiters respond within 5 to 10 business days. You can track your application status anytime from your dashboard.",
  },
  {
    question: "What should I do if I forget my password?",
    answer:
      "Use the 'Forgot Password' link on the login page to reset it securely through your registered email address.",
  },
];

const initialFormData: ContactFormData = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (data: ContactFormData): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (data.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters.";
    }

    if (!data.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!data.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[+]?[\d\s-]{7,15}$/.test(data.phone)) {
      newErrors.phone = "Enter a valid phone number.";
    }

    if (!data.subject.trim()) {
      newErrors.subject = "Subject is required.";
    }

    if (!data.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (data.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    return newErrors;
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitted(true);
      setFormData(initialFormData);
      setTimeout(() => setIsSubmitted(false), 5000);
    }
  };

  return (
    <main className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 dark:from-indigo-950 dark:via-violet-950 dark:to-purple-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_50%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_45%)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/30 animate-in fade-in zoom-in duration-700">
            <MessageCircleQuestion className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight max-w-3xl">
            Contact Us
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/85 max-w-2xl">
            Whether you're a student looking for guidance or a recruiter with a
            question, our team is here to help you every step of the way.
          </p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map(({ icon: Icon, label, value }) => (
            <Card
              key={label}
              className="rounded-2xl border-border/60 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40">
                  <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{label}</h3>
                <p className="text-sm text-muted-foreground break-words">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Form + Office Location */}
      <section className="bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
            {/* Contact Form */}
            <Card className="lg:col-span-3 rounded-2xl border-border/60">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                  Send Us a Message
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Fill out the form below and our team will get back to you shortly.
                </p>

                {isSubmitted && (
                  <div className="mb-6 rounded-xl bg-green-50 dark:bg-green-950/40 ring-1 ring-green-200 dark:ring-green-900 px-4 py-3 text-sm text-green-700 dark:text-green-400">
                    Your message has been sent successfully. We'll be in touch soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Jane Doe"
                        value={formData.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        aria-invalid={!!errors.fullName}
                        className={
                          errors.fullName
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }
                      />
                      {errors.fullName && (
                        <p className="flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jane@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        aria-invalid={!!errors.email}
                        className={
                          errors.email
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }
                      />
                      {errors.email && (
                        <p className="flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 555 123 4567"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        aria-invalid={!!errors.phone}
                        className={
                          errors.phone
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }
                      />
                      {errors.phone && (
                        <p className="flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Internship application query"
                        value={formData.subject}
                        onChange={(e) => handleChange("subject", e.target.value)}
                        aria-invalid={!!errors.subject}
                        className={
                          errors.subject
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }
                      />
                      {errors.subject && (
                        <p className="flex items-center gap-1 text-xs text-destructive">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.subject}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      aria-invalid={!!errors.message}
                      className={
                        errors.message
                          ? "border-destructive focus-visible:ring-destructive resize-none"
                          : "resize-none"
                      }
                    />
                    {errors.message && (
                      <p className="flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="mt-2 w-full sm:w-auto rounded-xl font-semibold"
                  >
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Office Location */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <Card className="rounded-2xl border-border/60 overflow-hidden">
                <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950/50 dark:to-violet-950/50">
                  <div className="flex flex-col items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <Map className="h-10 w-10" />
                    <span className="text-sm font-medium">Office Location Map</span>
                  </div>
                </div>
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Office Address
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        221B Innovation Avenue, Bengaluru, India
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Business Hours
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Monday - Friday, 9:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Contact Us */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-3">
            Why Contact Us
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            We're here for every kind of question
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyContactUs.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="rounded-2xl border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40">
                  <Icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
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

      {/* FAQs */}
      <section className="bg-muted/40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-3">
              FAQs
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
          </div>
          <Card className="rounded-2xl border-border/60">
            <CardContent className="p-4 sm:p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-sm sm:text-base font-medium text-foreground">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call To Action */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 dark:from-indigo-950 dark:via-violet-950 dark:to-purple-950 text-white px-6 sm:px-12 py-14 sm:py-16 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="relative flex flex-col items-center gap-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight max-w-xl">
              Need More Help?
            </h2>
            <p className="text-white/85 max-w-md text-base sm:text-lg">
              Our support team is just a message away, ready to help you move
              forward.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-white text-indigo-700 hover:bg-white/90 rounded-xl font-semibold"
              >
                Contact Support
                <LifeBuoy className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20 rounded-xl font-semibold"
              >
                Explore Internships
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}