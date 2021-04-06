import { HALO_REWARDS_ADDRESS } from '../constants'
import { useActiveWeb3React } from 'hooks'
import { useContract } from 'hooks/useContract'
import { useEffect, useState } from 'react'
import HALO_REWARDS_ABI from '../constants/haloAbis/Rewards.json'

export const useRewards = () => {
  const { chainId } = useActiveWeb3React()
  const rewardsContract = useContract(chainId ? HALO_REWARDS_ADDRESS[chainId] : undefined, HALO_REWARDS_ABI)
  const [poolAddresses, setPoolAddresses] = useState<string[]>([])

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!rewardsContract) return
      try {
        const addresses = await rewardsContract.getWhitelistedAMMPoolAddresses()
        setPoolAddresses(addresses)
      } catch (err) {
        console.error('Error fetching AMM pools: ', err)
      }
    }

    if (rewardsContract) {
      fetchAddresses()
    } else {
      setPoolAddresses([])
    }
  }, [rewardsContract])

  return { poolAddresses }
}
