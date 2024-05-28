import { core } from './embed/core';
import { ix_Transfer } from './embed/instructionbuilder';
import { LedgerKeyManager } from './embed/keymanagers/ledgerkeymanager';
import { LocalKeyManager } from './embed/keymanagers/localkeymanager';
import { Command } from 'commander';

(async () => {
    //const embeddedWallet = new core(new LocalKeyManager());
    const embeddedWallet = new core(await LedgerKeyManager.createAsync());
    const program = new Command();

    program
        .name('hellowallet')
        .description('An example CLI for an embedded Solana wallet')
        .version('1.0.0');

    program
        .command('transfer-sol')
        .description('Transfer SOL to another account')
        .argument('<receiverAddr>', 'Receiver address')
        .argument('<amount>', 'Lamports to send')
        .action(async (receiverAddr, amount) => {

            const ix = await ix_Transfer(embeddedWallet, receiverAddr, amount);
            const txn = await embeddedWallet.BuildTransaction(ix, await embeddedWallet.keymanager.getPublicKey());
            
            await embeddedWallet.SignTransaction(txn);

            const txId = await embeddedWallet.SendTransaction(txn);

            console.log(`https://explorer.solana.com/tx/${txId}?cluster=devnet`);
        });

    embeddedWallet.keymanager.populateCommands(program); //TODO: Decouple keymanager from CLI.
    program.parse(process.argv);
})();