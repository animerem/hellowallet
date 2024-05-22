import { Keypair } from "@solana/web3.js";
import bs58 from 'bs58';
import fs from 'fs';

export function generateKeypair(savePath:string | undefined) {
    //Generate a new keypair
    let kp = Keypair.generate()

    if(savePath === undefined) {
        console.log(
            `You've generated a new Solana wallet:\n
            Public:\n\t${kp.publicKey.toBase58()}
            Private:\n\t${bs58.encode(kp.secretKey)}\n

            To save your wallet, copy and paste the following into a JSON file:\n
            [${kp.secretKey}]`
        );
    } else {
        // Write the secret key to file as a JSON array
        fs.writeFileSync(savePath, `[${kp.secretKey}]`);
        console.log(
            `You've generated a new Solana keypair: ${kp.publicKey.toBase58()}\n
            Your secret key has been saved to ${savePath}`
        );
    }
}