import web3js from "@solana/web3.js";
import { KeyManager } from "../keymanager";
import fs from "fs";
import { Command } from "commander";

export class LocalKeyManager implements KeyManager {

    keystorePath: string;

    constructor() {
        this.keystorePath = "./default_key.json";
    }

    populateCommands(program: Command) {
        program
            .command('key-generate')
            .description('Generate a new keypair')
            .action(() => {
                this.getAddress()
                    .then(() => {
                        console.log(`Keypair already exists. Delete the key before generating a new one.`);
                    })
                    .catch(async () => {
                        this.generateKey();
                        console.log(`New keypair generated for address: ${await this.getAddress()}`);
                    });
            });

        program
            .command('key-delete')
            .description('Delete the existing keypair. WARNING: This action is irreversible.')
            .action(async () => {
                this.getAddress()
                    .then((keypairAddress) => {
                        this.purgeKey();
                        console.log(`Deleted keypair for address: ${keypairAddress}.`);
                    })
                    .catch(() => {
                        console.log(`No keypair exists. Generate a new keypair.`);
                    });
            });

        program
            .command('key-show')
            .description('Show the existing public key address')
            .action(async () => {
                this.getAddress()
                    .then((keypairAddress) => {
                        console.log(`${keypairAddress}`);
                    })
                    .catch(() => {
                        console.log(`No keypair exists. Generate a new keypair.`);
                    });
            });
    }

    purgeKey() {
        if (fs.existsSync(this.keystorePath)) {
            fs.unlinkSync(this.keystorePath);
        }
    }

    async getAddress(): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.loadKey().publicKey.toBase58());
            } catch (e) {
                reject();
            }
        });
    }

    generateKey(overwrite: boolean = false) {

        if (fs.existsSync(this.keystorePath) && !overwrite) {
            throw new Error("Keystore file already exists. Use overwrite flag to overwrite the file.");
        }

        const kp = web3js.Keypair.generate();

        // Write the private key to file using the keystorePath.
        fs.writeFileSync(this.keystorePath, `[${kp.secretKey}]`);
    }

    loadKey(): web3js.Keypair {
        const secret = JSON.parse(fs.readFileSync(this.keystorePath).toString()) as number[];
        const secretKey = Uint8Array.from(secret);
        return web3js.Keypair.fromSecretKey(secretKey);
    }

    getPublicKey(): Promise<web3js.PublicKey> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.loadKey().publicKey);
            } catch (e) {
                reject();
            }
        });
    }

    sign(txn: web3js.VersionedTransaction) {
        txn.sign([this.loadKey()]);
    }
}