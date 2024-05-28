// config.ts
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Commitment } from '@solana/web3.js';

export enum KeystoreType {
    Local = "local",
    Ledger = "ledger",
}

class coreConfig {
    rpcUrl: string = "https://api.devnet.solana.com ";
    commitment: Commitment = "confirmed";
    keystoreType: KeystoreType = KeystoreType.Local;

    constructor() {
        this.read();
    }

    private getConfigPath() {
        const homeDir = os.homedir();
        return path.join(homeDir, '.config', 'hellowallet', 'config.json');
    }

    private read() {
        const configPath = this.getConfigPath();
        
        if (fs.existsSync(configPath)) {
            const rawConfig = fs.readFileSync(configPath, 'utf-8');
            const fileConfig = JSON.parse(rawConfig);
            Object.assign(this, fileConfig);
        }
    }

    write() {
        const configPath = this.getConfigPath()
        const configDir = path.dirname(configPath);

        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, {recursive: true});
        }

        fs.writeFileSync(configPath, JSON.stringify(this, null, 2));
    }
}

const config = new coreConfig();
export default config;
