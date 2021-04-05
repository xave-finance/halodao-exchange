const { expect } = require("chai");
const { BigNumber, Contract } = require('ethers');
const { ethers } = require('hardhat');
const mathUtil = require('./utils/math');

let rewardsContract
let collateralERC20Contract
let lpTokenContract
let lpTokenContract2
let minterContract
let ubeContract
let haloTokenContract
let haloChestContract
let genesisTs
let epochLength
let owner
let addr1
let addr2
let addrs
let expectedPerSecondHALOReward

const DECIMALS = 10**18
const basisPoints = 10**4
const INITIAL_MINT = 10**6

const sleepTime = 5

before(async () => {

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    console.log("===================Deploying Contracts=====================");
    const CollateralERC20 = await ethers.getContractFactory("CollateralERC20");
    collateralERC20Contract = await CollateralERC20.deploy("collateral ERC20", "collateral ERC20");
    await collateralERC20Contract.deployed();
    console.log("collateralERC20 deployed");

    await collateralERC20Contract.mint(owner.address, ethers.utils.parseEther(INITIAL_MINT.toString()));
    console.log(INITIAL_MINT.toString() + " collateral ERC20 minted to " + owner.address);
    console.log();

    const LpToken = await ethers.getContractFactory("LpToken");
    lpTokenContract = await LpToken.deploy("LpToken", "LPT");
    lpTokenContract2 = await LpToken.deploy("LpToken 2", "LPT");
    await lpTokenContract.deployed();
    await lpTokenContract2.deployed();
    console.log("lptoken deployed");

    await lpTokenContract.mint(owner.address, ethers.utils.parseEther(INITIAL_MINT.toString()));
    await lpTokenContract2.mint(owner.address, ethers.utils.parseEther(INITIAL_MINT.toString()));
    console.log(INITIAL_MINT.toString() + " LPT minted to " + owner.address);
    console.log();

    const UBE = await ethers.getContractFactory("UBE");
    ubeContract = await UBE.deploy("UBE", "UBE");
    await ubeContract.deployed();
    console.log("ube deployed");

    await ubeContract.mint(owner.address, ethers.utils.parseEther(INITIAL_MINT.toString()));
    console.log(INITIAL_MINT.toString() + " UBE minted to " + owner.address);
    console.log();

    const HaloTokenContract = await ethers.getContractFactory("HaloToken");
    haloTokenContract = await HaloTokenContract.deploy("Halo", "HALO");
    await haloTokenContract.deployed();
    console.log("halo token deployed");

    await haloTokenContract.mint(owner.address, ethers.utils.parseEther((40*INITIAL_MINT).toString()));
    console.log((40*INITIAL_MINT).toString() + " HALO minted to " + owner.address);
    console.log();

    const HaloChestContract = await ethers.getContractFactory("HaloChest");
    haloChestContract = await HaloChestContract.deploy(haloTokenContract.address);
    await haloChestContract.deployed();
    console.log("halo chest deployed");

    const MinterContract = await ethers.getContractFactory("Minter");
    minterContract = await MinterContract.deploy();
    await minterContract.deployed();
    console.log("minter deployed");

    const RewardsContract = await ethers.getContractFactory("Rewards");
    const startingRewards = ethers.utils.parseEther('7500000');
    const decayBase = ethers.utils.parseEther('0.813');

    epochLength = 2629800
    // epochLength = 60
    const minterLpRewardsRatio = 0.4*basisPoints
    const ammLpRewardsRatio = 0.4*basisPoints
    const vestingRewardsRatio = 0.2 * basisPoints

    // right now we can keep expectedPerSecondHALOReward the same for minterLpRewardsRatio and ammLpRewardsRatio related tests
    expectedPerSecondHALOReward = parseFloat(ethers.utils.formatEther(startingRewards)) / epochLength * 0.4
    console.log('expectedPerSecondHALOReward: ', expectedPerSecondHALOReward)
    genesisTs = Math.floor(Date.now() / 1000);
    const minterLpPools = [[collateralERC20Contract.address, 10]]
    const ammLpPools = [[lpTokenContract.address, 10]]

    rewardsContract = await RewardsContract.deploy(
        haloTokenContract.address,
        startingRewards,
        decayBase, //multiplied by 10^18
        epochLength,
        minterLpRewardsRatio, //in bps, multiplied by 10^4
        ammLpRewardsRatio, //in bps, multiplied by 10^4
        vestingRewardsRatio, //in bps, multiplied by 10^4
        minterContract.address,
        genesisTs,
        minterLpPools,
        ammLpPools
    )
    await rewardsContract.deployed();
    console.log("Rewards Contract deployed");
    console.log();

    await rewardsContract.setHaloChest(haloChestContract.address);
    console.log("Halo Chest set");
    console.log();

    await minterContract.setRewardsContract(rewardsContract.address);
    console.log("Rewards contract set on minter");
    console.log();

    await minterContract.setPhmContract(ubeContract.address);
    console.log("UBE contract set on minter");
    console.log();

    await lpTokenContract.approve(rewardsContract.address, ethers.utils.parseEther(INITIAL_MINT.toString()));
    console.log("Rewards contract approved to transfer "+DECIMALS.toString()+ " LPT of "+owner.address);
    console.log();

    await collateralERC20Contract.approve(minterContract.address, ethers.utils.parseEther(INITIAL_MINT.toString()));
    console.log("Minter contract approved to transfer "+DECIMALS.toString()+ " collateral ERC20 of "+owner.address);
    console.log();

    await ubeContract.approve(minterContract.address, ethers.utils.parseEther(INITIAL_MINT.toString()));
    console.log("Minter contract approved to transfer "+DECIMALS.toString()+ " UBE of "+owner.address);
    console.log();

    const ownerHaloBalance = await haloTokenContract.balanceOf(owner.address);
    await haloTokenContract.transfer(rewardsContract.address, ownerHaloBalance);
    console.log(ownerHaloBalance.toString() + " HALO tokens transfered to rewards contract");

    const ownerUbeBalance = await ubeContract.balanceOf(owner.address);
    await ubeContract.transfer(minterContract.address, ownerUbeBalance);
    console.log(ownerUbeBalance.toString() + " UBE tokens transfered to minter contract");
    console.log("==========================================================\n\n")
})

describe("Check Contract Deployments", function() {
    it("Collateral ERC20 should be deployed and owner should have initial mint", async() => {
        expect(await collateralERC20Contract.symbol()).to.equal("collateral ERC20");
        expect(await collateralERC20Contract.name()).to.equal("collateral ERC20");
        expect(await collateralERC20Contract.balanceOf(owner.address)).to.equal(ethers.utils.parseEther(INITIAL_MINT.toString()));
    })
    it("Lptoken should be deployed", async() => {
        expect(await lpTokenContract.symbol()).to.equal("LPT");
        expect(await lpTokenContract.name()).to.equal("LpToken");
    })
    it("Lptoken2 should be deployed", async() => {
        expect(await lpTokenContract2.symbol()).to.equal("LPT");
        expect(await lpTokenContract2.name()).to.equal("LpToken 2");
    })
    it("UBE should be deployed", async() => {
        expect(await ubeContract.symbol()).to.equal("UBE");
        expect(await ubeContract.name()).to.equal("UBE");
    })
    it("HaloToken should be deployed", async() => {
        expect(await haloTokenContract.symbol()).to.equal("HALO");
        expect(await haloTokenContract.name()).to.equal("Halo");
    })
    it("HaloChest should be deployed", async() => {
        expect(await haloChestContract.symbol()).to.equal("HALOHALO");
        expect(await haloChestContract.name()).to.equal("HaloChest");
    })
    it("Rewards Contract should be deployed", async() => {
        expect(await rewardsContract.getTotalPoolAllocationPoints()).to.equal(10);
        expect(await rewardsContract.getTotalMinterLpAllocationPoints()).to.equal(10);
        expect(await rewardsContract.isValidAmmLp(lpTokenContract.address)).to.equal(true);
        expect(await rewardsContract.isValidAmmLp(collateralERC20Contract.address)).to.equal(false);
        expect(await rewardsContract.isValidMinterLp(collateralERC20Contract.address)).to.equal(true);
        expect(await rewardsContract.isValidMinterLp(lpTokenContract.address)).to.equal(false);
    })

})

describe("When I deposit collateral ERC20 on the Minter dApp, I start to earn HALO rewards.\n\tWhen I withdraw collateral ERC20, I stop earning HALO rewards", function() {
    let depositTxTs = 0
    let withdrawalTxTs = 0

    it("I earn the correct number of HALO tokens per time interval on depositing collateral ERC20", async() => {

        await expect(minterContract.depositByCollateralAddress(
            ethers.utils.parseEther('100'),
            ethers.utils.parseEther('100'),
            collateralERC20Contract.address
        )).to.not.be.reverted;

        depositTxTs = (await ethers.provider.getBlock()).timestamp;

        await mathUtil.sleep(sleepTime);
        console.log('\t Done sleeping. Updating Minter Rewards')

        // this function needs to be called so that rewards state is updated and then becomes claimable
        await rewardsContract.updateMinterRewardPool(collateralERC20Contract.address)
        let updateTxTs = (await ethers.provider.getBlock()).timestamp

        // now check unclaimed HALO reward balance after sleep
        const actualUnclaimedHaloRewardBal = mathUtil.formatEtherRoundTo2Decimals(await rewardsContract.getUnclaimedMinterLpRewardsByUser(collateralERC20Contract.address, owner.address))

        // calculate expected HALO rewards balance
        const expectedUnclaimedHaloRewardsBal = mathUtil.roundTo2Decimals((updateTxTs - depositTxTs) * expectedPerSecondHALOReward)
        
        // assert that expected and actual are equal
        expect(actualUnclaimedHaloRewardBal).to.equal(expectedUnclaimedHaloRewardsBal)
    })

    it("I stop earning HALO tokens on withdrawing collateral ERC20", async () => {
        
        // withdraw all collateral from Minter
        await expect(minterContract.redeemByCollateralAddress(
            ethers.utils.parseEther('100'),
            ethers.utils.parseEther('100'),
            collateralERC20Contract.address
        )).to.not.be.reverted;

        withdrawalTxTs = (await ethers.provider.getBlock()).timestamp;

        await mathUtil.sleep(sleepTime);
        console.log('\t Done sleeping. Updating Minter Rewards')

        await rewardsContract.updateMinterRewardPool(collateralERC20Contract.address);
        let updateTxTs = (await ethers.provider.getBlock()).timestamp;

        // now check unclaimed HALO reward balance after sleep
        console.log("\tUnclaimed rewards for user after withdrawing collateral should be 0");

        // get unclaimed rewards
        await rewardsContract.getUnclaimedMinterLpRewardsByUser(collateralERC20Contract.address, owner.address);
        // get unclaimed rewards again
        const unclaimedMinterLpRewards2ndAttempt = await rewardsContract.getUnclaimedMinterLpRewardsByUser(collateralERC20Contract.address, owner.address);
        
        // calculate actual HALO rewards balance
        const actualUnclaimedHaloRewardBal = mathUtil.formatEtherRoundTo2Decimals(unclaimedMinterLpRewards2ndAttempt)

        // calculate expected HALO rewards balance
        const expectedUnclaimedHaloRewardsBal = mathUtil.roundTo2Decimals(0)
        
        // assert that expected and actual are equal
        expect(actualUnclaimedHaloRewardBal).to.equal(expectedUnclaimedHaloRewardsBal)
    })

    it("Should have correct amount of HALO token balance", async () => {
        const actualHaloBal = mathUtil.formatEtherRoundTo2Decimals(await haloTokenContract.balanceOf(owner.address))
        const expectedHaloBal = mathUtil.roundTo2Decimals((withdrawalTxTs - depositTxTs - 1) * expectedPerSecondHALOReward)
        expect(actualHaloBal).to.equal(expectedHaloBal);
    })

})

describe("When I supply liquidity to an AMM, I am able to receive my proportion of HALO rewards. When I remove my AMM stake token from the Rewards contract, I stop earning HALO", function() {
    let depositTxTs;
    let withdrawalTxTs;
    let haloBal;

    it("I earn the correct number of HALO tokens per time interval on depositing LPT", async() => {
        
        haloBal = parseFloat(ethers.utils.formatEther(await haloTokenContract.balanceOf(owner.address)))

        // deposit LP tokens to Rewards contract
        await expect(rewardsContract.depositPoolTokens(
            lpTokenContract.address,
            ethers.utils.parseEther('100')
        )).to.not.be.reverted;

        // get deposit timestamp
        depositTxTs = (await ethers.provider.getBlock()).timestamp;

        await mathUtil.sleep(sleepTime);
        console.log('\t Done sleeping. Updating AMM LP pool Rewards')

        await rewardsContract.updateAmmRewardPool(lpTokenContract.address);
        let updateTxTs = (await ethers.provider.getBlock()).timestamp;

        const actualUnclaimedHaloPoolRewards =
            mathUtil.formatEtherRoundTo2Decimals(await rewardsContract.getUnclaimedPoolRewardsByUserByPool(lpTokenContract.address, owner.address))

        const expectedUnclaimedHaloPoolRewards = mathUtil.roundTo2Decimals((updateTxTs-depositTxTs)*expectedPerSecondHALOReward)

        expect(actualUnclaimedHaloPoolRewards).to.equal(expectedUnclaimedHaloPoolRewards);
    })

    it("I stop earning HALO tokens on withdrawing LPT", async() => {

        await expect(rewardsContract.withdrawPoolTokens(
            lpTokenContract.address,
            ethers.utils.parseEther('100')
        )).to.not.be.reverted;

        withdrawalTxTs = (await ethers.provider.getBlock()).timestamp;

        await mathUtil.sleep(sleepTime);
        console.log("\tUpdate Amm Lp pool Rewards")

        await rewardsContract.updateAmmRewardPool(lpTokenContract.address);
        (await ethers.provider.getBlock()).timestamp;

        console.log("\tUnclaimed rewards for user after withdrawing LPT should be 0");

        const actualUnclaimedHaloPoolRewards =
            mathUtil.formatEtherRoundTo2Decimals(await rewardsContract.getUnclaimedPoolRewardsByUserByPool(lpTokenContract.address, owner.address))

        const expectedUnclaimedHaloPoolRewards = mathUtil.roundTo2Decimals(0)

        expect(actualUnclaimedHaloPoolRewards).to.equal(expectedUnclaimedHaloPoolRewards);
    })

    it("Should have correct amount of HALO token balance", async () => {
        const actualHaloBal = mathUtil.formatEtherRoundTo2Decimals(await haloTokenContract.balanceOf(owner.address))
        const expectedBal = mathUtil.roundTo2Decimals((withdrawalTxTs - depositTxTs) * expectedPerSecondHALOReward + haloBal)
        expect(actualHaloBal).to.equal(expectedBal);
    })

})

describe("Earn vesting rewards by staking HALO inside HaloChest", function() {
    let ownerHaloBal
    it("Deposit HALO tokens to HaloChest, receive xHALO", async() => {
        ownerHaloBal = await haloTokenContract.balanceOf(owner.address);
        await haloTokenContract.approve(haloChestContract.address, ownerHaloBal);
        await expect(haloChestContract.enter(
            ownerHaloBal
        )).to.not.be.reverted;
    })

    it("Send unclaimed vested rewards to HaloChest", async() => {
        await rewardsContract.getUnclaimedVestingRewards();
        await expect(rewardsContract.releaseVestedRewards()).to.not.be.reverted;
    })

    it("Claim staked HALO + bonus rewards from HaloChest and burn xHALO", async() => {
        const haloInHaloChest = await haloTokenContract.balanceOf(haloChestContract.address);

        const ownerXHalo = await haloChestContract.balanceOf(owner.address);
        await haloChestContract.leave(ownerXHalo);

        expect(await haloTokenContract.balanceOf(owner.address)).to.equal(haloInHaloChest);
    })

    it("HALO earned by User A > HALO earned by User B > HALO earned by User C", async () => {
        const newSleepTime = 3;

        console.log("Current HALO balance in HaloChest:" +
        ethers.utils.parseEther((await haloTokenContract.balanceOf(haloChestContract.address)).toString()));
        console.log("Minting 100 HALO to User A...");
        await haloTokenContract.mint(addrs[0].address, ethers.utils.parseEther('100'));
        console.log("Minting 100 HALO to User B...");
        await haloTokenContract.mint(addrs[1].address, ethers.utils.parseEther('100'));
        console.log("Minting 100 HALO to User C...");
        await haloTokenContract.mint(addrs[2].address, ethers.utils.parseEther('100'));

        console.log("100 HALO deposited by User A to HaloChest");
        await haloTokenContract.connect(addrs[0]).approve(haloChestContract.address, ethers.utils.parseEther('100'));
        await haloChestContract.connect(addrs[0]).enter(ethers.utils.parseEther('100'));

        mathUtil.sleep(newSleepTime);

        console.log("Releasing vested bonus tokens to HaloChest from Rewards contract");
        const currVestedHalo = (await rewardsContract.getUnclaimedVestingRewards()).toString();
        console.log(currVestedHalo);
        await rewardsContract.releaseVestedRewards();

        console.log("100 HALO deposited by User B to HaloChest");
        await haloTokenContract.connect(addrs[1]).approve(haloChestContract.address, ethers.utils.parseEther('100'));
        await haloChestContract.connect(addrs[1]).enter(ethers.utils.parseEther('100'));

        mathUtil.sleep(newSleepTime);

        console.log("Releasing vested bonus tokens to HaloChest from Rewards contract");
        await rewardsContract.releaseVestedRewards();

        console.log("100 HALO deposited by User C to HaloChest");
        await haloTokenContract.connect(addrs[2]).approve(haloChestContract.address, ethers.utils.parseEther('100'));
        await haloChestContract.connect(addrs[2]).enter(ethers.utils.parseEther('100'));
        console.log("All users leave HaloChest");

        await haloChestContract.connect(addrs[0]).leave(await haloChestContract.balanceOf(addrs[0].address));
        await haloChestContract.connect(addrs[1]).leave(await haloChestContract.balanceOf(addrs[1].address));
        await haloChestContract.connect(addrs[2]).leave(await haloChestContract.balanceOf(addrs[2].address));

        console.log("Final HALO balances:")
        console.log("User A: " + ethers.utils.formatEther(await haloTokenContract.balanceOf(addrs[0].address)));
        console.log("User B: " + ethers.utils.formatEther(await haloTokenContract.balanceOf(addrs[1].address)));
        console.log("User C: " + ethers.utils.formatEther(await haloTokenContract.balanceOf(addrs[2].address)));

    })
})



describe("As an Admin, I can update AMM LP pool’s allocation points", function () {
    const maxAllocationPoints = 10

    it("AMM LP allocation points before", async() => {
        expect((await rewardsContract.getAmmLpPoolInfo(lpTokenContract.address)).allocPoint.toString()).to.equal('10');
    })
    it("Total LP allocation points before", async() => {
        expect(await rewardsContract.getTotalPoolAllocationPoints()).to.equal(maxAllocationPoints);
    })
    it("If caller is not contract owner, it should fail", async() => {
        await expect(rewardsContract.connect(addr1).setAmmLpAllocationPoints(lpTokenContract.address, 5)).to.be.revertedWith('Ownable: caller is not the owner');
    })
    it("If caller is contract owner, it should not fail; If AMM LP pool is whitelisted it should not fail; Set Amm LP pool allocs", async() => {
        await expect(rewardsContract.connect(owner).setAmmLpAllocationPoints(lpTokenContract.address, 5)).to.not.be.reverted;
    })
    it("AMM LP allocation points before", async() => {
        expect((await rewardsContract.getAmmLpPoolInfo(lpTokenContract.address)).allocPoint.toString()).to.equal('5');
    })
    it("expectedAllocPoints = (totalAllocPoints - currentAllocPoints) + newAllocPoints = 10 - 10 + 5", async() => {
        expect(await rewardsContract.getTotalPoolAllocationPoints()).to.equal(5);
    })
})

describe("As an Admin, I can update minter lp collateral allocation points", function() {
    it("collateral ERC20 allocation points before", async() => {
        expect((await rewardsContract.getMinterLpPoolInfo(collateralERC20Contract.address)).allocPoint.toString()).to.equal('10');
    })
    it("Total Minter LP allocation points before", async() => {
        expect(await rewardsContract.getTotalMinterLpAllocationPoints()).to.equal(10);
    })
    it("If caller is not contract owner, it should fail", async() => {
        await expect(rewardsContract.connect(addr1).setMinterLpAllocationPoints(collateralERC20Contract.address, 5)).to.be.revertedWith('Ownable: caller is not the owner');
    })
    it("If caller is contract owner, it should not fail; If collateral type is whitelisted it should not fail; Set Minter Lp pool allocs", async() => {
        await expect(rewardsContract.connect(owner).setMinterLpAllocationPoints(collateralERC20Contract.address, 5)).to.not.be.reverted;
    })
    it("collateral ERC20 LP allocation points before", async() => {
        expect((await rewardsContract.getMinterLpPoolInfo(collateralERC20Contract.address)).allocPoint.toString()).to.equal('5');
    })
    it("expectedAllocPoints = (totalAllocPoints - currentAllocPoints) + newAllocPoints = 10 - 10 + 5", async() => {
        expect(await rewardsContract.getTotalMinterLpAllocationPoints()).to.equal(5);
    })
})

describe("As an Admin, I can remove whitelisted AMM LP pool", function() {
    it("Should be valid amm lp", async() => {
        expect(await rewardsContract.isValidAmmLp(lpTokenContract.address)).to.equal(true);
    })
    it("If caller is not contract owner, it should fail", async() => {
        await expect(rewardsContract.connect(addr1).removeAmmLp(lpTokenContract.address)).to.be.revertedWith('Ownable: caller is not the owner');
    })
    it("If caller is contract owner, it should not fail; If AMM LP pool is whitelisted it should not fail; Remove AMM LP pool from ammLpPools", async() => {
        await expect(rewardsContract.connect(owner).removeAmmLp(lpTokenContract.address)).to.not.be.reverted;
    })
    it("If AMM LP pool is not whitelisted is should fail", async() => {
        await expect(rewardsContract.connect(owner).removeAmmLp(lpTokenContract.address)).to.be.revertedWith('AMM LP Pool not whitelisted');
    })
    it("Should not be valid amm lp", async() => {
        expect(await rewardsContract.isValidAmmLp(lpTokenContract.address)).to.equal(false);
    })
})

describe("As an Admin, I can remove whitelisted collateral type", function() {
    it("Should be valid collateral type", async() => {
        expect(await rewardsContract.isValidMinterLp(collateralERC20Contract.address)).to.equal(true);
    })
    it("If caller is not contract owner, it should fail", async() => {
        await expect(rewardsContract.connect(addr1).removeMinterCollateralType(collateralERC20Contract.address)).to.be.revertedWith('Ownable: caller is not the owner');
    })
    it("If caller is contract owner, it should not fail; If Minter collateral type is whitelisted it should not fail; Remove Minter collateral type from minterLpPools", async() => {
        await expect(rewardsContract.connect(owner).removeMinterCollateralType(collateralERC20Contract.address)).to.not.be.reverted;
    })
    it("If collateral type is not whitelisted is should fail", async() => {
        await expect(rewardsContract.connect(owner).removeMinterCollateralType(collateralERC20Contract.address)).to.be.revertedWith('Collateral type not whitelisted');
    })
    it("Should not be valid collateral type", async() => {
        expect(await rewardsContract.isValidMinterLp(collateralERC20Contract.address)).to.equal(false);
    })
})

describe('AMM dApp should be able to query some info from the Rewards contract', () => {
    it('getWhitelistedAMMPoolAddresses() should return all AMM LP addresses', async () => {
        const addresses = await rewardsContract.getWhitelistedAMMPoolAddresses()
        const expectedAddresses = [] // we removed all addreses in line 473 so this is blank initially
        expect(addresses).to.have.all.members(expectedAddresses)
    })

    it('getWhitelistedAMMPoolAddresses() should return updated AMM LP addresses after adding a new address', async () => {
        await rewardsContract.addAmmLp(lpTokenContract.address, 10)
        await rewardsContract.addAmmLp(lpTokenContract2.address, 10)

        const addresses = await rewardsContract.getWhitelistedAMMPoolAddresses()
        const expectedAddresses = [lpTokenContract.address, lpTokenContract2.address]
        expect(addresses).to.have.all.members(expectedAddresses)
    })

    it('getWhitelistedAMMPoolAddresses() should return updated AMM LP addresses after removing an address', async () => {
        await rewardsContract.removeAmmLp(lpTokenContract.address)

        const addresses = await rewardsContract.getWhitelistedAMMPoolAddresses()
        const expectedAddresses = [lpTokenContract2.address]
        expect(addresses).to.have.all.members(expectedAddresses)
    })
})