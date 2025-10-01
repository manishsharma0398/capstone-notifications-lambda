import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

// utils
import { Env, logger } from "@/utils";

export class SecretService {
  private static instance: SecretService;

  private capstoneEmail: string;
  private capstoneEmailPass: string;

  constructor();
  constructor(capstoneEmail: string, capstoneEmailPass: string);
  constructor(capstoneEmail?: string, capstoneEmailPass?: string) {
    if (capstoneEmail && capstoneEmailPass) {
      this.capstoneEmail = capstoneEmail;
      this.capstoneEmailPass = capstoneEmailPass;
    } else {
      this.capstoneEmail = "";
      this.capstoneEmailPass = "";
    }
  }

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
    }
    return this.capstoneEmail;
  }

  async getCapstoneEmailPass() {
    if (!this.capstoneEmailPass) {
      logger.debug("[SecretService] Fetching capstone email password");
      this.capstoneEmailPass = await this.getSecretKey(
        Env.CAPSTONE_EMAIL_PASS_KEY!,
      );
    }
    return this.capstoneEmailPass;
  }

  async getSecretKey(secretId: string) {
    logger.debug(`[SecretService] getSecretKey(secretId: ${secretId})`);
    const secretsManagerClient = new SecretsManagerClient({});
    const command = new GetSecretValueCommand({ SecretId: secretId });

    const result = (await secretsManagerClient.send(command)).SecretString;
    if (result) {
      return result;
    }

    throw new Error(`[SecretService] SecretString ${secretId} not found`);
  }
}
