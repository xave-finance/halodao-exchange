# HaloDAO Exchange

### Initialize related submodules
```
> git clone git@github.com:HaloDAO/halodao-exchange.git
> cd halodao-exchange
> git checkout develop
```

You will see .gitmodules and empty directories of the submodules

To initiate the submodules
```
> git submodule init
```
This won't do anything yet except register tha paths of the submodules

### Update or fetch submodule files

To update or fetch a specific submodule
```
> git submodule update --remote [submodule name]
```

To update or fetch all submodules
```
> git submodule update --remote
```
*Note that git will pull the submodules from the branches specified in .gitmodules*

**To prevent from accidentally pushing directly to the upstream repo, run the following**

**PLEASE NOTE THAT `submodule set-url` WILL ONLY WORK ON Git 2.25 and up**
https://stackoverflow.com/a/59364554
```
> git submodule set-url halodao-interface [your halodao-interface forked repo]
> git submodule set-url halodao-rewards [your halodao-interface forked repo]
```
If successful, `.gitmodules` and submodules' origin remote urls will be changed to your forked repo

**DO NOT** commit `.gitmodules` because the changes is only for your local development

## Submodule documentations
### HaloDAO Rewards Smart Contract
[README.md](https://github.com/HaloDAO/halo-rewards/blob/develop/README.md)

Run rewards from the root directory
```
> yarn install-rewards
> yarn test-rewards
```

### HaloDAO Interface
[README.md](https://github.com/HaloDAO/halodao-interface/blob/develop/README.md)

Run interface from the root directory
```
> yarn install-interface
> yarn start-interface
```
