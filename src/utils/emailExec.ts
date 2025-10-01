import { logger } from "./logger";
import { sendEmail } from "../services";
import type { Message } from "./types";

export const emailExec = async (record: Message) => {
  const { data, type } = record;

  switch (type) {
    case "USER_REGISTERED_FROM_EMAIL":
      sendEmail({
        to: data.email,
        subject: "New Blog Central Account Created",
        text: "Welcome to the community of Community Connect",
        html: `Congratulations! ${data.firstName}, your Community Connect account has been successfully created.`,
      });
      break;

    default:
      logger.warn("Unknown SNS message type", { type });
      break;
  }
};
