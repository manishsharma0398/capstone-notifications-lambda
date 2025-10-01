import type { SNSEvent, SNSHandler, SNSEventRecord } from "aws-lambda";

// utils
import { emailExec, logger, type Message } from "@/utils";

// services
import { SecretService } from "@/services";

(async () => {
  try {
    logger.debug("fetching secrets during lambda warmup");
    await Promise.all([SecretService.getInstance()]);
  } catch (error) {
    logger.error("Error fetching secrets during lambda warmup", { error });
  }
})();

export const handler: SNSHandler = async (event: SNSEvent): Promise<void> => {
  logger.info(`Received ${event.Records.length} SNS messages`);

  await Promise.all(event.Records.map((record) => processMessageAsync(record)));

  logger.info("All messages processed");
};

async function processMessageAsync(record: SNSEventRecord): Promise<void> {
  try {
    const rawMessage = record.Sns?.Message;

    logger.info("Processing SNS message", {
      rawMessage,
      subject: record.Sns?.Subject,
      messageId: record.Sns?.MessageId,
    });

    let message: Message;

    try {
      logger.info("parsing message");
      message = JSON.parse(rawMessage) as Message;
      logger.info("message parsed", { message });
    } catch (error) {
      logger.error("Invalid SNS message JSON", { rawMessage, error });
      return;
    }

    logger.info("before emailExec");
    await emailExec(message);
    logger.info("after emailExec");
  } catch (err) {
    console.error("❌ Error processing message:", err);
    throw err;
  }
}
