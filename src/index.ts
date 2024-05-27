import { core } from './embed/core';
import { LedgerKeyManager } from './embed/keymanagers/ledgerkeymanager';
import { LocalKeyManager } from './embed/keymanagers/localkeymanager';
import { transfer } from './transfer';
import { Command } from 'commander';

(async () => {
    const embeddedWallet = new core(new LocalKeyManager());
    //const embeddedWallet = new core(await LedgerKeyManager.createAsync());
    const program = new Command();

    program
        .name('hellowallet')
        .description('An example CLI for an embedded Solana wallet')
        .version('1.0.0');

    program
        .command('transfer-sol')
        .description('Transfer SOL to another account')
        .argument('<receiverAddr>', 'Receiver address')
        .action(async (receiverAddr) => {
            transfer(receiverAddr);
        });

    embeddedWallet.keymanager.populateCommands(program);
    program.parse(process.argv);
})();