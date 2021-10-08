#!/bin/bash

echo Welcome to HaloDAO e2e testing!

echo Starting local node...

# 1. Start local node
npm install
npx hardhat node & # start hardhat node in background
nodePid=$!
sleep 5

# 2. Deploy Rewards contracts
echo Deploying contracts...

cd halodao-rewards
yarn install
yarn deploy:local

# 3. Deploy AMM contracts

# 4. Start frontend & run tests
echo Starting frontend...

cd ../halodao-interface
yarn install
yarn build
yarn integration-test

# 5. Cleanup
kill $nodePid # kill hardhat node

echo e2e testing done!!!