import { KeyManager, Signer } from "./keymanager";
import web3js from "@solana/web3.js";

interface WalletOperations {
    BuildTransaction(ix: web3js.TransactionInstruction[]): any;
    SignTransaction(txn: web3js.Transaction, signer: Signer): any;
    SendTransaction(txn: web3js.Transaction): any;
}

export class core implements WalletOperations {

    readonly keymanager: KeyManager;

    constructor(keymanager: KeyManager) {
        this.keymanager = keymanager;
    }

    BuildTransaction(ix: web3js.TransactionInstruction[]) {
        // Build a transaction using the keymanager.
    }

    SignTransaction(txn: web3js.Transaction, signer: Signer) {
        // Sign a transaction using keymanager.
    }

    SendTransaction(txn: web3js.Transaction) {
        // Send a transaction to the network.
    }
}