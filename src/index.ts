import { core } from "tinywallet/dist/core";
import { ix_Transfer } from "tinywallet/dist/instructionbuilder";
import { Command } from 'commander';

(async () => {
    require('dotenv').config();
    const embeddedWallet = await core.CreateAsync();
    const program = new Command();

    program
        .name('hellowallet')
        .description('An example CLI for an embedded Solana wallet')
        .version('1.0.0');

    program
        .command('get-keystore-type')
        .description('Get the keystore type')
        .action(() => {
            console.log(`${embeddedWallet.GetKeystoreType()}`);
        });

    program
        .command('transfer-lamports')
        .description('Transfer Lamport amounts to another account')
        .argument('<receiverAddr>', 'Receiver address')
        .argument('<amount>', 'Lamports to send')
        .action(async (receiverAddr, amount) => {

            const senderKey = await embeddedWallet.keymanager.getPublicKey();
            const ix = await ix_Transfer(senderKey.toBase58(), receiverAddr, amount);
            const txn = await embeddedWallet.BuildTransaction([ix], senderKey);
            
            await embeddedWallet.SignTransaction(txn);

            const txId = await embeddedWallet.SendTransaction(txn);

            console.log(`https://explorer.solana.com/tx/${txId}?cluster=devnet`);
        });

    program
        .command('show-balance')
        .description('Show the Lamport balance of the wallet')
        .action(async () => {
            const balance = await embeddedWallet.connection.getBalance(await embeddedWallet.keymanager.getPublicKey());
            console.log(`Balance: ${balance} Lamports`);
        });

    program
        .command('key-show')
        .description('Show the existing public key address')
        .action(() => {
            embeddedWallet.keymanager.getAddress()
                .then((keypairAddress: string) => {
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
                    .then((keypairAddress: string) => {
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