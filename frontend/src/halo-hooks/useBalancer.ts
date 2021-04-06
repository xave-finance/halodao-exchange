import { BalancerPoolInfo } from 'components/PositionCard/BalancerPoolCard'
import { BALANCER_POOL_URL, BALANCER_SUBGRAPH_URL } from '../constants'
import { useEffect, useState } from 'react'
import { subgraphRequest } from 'utils/balancer'
import { Token } from '@sushiswap/sdk'
import { useActiveWeb3React } from 'hooks'

export const useBalancer = (poolAddresses: string[]) => {
  const { chainId } = useActiveWeb3React()
  const [poolInfo, setPoolInfo] = useState<BalancerPoolInfo[]>([])
  const [poolTokens, setPoolTokens] = useState<Token[]>([])

  /**
   * Fetches pool info from balancer subgraph api everytime the poolAddresses changed
   */
  useEffect(() => {
    console.log('poolAddresses changed!', poolAddresses)
    const fetchPoolInfo = async () => {
      // Convert addresses to lowercase (cause subgraph api is case-sensitive)
      const poolIds = poolAddresses.map(address => address.toLowerCase())

      const query = {
        pools: {
          __args: {
            where: {
              id_in: poolIds
            }
          },
          id: true,
          tokens: {
            symbol: true,
            address: true
          }
        }
      }

      const result = await subgraphRequest(BALANCER_SUBGRAPH_URL, query)

      const currentPoolInfo: BalancerPoolInfo[] = []
      for (const pool of result.pools) {
        currentPoolInfo.push({
          pair: `${pool.tokens[0].symbol}/${pool.tokens[1].symbol}`,
          address: pool.id,
          balancerUrl: `${BALANCER_POOL_URL}${pool.id}`
        })
      }

      setPoolInfo(currentPoolInfo)
    }

    if (poolAddresses.length) {
      fetchPoolInfo()
    } else {
      setPoolInfo([])
    }
  }, [poolAddresses])

  /**
   * Converts BalancerPoolInfo[] to Token[]
   *
   * A Token object will let us reuse uniswap's Token-related hooks which allows us
   * to query balanceOf, totalSupply and other ERC20 methods quite easily
   */
  useEffect(() => {
    if (!chainId || !poolInfo.length) {
      setPoolTokens([])
      return
    }

    const tokens: Token[] = []
    poolInfo.forEach(pool => {
      const token = new Token(chainId, pool.address, 18, 'BPT', `BPT: ${pool.pair}`)
      tokens.push(token)
    })

    setPoolTokens(tokens)
  }, [chainId, poolInfo])

  return { poolInfo, poolTokens }
}
