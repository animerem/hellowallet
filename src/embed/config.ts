// config.ts
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Commitment } from '@solana/web3.js';

class coreConfig {
    rpcUrl: string = "https://api.devnet.solana.com ";
    commitment: Commitment = "confirmed";
    keystoreType: string = "local"; //WIP

    constructor() {
        const homeDir = os.homedir();
        const configPath = path.join(homeDir, '.config', 'hellowallet', 'config.json');
        
        if (fs.existsSync(configPath)) {
            const rawConfig = fs.readFileSync(configPath, 'utf-8');
            const fileConfig = JSON.parse(rawConfig);
            Object.assign(this, fileConfig);
        }
    }
}

const config = new coreConfig();
export default config;
