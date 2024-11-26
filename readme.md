# Template Wallet 'Hello World'

## Overview
This project is a simple "Hello World" template for a wallet application. It demonstrates the basic setup and functionality of a wallet application using modern web technologies.

## Features
- Basic wallet setup
- Simple transaction handling
- User-friendly interface

## Prerequisites
- Node.js (version 14.0.0 or later)
- npm (version 6.0.0 or later)

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
