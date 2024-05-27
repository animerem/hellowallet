import { core } from './embed/core';
import { LedgerKeyManager } from './embed/keymanagers/ledgerkeymanager';
import { LocalKeyManager } from './embed/keymanagers/localkeymanager';
import { transfer } from './transfer';
import { Command } from 'commander';

(async () => {
    const embeddedWallet = new core(await LedgerKeyManager.createAsync());
    const program = new Command();

    async function ensureKeypairExists(action: Function) {
        embeddedWallet.keymanager.getAddress()
            .then((keypairAddress) => {
                action(keypairAddress);
            })
            .catch(() => {
                console.log(`No keypair exists. Generate a new keypair.`);
            });
    };

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

    program
        .command('key-generate')
        .description('Generate a new keypair')
        .action(() => {
            embeddedWallet.keymanager.getAddress()
                .then(() => {
                    console.log(`Keypair already exists. Delete the key before generating a new one.`);
                })
                .catch(async () => {
                    embeddedWallet.keymanager.generateKey();
                    console.log(`New keypair generated for address: ${await embeddedWallet.keymanager.getAddress()}`);
                });
        });

    program
        .command('key-delete')
        .description('Delete the existing keypair. WARNING: This action is irreversible.')
        .action(async () => {
            ensureKeypairExists((keypairAddress: string) => {
                embeddedWallet.keymanager.purgeKey();
                console.log(`Deleted keypair for address: ${keypairAddress}.`);
            });
        });

    program
        .command('key-show')
        .description('Show the existing public key address')
        .action(async () => {
            ensureKeypairExists((keypairAddress: string) => {
                console.log(`${keypairAddress}`);
            });
        });

    program.parse(process.argv);
})();