import { BigInt } from "@graphprotocol/graph-ts";
import { MintEvent } from "../../generated/schema";
import { MintEvent as MintEventEvent } from "../../generated/LittleMartians/LittleMartians";

export function handleMintEvent(event: MintEventEvent): void {
  let entity = new MintEvent(event.transaction.hash.toHex());
  entity.to = event.params.to;
  entity.tokenId = event.params.tokenId;
  entity.save();
}
