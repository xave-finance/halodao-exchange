### Halo Rewards Smart Contract
### Quick Start
Install packages
```
> npm i
```

### Running Tests
```
> cd contracts/hardhat
> npx hardhat test
```

### Using dev scripts

- `npm/yarn run test` : for running test scripts usind hardhat
- `npm/yarn run deploy:kovan` : deploy Rewards contract and all its dependencies
- `npm/yarn run deploy:halo-kovan`: use to mint dummy HALO to your wallet. you can change the receiver, HALO token address and number of tokens to mint in ether units
- `npm/yarn run deploy:onlyrewards-kovan` : use to deploy only the rewards contract. change the constructor parameters when necessary

### Output

```
===================Deploying Contracts=====================
collateralERC20 deployed
1000000 DAI minted to 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

lptoken deployed
1000000 LPT minted to 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

ube deployed
1000000 UBE minted to 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

halo token deployed
40000000 HALO minted to 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

halo chest deployed
minter deployed
Rewards Contract deployed

Halo Chest set

Rewards contract set on minter

UBE contract set on minter

Rewards contract approved to transfer 1000000000000000000 LPT of 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

Minter contract approved to transfer 1000000000000000000 DAI of 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

Minter contract approved to transfer 1000000000000000000 UBE of 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

40000000000000000000000000 HALO tokens transfered to rewards contract
1000000000000000000000000 UBE tokens transfered to minter contract
==========================================================


  Check Contract Deployments
    ✓ Collateral ERC20 should be deployed and owner should have initial mint (49ms)
    ✓ Lptoken should be deployed
    ✓ UBE should be deployed
    ✓ HaloToken should be deployed
    ✓ HaloChest should be deployed
    ✓ Rewards Contract should be deployed (79ms)

  When I deposit collateral tokens (DAI) on the Minter dApp, I start to earn HALO rewards.
	When I withdraw DAI, I stop earning HALO rewards
	Sleeping for 5 secs...
	Update Minter Rewards
    ✓ I earn the correct number of HALO tokens per time interval on depositing DAI (5235ms)
	Sleeping for 5 secs...
	Update Minter Rewards
	Pending rewards for user after withdrawing DAI should be 0
    ✓ I stop earning HALO tokens on withdrawing DAI (5182ms)
    ✓ Should have correct amount of HALO token balance

  When I supply liquidity to an AMM, I am able to receive my proportion of HALO rewards.
        When I remove my AMM stake token from the Rewards contract, I stop earning HALO
	Sleeping for 5 secs...
	Update Amm LP pool Rewards
    ✓ I earn the correct number of HALO tokens per time interval on depositing LPT (5182ms)
	Sleeping for 5 secs...
	Update Amm Lp pool Rewards
	Pending rewards for user after withdrawing LPT should be 0
    ✓ I stop earning HALO tokens on withdrawing LPT (5144ms)
    ✓ Should have correct amount of HALO token balance

  I can view my unclaimed HALO tokens on the Minter dApp
	Sleeping for 5 secs...
	Update Minter Rewards...
    ✓ If UBE tokens were minted, display the correct number of HALO tokens rewards (5155ms)
	Sleeping for 5 secs...
	Update Amm Rewards...
    ✓ If LP tokens were deposited, display the correct number of HALO tokens rewards (5110ms)

  Earn vesting rewards by staking HALO inside HaloChest
    ✓ Deposit HALO tokens to HaloChest, receive xHALO (57ms)
    ✓ Send pending vested rewards to HaloChest (52ms)
    ✓ Claim staked HALO + bonus rewards from HaloChest and burn xHALO (62ms)
Current HALO balance in HaloChest:0
Minting 100 HALO to User A...
Minting 100 HALO to User B...
Minting 100 HALO to User C...
100 HALO deposited by User A to HaloChest
	Sleeping for 3 secs...
Releasing vested bonus tokens to HaloChest from Rewards contract
110547675000000000000000
100 HALO deposited by User B to HaloChest
	Sleeping for 3 secs...
Releasing vested bonus tokens to HaloChest from Rewards contract
100 HALO deposited by User C to HaloChest
All users leave HaloChest
Final HALO balances:
User A: 176705.624787895049228933
User B: 138.950212104950110304
User C: 99.999999999999999794
    ✓ HALO earned by User A > HALO earned by User B > HALO earned by User C (454ms)

  As an Admin, I can update AMM LP pool’s allocation points
    ✓ AMM LP allocation points before
    ✓ Total LP allocation points before
    ✓ If caller is not contract owner, it should fail
    ✓ If caller is contract owner, it should not fail; If AMM LP pool is whitelisted it should not fail; Set Amm LP pool allocs
    ✓ AMM LP allocation points before
    ✓ expectedAllocPoints = (totalAllocPoints - currentAllocPoints) + newAllocPoints = 10 - 10 + 5

  As an Admin, I can update minter lp collateral allocation points
    ✓ DAI allocation points before
    ✓ Total Minter LP allocation points before
    ✓ If caller is not contract owner, it should fail
    ✓ If caller is contract owner, it should not fail; If collateral type is whitelisted it should not fail; Set Minter Lp pool allocs
    ✓ DAI LP allocation points before
    ✓ expectedAllocPoints = (totalAllocPoints - currentAllocPoints) + newAllocPoints = 10 - 10 + 5

  As an Admin, I can remove whitelisted AMM LP pool
    ✓ Should be valid amm lp
    ✓ If caller is not contract owner, it should fail
    ✓ If caller is contract owner, it should not fail; If AMM LP pool is whitelisted it should not fail; Remove AMM LP pool from ammLpPools
    ✓ If AMM LP pool is not whitelisted is should fail
    ✓ Should not be valid amm lp

  As an Admin, I can remove whitelisted collateral type
    ✓ Should be valid collateral type
    ✓ If caller is not contract owner, it should fail
    ✓ If caller is contract owner, it should not fail; If Minter collateral type is whitelisted it should not fail; Remove Minter collateral type from minterLpPools (40ms)
    ✓ If collateral type is not whitelisted is should fail
    ✓ Should not be valid collateral type


  40 passing (37s)
```
