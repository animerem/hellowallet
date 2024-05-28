import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import { Command } from "commander";

export interface KeyManager {

    // Extends CLI commands for specialized key management.
    populateCommands(program: Command): any;
    
    generateKey(): any;
    purgeKey(): any;
    getAddress(): Promise<string>;
    getPublicKey(): Promise<PublicKey>;
    sign(txn: VersionedTransaction): any;
    
}