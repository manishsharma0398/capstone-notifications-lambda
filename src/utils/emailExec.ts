// services
import { sendEmail } from "@/services";

// utils
import { type Message, logger } from "@/utils";

export const emailExec = async (record: Message) => {
  logger.info("emailExec", { record });

  const { data, type } = record;

  logger.info("emailExec2", { record });

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
