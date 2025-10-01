import type { SNSEvent, SNSHandler, SNSEventRecord } from "aws-lambda";

// utils
import { emailExec, logger, type Message } from "@/utils";
import { SecretService } from "./services";

(async () => {
  try {
    logger.debug("fetching secrets during lambda warmup");
    await Promise.all([SecretService.getInstance()]);
  } catch (error) {
    logger.error("Error fetching secrets during lambda warmup", { error });
  }
})();

export const functionHandler: SNSHandler = async (
  event: SNSEvent,
): Promise<void> => {
  logger.info(`Received ${event.Records.length} SNS messages`);

  await Promise.all(event.Records.map((record) => processMessageAsync(record)));

  logger.info("All messages processed");
};

async function processMessageAsync(record: SNSEventRecord): Promise<void> {
  try {
    const rawMessage = record.Sns?.Message;

    logger.info("Processing SNS message", {
      message: rawMessage,
      subject: record.Sns?.Subject,
      messageId: record.Sns?.MessageId,
    });

    let message: Message;

    try {
      message = JSON.parse(rawMessage) as Message;
    } catch (error) {
      logger.error("Invalid SNS message JSON", { rawMessage, error });
      return;
    }

    await emailExec(message);
  } catch (err) {
    console.error("❌ Error processing message:", err);
    throw err;
  }
}
