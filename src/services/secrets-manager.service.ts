import {
  GetSecretValueCommand,
  ListSecretsCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

// utils
import { logger } from "@/utils";

export class SecretService {
  private static instance: SecretService;

  private client = new SecretsManagerClient({
    region: "ap-south-2",
  });

  private capstoneEmail: string = "";
  private capstoneEmailPass: string = "";

  constructor() {}

  static getInstance(forceReset = false): SecretService {
    if (!SecretService.instance || forceReset) {
      SecretService.instance = new SecretService();
    }

    return SecretService.instance;
  }

  async getCapstoneEmail() {
    if (!this.capstoneEmail) {
      logger.debug("[SecretService] Fetching capstone email");
      this.capstoneEmail = await this.getSecretKey("STG_EMAIL_CAPSTONE");
      logger.debug("[SecretService] capstoneEmail cached");
    }
    return this.capstoneEmail;
  }

  async getCapstoneEmailPass() {
    if (!this.capstoneEmailPass) {
      logger.debug("[SecretService] Fetching capstone email password");
      this.capstoneEmailPass = await this.getSecretKey(
        "STG_EMAIL_PASS_CAPSTONE",
      );
      logger.debug("[SecretService] capstoneEmailPass cached");
    }
    return this.capstoneEmailPass;
  }

  async getSecretKey(secretId: string) {
    if (!secretId) {
      const msg = `[SecretService] secretId is empty/undefined`;
      logger.error(msg);
      throw new Error(msg);
    }

    logger.debug(`[SecretService] getSecretKey(secretId: ${secretId})`);
    try {
      const response = await this.client.send(
        new GetSecretValueCommand({
          SecretId: secretId,
        }),
      );

      // Safe logging - only log what we need
      logger.debug(
        `[SecretService] Secret retrieved successfully for: ${secretId}`,
        {
          name: response.Name,
          arn: response.ARN,
          createdDate: response.CreatedDate,
          hasSecretString: !!response.SecretString,
          secretStringLength: response.SecretString?.length,
        },
      );

      if (response.SecretString) return response.SecretString;

      throw new Error(`[SecretService] SecretString ${secretId} not found`);
    } catch (err) {
      logger.error("[SecretService] Error fetching secret", {
        secretId,
        errorMessage: err instanceof Error ? err.message : String(err),
        errorName: err instanceof Error ? err.name : "Unknown",
      });
      throw err;
    }
  }
}

// Test AWS connectivity
export const testSecrets = async () => {
  try {
    const client = new SecretsManagerClient({ region: "ap-south-2" });
    const command = new ListSecretsCommand({});
    const result = await client.send(command);
    console.log(
      "Available secrets:",
      result.SecretList?.map((s) => s.Name),
    );
  } catch (error) {
    console.error("Secrets Manager test failed:", error);
  }
};
