import {
  MintEvent as MintEventEvent,  
} from "../generated/LittleMartians/LittleMartians"
import {
  MintEvent,
} from "../generated/schema"

export function handleMintEvent(event: MintEventEvent): void {
  let entity = new MintEvent(event.transaction.hash.toHex())
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId
  entity.save()
}

