import { Token } from '@sushiswap/sdk'
import { AutoColumn } from 'components/Column'
import { CardSection, DataCard } from 'components/earn/styled'
import { RowBetween } from 'components/Row'
import { transparentize } from 'polished'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from 'theme'
import usePoolsSummary from 'halo-hooks/usePoolsSummary'

const VoteCard = styled(DataCard)`
  background: ${({ theme }) => transparentize(0.5, theme.bg1)};
  border: 1px solid ${({ theme }) => theme.text4};
  overflow: hidden;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`

interface PoolsSummaryProps {
  poolTokens: Token[]
}

const PoolsSummary = ({ poolTokens }: PoolsSummaryProps) => {
  const theme = useContext(ThemeContext)
  const summary = usePoolsSummary(poolTokens)

  return (
    <VoteCard>
      <CardSection>
        <AutoColumn gap="md">
          <RowBetween>
            <TYPE.white fontWeight={600} color={theme.text1}>
              My Stakeable Value
            </TYPE.white>
            <TYPE.white fontWeight={600} color={theme.text1}>
              My Staked Value
            </TYPE.white>
            <TYPE.white fontWeight={600} color={theme.text1}>
              My HALO Earned
            </TYPE.white>
          </RowBetween>
          <RowBetween>
            <TYPE.white fontWeight={600} color={theme.text1}>
              {summary.stakeableValue}
            </TYPE.white>
            <TYPE.white fontWeight={600} color={theme.text1}>
              {summary.stakedValue}
            </TYPE.white>
            <TYPE.white fontWeight={600} color={theme.text1}>
              {summary.haloEarned} HALO
            </TYPE.white>
          </RowBetween>
        </AutoColumn>
      </CardSection>
    </VoteCard>
  )
}

export default PoolsSummary
