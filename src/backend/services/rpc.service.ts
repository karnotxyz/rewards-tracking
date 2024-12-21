import { Injectable } from "@nestjs/common";

@Injectable()
export class RpcService {
  constructor() {
    console.log("RpcService created");
  }
}
