import { core } from './embed/core';
import { LocalKeyManager } from './embed/keymanagers/localkeymanager';
import { transfer } from './transfer';
import { Command } from 'commander';

const embeddedWallet = new core(new LocalKeyManager);
const program = new Command();

const ensureKeypairExists = (action: Function) => {
    const keypairAddress = embeddedWallet.keymanager.getAddress();
    if (!keypairAddress) {
        console.log(`No keypair found.`);
        return false;
    }
    action(keypairAddress);
    return true;
};

program
    .name('hellowallet')
    .description('An example CLI for an embedded Solana wallet')
    .version('1.0.0');

program
    .command('transfer-sol')
    .description('Transfer SOL to another account')
    .argument('<receiverAddr>', 'Receiver address')
    .action((receiverAddr) => {
        transfer(receiverAddr);
    });

program
    .command('key-generate')
    .description('Generate a new keypair')
    .action(() => {

        if(embeddedWallet.keymanager.getAddress()){
            console.log(`Keypair already exists. Delete the key before generating a new one.`);
            return;
        }
        
        embeddedWallet.keymanager.generateKey();
        console.log(`New keypair generated for address: ${embeddedWallet.keymanager.getAddress()}`);
    });

program
    .command('key-delete')
    .description('Delete the existing keypair. WARNING: This action is irreversible.')
    .action(() => {
        ensureKeypairExists((keypairAddress: string) => {
            embeddedWallet.keymanager.purgeKey();
            console.log(`Deleted keypair for address: ${keypairAddress}.`);
        });
    });

program
    .command('key-show')
    .description('Show the existing public key address')
    .action(() => {
        ensureKeypairExists((keypairAddress: string) => {
            console.log(`${keypairAddress}`);
        });
    });

program.parse(process.argv);