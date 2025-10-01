import nodemailer from "nodemailer";

// utils
import { logger } from "@/utils";

// services
import { SecretService } from "@/services";

export interface sendEmailTypes {
  to: string;
  text: string;
  html: string;
  subject: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: await SecretService.getInstance().getCapstoneEmail(),
    pass: await SecretService.getInstance().getCapstoneEmailPass(),
  },
});

export async function sendEmail({ subject, text, to, html }: sendEmailTypes) {
  try {
    const info = await transporter.sendMail({
      from: `Community Connect <${await SecretService.getInstance().getCapstoneEmail()}>`,
      to,
      subject,
      text,
      html,
    });
    logger.info("📧 Email sent:", info.response);
  } catch (error) {
    logger.error("❌ Email sending failed:", { error });
    throw error;
  }
}
