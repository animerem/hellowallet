import { KeyManager } from "./keymanager";
import { Connection, PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import config, { KeystoreType } from "./config";
import { LedgerKeyManager } from './keymanagers/ledgerkeymanager';
import { LocalKeyManager } from './keymanagers/localkeymanager';


export class core {

    readonly keymanager: KeyManager;
    readonly connection: Connection;

    constructor(keymanager: KeyManager) {
        this.keymanager = keymanager;
        this.connection = new Connection(config.rpcUrl, config.commitment);
    }

    static async CreateAsync() {
        let keymanager: KeyManager;

        switch (config.keystoreType) {
            case KeystoreType.Local:
                keymanager = new LocalKeyManager();
                break;
            case KeystoreType.Ledger:
                keymanager = await LedgerKeyManager.createAsync();
                break;
            default:
                throw new Error(`Unsupported keystore type.`);
        }

        return new core(keymanager);
    }

    GetKeystoreType() {
        return config.keystoreType;
    }

    SetKeystoreType(keystoreType: string) {
        // Assert string is a valid enum value
        if (!Object.values(KeystoreType).includes(keystoreType as KeystoreType)) {
            throw new Error(`Unsupported keystore type: ${keystoreType}`);
        }

        config.keystoreType = keystoreType as KeystoreType;
        config.write();
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