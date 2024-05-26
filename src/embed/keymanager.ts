import web3js  from "@solana/web3.js";

export interface Signer {
    sign(txn:web3js.Transaction): any;
}

export interface KeyManager {
    generateKey(): any;
    purgeKey(): any;
    getAddress(): string | null;
    
}