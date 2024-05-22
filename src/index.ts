import { generateKeypair } from './keygen';
import { transfer } from './transfer';
import { Command } from 'commander';


const program = new Command();

program
  .name('my-cli')
  .description('An example CLI for TypeScript')
  .version('1.0.0');

program
    .command('transfer')
    .description('Transfer SOL to another account')
    .argument('<receiverAddr>', 'Receiver address')
    .action((receiverAddr) => {
        transfer(receiverAddr);
    });

program
    .command('generate')
    .description('Generate a new keypair')
    .option('-s, --savePath <savePath>', 'Path to save the secret key')
    .action((options) => {
        generateKeypair(options.savePath);
    });

program.parse(process.argv);


