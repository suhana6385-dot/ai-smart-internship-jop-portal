import transporter from "../config/mail";
import logger from "../utils/logger";

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async ({ to, subject, html }: MailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
    });
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${(error as Error).message}`);
  }
};

export const sendWelcomeEmail = async (to: string, name: string): Promise<void> => {
  await sendMail({
    to,
    subject: "Welcome to Campus Placement Portal",
    html: `<h2>Hi ${name},</h2><p>Your account has been created successfully. Start exploring jobs and internships now!</p>`,
  });
};

export const sendApplicationStatusEmail = async (
  to: string,
  name: string,
  jobTitle: string,
  status: string
): Promise<void> => {
  await sendMail({
    to,
    subject: `Application Update: ${jobTitle}`,
    html: `<p>Hi ${name},</p><p>Your application for <b>${jobTitle}</b> has been updated to: <b>${status}</b>.</p>`,
  });
};

export const sendInterviewScheduledEmail = async (
  to: string,
  name: string,
  jobTitle: string,
  scheduledAt: Date
): Promise<void> => {
  await sendMail({
    to,
    subject: `Interview Scheduled: ${jobTitle}`,
    html: `<p>Hi ${name},</p><p>Your interview for <b>${jobTitle}</b> is scheduled at <b>${scheduledAt.toLocaleString()}</b>.</p>`,
  });
};
