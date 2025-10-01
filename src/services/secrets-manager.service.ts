import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

// utils
import { Env, logger } from "@/utils";

export class SecretService {
  private static instance: SecretService;

  private client = new SecretsManagerClient({}); // reused

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
      const res = await this.client.send(command);
      if (res.SecretString) return res.SecretString;
      throw new Error(`[SecretService] SecretString ${secretId} not found`);
    } catch (err) {
      logger.error("[SecretService] error fetching secret", { secretId, err });
      throw err;
    }
  }
}
