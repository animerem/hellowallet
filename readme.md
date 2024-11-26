# Template Wallet 'Hello World'

## Overview
This project is a simple "Hello World" template for a wallet application. 
It demonstrates the basic usage of the [tinywallet](https://github.com/solana-developers/tinywallet) library and functionality of a wallet CLI application using Typescript.

The `@tinywallet` library requires an `.env` file containing the following configuration settings:

- **API_PUBLIC_KEY** and **API_PRIVATE_KEY**: Used for authenticating API requests.
- **BASE_URL**: The endpoint for the API that the wallet interacts with.
- **ORGANIZATION_ID** and **WALLET_ID**: Identifiers for managing and accessing wallet resources.
- **RPC_URL**: URL of the Solana devnet RPC server for blockchain operations.
- **COMMITMENT**: Defines the level of commitment for transactions and queries.
- **KEYSTORE_TYPE**: Specifies the type of keystore being used.
- **ENV_PRIVATE_KEY**: A private key for managing keys within the application.

These variables ensure secure and effective interaction with the Solana blockchain and associated API services.


## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/kilogold/template-wallet-hello-world.git
   ```
2. Navigate to the project directory:
   ```bash
   cd template-wallet-hello-world
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

4. Create the `.env` file by copying the [`.env.example`](https://github.com/solana-developers/tinywallet/blob/main/.env.example)

## Usage
To start the application, run:

```bash
npx ts-node src/index.ts <command> [options]
```

### Available Commands

- **set-keystore-type**: Set the keystore type.
  - Usage: ``npx ts-node src/index.ts set-keystore-type <type>``
  - Example: ``npx ts-node src/index.ts set-keystore-type ledger``

- **get-keystore-type**: Get the current keystore type.
  - Usage: ``npx ts-node src/index.ts get-keystore-type``

- **transfer-lamports**: Transfer Lamport amounts to another account.
  - Usage: ``npx ts-node src/index.ts transfer-lamports <receiverAddr> <amount>``
  - Example: ``npx ts-node src/index.ts transfer-lamports 46DUbNg6P5LjuYs3KX9VF6QL2rZDJHs1tc7t6Vmc9HXX 100``

- **show-balance**: Show the Lamport balance of the wallet.
  - Usage: ``npx ts-node src/index.ts show-balance``

- **key-show**: Show the existing public key address.
  - Usage: ``npx ts-node src/index.ts key-show``

- **key-generate**: Generate a new keypair.
  - Usage: ``npx ts-node src/index.ts key-generate``

- **key-delete**: Delete the existing keypair. WARNING: This action is irreversible.
  - Usage: ``npx ts-node src/index.ts key-delete``

## Notes
- Ensure that your Ledger device is connected, unlocked, and running the Solana app when using the `ledger` keystore type.
- The application is designed to run on the Solana devnet. You can view transactions on the Solana Explorer using the provided transaction ID.