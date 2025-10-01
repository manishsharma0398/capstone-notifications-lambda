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

let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (!transporter) {
    const secretService = SecretService.getInstance();
    const user = await secretService.getCapstoneEmail();
    const pass = await secretService.getCapstoneEmailPass();

    logger.debug("getTransporter");
    logger.debug("secret values", { user, pass });

    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return transporter;
}

export async function sendEmail({ subject, text, to, html }: sendEmailTypes) {
  try {
    logger.debug("entered sendEmail function");
    const [transport, user] = await Promise.all([
      getTransporter(),
      SecretService.getInstance().getCapstoneEmail(),
    ]);

    logger.debug("will send email now");

    const info = await transport.sendMail({
      from: `Community Connect <${user}>`,
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
