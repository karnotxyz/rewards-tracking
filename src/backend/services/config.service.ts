import {
  getAccount,
  getNetwork,
  getProvider,
  Network,
  NetworkConfig,
} from "./utils";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService {
  private static instance: ConfigService;
  private config: NetworkConfig;

  constructor() {
    this.config = {
      provider: getProvider(),
      account: getAccount(),
      network: getNetwork(),
    };
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  get<K extends keyof NetworkConfig>(key: K): NetworkConfig[K] {
    return this.config[key];
  }

  isSepolia(): boolean {
    return this.config.network === Network.sepolia;
  }

  provider() {
    return this.config.provider;
  }
}
