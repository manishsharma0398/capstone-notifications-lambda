import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

// utils
import { Env, logger } from "@/utils";

export class SecretService {
  private static instance: SecretService;

  private client = new SecretsManagerClient({ region: "ap-south-2" }); // reused

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
      this.capstoneEmail = await this.getSecretKey(Env.CAPSTONE_EMAIL_KEY!);
      logger.debug("[SecretService] capstoneEmail cached");
    }
    return this.capstoneEmail;
  }

  async getCapstoneEmailPass() {
    if (!this.capstoneEmailPass) {
      logger.debug("[SecretService] Fetching capstone email password");
      this.capstoneEmailPass = await this.getSecretKey(
        Env.CAPSTONE_EMAIL_PASS_KEY!,
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
      const command = new GetSecretValueCommand({ SecretId: secretId });
      logger.debug(`[SecretService] Command created for: ${secretId}`);

      const res = await this.client.send(command);

      // Safe logging - only log what we need
      logger.debug(
        `[SecretService] Secret retrieved successfully for: ${secretId}`,
        {
          name: res.Name,
          arn: res.ARN,
          createdDate: res.CreatedDate,
          hasSecretString: !!res.SecretString,
          secretStringLength: res.SecretString?.length,
        },
      );

      if (res.SecretString) return res.SecretString;

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
