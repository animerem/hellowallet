import { Command } from "commander";

export interface KeyManager {

    // Extends CLI commands for specialized key management.
    populateCommands(program: Command): any;
    
    generateKey(): any;
    purgeKey(): any;
    getAddress(): Promise<string | null>;
    
}