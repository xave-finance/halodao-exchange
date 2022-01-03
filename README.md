# HaloDAO Exchange

## Quick Start

To quickly get started and pull all the codes, simply run the following cmds:

```
> git clone git@github.com:HaloDAO/halodao-exchange.git
> cd halodao-exchange
> git checkout develop
> git submodule init
> git submodule update --remote
```

Contracts are already deployed to testnets and mainnets, so you can just run the frontend app locally, grab the `.env` from 1password and it should work without additional setup or config changes.

Refer to this link for the deployed contract addresses:

https://halodao.atlassian.net/wiki/spaces/HALODAO/pages/1048659/Contract+Addresses

## Submodules

| Submodule | Description | Repo
| --- | --- | --- |
| halodaodao-rewards | Rewards+Vesting contracts, RewardsManager, Protocol Token (RNBW) | https://github.com/HaloDAO/halo-rewards |
| halodaodao-amm | AMM contracts (Curves, Zap, Routers, Assimilators, etc) | https://github.com/HaloDAO/amm-v1 |
| halodaodao-interface | Main frontend app | https://github.com/HaloDAO/halodao-interface |

## Updating submodules

To update all submodules
```
> git submodule update --remote
```

To update a specific submodule
```
> git submodule update --remote [submodule name]
```

*Note that git will pull the submodules from the branches specified in .gitmodules*

## (Optional) "Forking" workflow

**To prevent from accidentally pushing directly to the upstream repo, run the following**
```
> chmod +x ./git-remote-setup.sh
> ./git-remote-setup.sh<space>[your forked halodao-interface url]<space>[your forked halodao-rewards url]<space>[your forked halodao-amm url]
```
`git-remote-setup.sh` script will setup your submodules origin and upstream remote urls

## Documentations

| Submodule |  |
| --------- | ------ |
| halodaodao-rewards | Overview: https://halodao.atlassian.net/wiki/spaces/HALODAO/pages/655635/Rewards+Vesting |
|  | Readme: https://github.com/HaloDAO/halo-rewards/blob/develop/README.md |
| halodaodao-amm | Overview: https://halodao.atlassian.net/wiki/spaces/HALODAO/pages/50790410/DFX+Fork |
|  | Readme: https://github.com/HaloDAO/amm-v1/blob/develop/README.md |
| halodaodao-interface | Readme: https://github.com/HaloDAO/halodao-interface/blob/develop/README.md |