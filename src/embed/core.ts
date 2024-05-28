import { KeyManager } from "./keymanager";
import { Connection, PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import config from "./config";


export class core {

    readonly keymanager: KeyManager;
    readonly connection: Connection;

    constructor(keymanager: KeyManager) {
        this.keymanager = keymanager;
        this.connection = new Connection(config.rpcUrl, config.commitment);
    }

    async BuildTransaction(ix: TransactionInstruction[], payer: PublicKey) {

        const connection = this.connection;

        // create v0 compatible message
        let {blockhash} = await connection.getLatestBlockhash();
        const messageV0 = new TransactionMessage({
            payerKey: payer,
            recentBlockhash: blockhash,
            instructions: ix,
        }).compileToV0Message();

        return new VersionedTransaction(messageV0);
    }

    async SignTransaction(txn: VersionedTransaction) {
        // Sign a transaction using keymanager.
        await this.keymanager.sign(txn);
    }

    async SendTransaction(txn: VersionedTransaction) {
        // Send a transaction to the network.
        return this.connection.sendTransaction(txn);
    }
}