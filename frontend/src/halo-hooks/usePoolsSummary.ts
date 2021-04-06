import { Token } from '@sushiswap/sdk'
import { HALO_REWARDS_ADDRESS, BALANCER_SUBGRAPH_URL } from '../constants'
import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { useActiveWeb3React } from 'hooks'
import { useEffect, useState } from 'react'
import { useTokenBalances, useTokenTotalSuppliesWithLoadingIndicator } from 'state/wallet/hooks'
import { useContract } from 'sushi-hooks/useContract'
import { subgraphRequest } from 'utils/balancer'
import HALO_REWARDS_ABI from '../constants/haloAbis/Rewards.json'

const usePoolsSummary = (poolTokens: Token[]) => {
  const { account, chainId } = useActiveWeb3React()
  const rewardsContract = useContract(chainId ? HALO_REWARDS_ADDRESS[chainId] : undefined, HALO_REWARDS_ABI)

  const [summary, setSummary] = useState({
    stakeableValue: '$ --',
    stakedValue: '$ --',
    haloEarned: '--'
  })

  // Get user balance for each pool token
  const balances = useTokenBalances(account ?? undefined, poolTokens)

  // Get totalSupply of each pool token
  const totalSupplies = useTokenTotalSuppliesWithLoadingIndicator(poolTokens)[0]

  useEffect(() => {
    if (
      !chainId ||
      !account ||
      !rewardsContract ||
      !poolTokens.length ||
      !Object.keys(balances).length ||
      !Object.keys(totalSupplies).length
    ) {
      return
    }

    const getPoolSummary = async () => {
      let totalStakeableValue = 0
      let totalStakedValue = 0
      const claimedHalo: BigNumber = await rewardsContract.getTotalRewardsClaimedByUser(account)

      for (const pool of poolTokens) {
        // Get unclaimed HALO earned per pool (then add to total HALO earnings)
        const unclaimedHalo: BigNumber = await rewardsContract.getUnclaimedPoolRewardsByUserByPool(
          pool.address,
          account
        )
        claimedHalo.add(unclaimedHalo)

        // Get BPT price per pool
        // (this is required to calculate both stakeable & staked value)
        // formula: liquidity / totalSupply
        const query = {
          pool: {
            __args: {
              id: pool.address.toLowerCase()
            },
            id: true,
            liquidity: true
          }
        }
        const result = await subgraphRequest(BALANCER_SUBGRAPH_URL, query)
        const liquidity = parseFloat(result.pool.liquidity)
        const totalSupplyAmount = totalSupplies[pool.address]
        const totalSupply = totalSupplyAmount ? parseFloat(formatEther(`${totalSupplyAmount.raw}`)) : 0
        const bptPrice = totalSupply > 0 ? liquidity / totalSupply : 0

        // Get BPT stakeable value per pool (BPT price * BPT balance)
        const poolBalanceAmount = balances[pool.address]
        const poolBalance = poolBalanceAmount ? parseFloat(formatEther(`${poolBalanceAmount.raw}`)) : 0
        const stakeableValue = poolBalance * bptPrice
        totalStakeableValue += stakeableValue

        // Get BPT staked value per pool (BPT price * BPT staked)
        const staked: BigNumber = await rewardsContract.getDepositedPoolTokenBalanceByUser(pool.address, account)
        const stakedValue = parseFloat(formatEther(`${staked}`)) * bptPrice
        totalStakedValue += stakedValue
      }

      setSummary({
        stakeableValue: `$ ${totalStakeableValue.toFixed(4)}`,
        stakedValue: `$ ${totalStakedValue.toFixed(4)}`,
        haloEarned: formatEther(claimedHalo)
      })
    }

    getPoolSummary()
  }, [chainId, rewardsContract, account, poolTokens, balances, totalSupplies])

  return summary
}

export default usePoolsSummary
