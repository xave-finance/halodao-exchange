#!/bin/bash
# halodao-interface upstream and origin
cd ./halodao-interface
git remote add upstream git@github.com:HaloDAO/halodao-interface.git
git remote set-url origin $1
git checkout develop

# halodao-rewards upstream and origin
cd ../halodao-rewards
git remote add upstream git@github.com:HaloDAO/halo-rewards.git
git remote set-url origin $2
git checkout develop