import { PublicKey, SystemProgram } from "@solana/web3.js";
import { core } from "./core";

export async function ix_Transfer(embeddedWallet: core, receiverAddr: string, amount: number) {
    return [
        SystemProgram.transfer({
          fromPubkey: await embeddedWallet.keymanager.getPublicKey(),
          toPubkey: new PublicKey(receiverAddr),
          lamports: amount,
        }),
    ];
}