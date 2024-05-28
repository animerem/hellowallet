import { core } from './embed/core';
import { ix_Transfer } from './embed/instructionbuilder';
import { Command } from 'commander';

(async () => {
    const embeddedWallet = await core.CreateAsync();
    const program = new Command();

    program
        .name('hellowallet')
        .description('An example CLI for an embedded Solana wallet')
        .version('1.0.0');

    program
        .command('set-keystore-type')
        .description('Set the keystore type')
        .argument('<type>', 'Keystore types: ledger, local')
        .action((type) => {
            embeddedWallet.SetKeystoreType(type);
            console.log(`Keystore type set to: ${type}`);
        });

    program
        .command('get-keystore-type')
        .description('Get the keystore type')
        .action(() => {
            console.log(`${embeddedWallet.GetKeystoreType()}`);
        });

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
    
    program
        .command('key-show')
        .description('Show the existing public key address')
        .action(() => {
            embeddedWallet.keymanager.getAddress()
                .then((keypairAddress) => {
                    console.log(`${keypairAddress}`);
                })
                .catch(() => {
                    switch (embeddedWallet.GetKeystoreType()) {
                        case 'ledger':
                            console.log(`Cannot access Ledger device.\nPlease ensure it is connected, unlocked, and running the Solana app.`);
                            break;
                        default:
                            console.log(`No keypair exists. Generate a new keypair.`);
                            break;
                    }
                });
        });

    if (embeddedWallet.keymanager.generateKey) {   
        program
            .command('key-generate')
            .description('Generate a new keypair')
            .action(() => {
                embeddedWallet.keymanager.getAddress()
                    .then(() => {
                        console.log(`Keypair already exists. Delete the key before generating a new one.`);
                    })
                    .catch(async () => {
                        embeddedWallet.keymanager.generateKey!();
                        console.log(`New keypair generated for address: ${await embeddedWallet.keymanager.getAddress()}`);
                    });
            });
    }

    if (embeddedWallet.keymanager.purgeKey) {
        program
            .command('key-delete')
            .description('Delete the existing keypair. WARNING: This action is irreversible.')
            .action(async () => {
                embeddedWallet.keymanager.getAddress()
                    .then((keypairAddress) => {
                        embeddedWallet.keymanager.purgeKey!();
                        console.log(`Deleted keypair for address: ${keypairAddress}.`);
                    })
                    .catch(() => {
                        console.log(`No keypair exists. Generate a new keypair.`);
                    });
            });
    }

    program.parse(process.argv);
})();