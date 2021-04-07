# HaloDAO Exchange

### Initializing related submodules
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
> git submodule update --remote [reponame]
```

To update or fetch all submodules
```
> git submodule update --remote
```

Note that git will pull the submodules from the branches specified in .gitmodules

## Submodule documentations
### HaloDAO Rewards Smart Contract
[README.md](https://github.com/HaloDAO/halo-rewards/blob/develop/README.md)

### HaloDAO Interface
[README.md](https://github.com/HaloDAO/halodao-interface/blob/develop/README.md)