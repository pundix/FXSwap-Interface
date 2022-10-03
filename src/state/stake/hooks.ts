import { ChainId, Token, CurrencyAmount, WETH9 } from '@fx-swap/sdk-core'
import { Pair } from '@fx-swap/v2-sdk'
import JSBI from 'jsbi'
import { useMemo } from 'react'
import { WFX, USDT, DAI, PUNDIX } from '../../constants/tokens'
import { useActiveWeb3React } from '../../hooks/web3'
import { useMultipleContractSingleData, useSingleCallResult, useSingleContractMultipleData } from '../multicall/hooks'
import { tryParseAmount } from '../swap/hooks'
import { Interface } from '@ethersproject/abi'
import { abi as STAKING_REWARDS_ABI } from '@fxswap/StakingRewards.json'
import { useStakingContract } from '../../hooks/useContract'
import ERC20_ABI from 'abis/erc20.json'
import { MINICHEF_ADDRESS, LPTOKEN_ADDRESS } from 'constants/addresses'

export const STAKING_REWARDS_INTERFACE = new Interface(STAKING_REWARDS_ABI)
export const ERC20_INTERFACE = new Interface(ERC20_ABI)

export const STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: {
    tokens: [Token, Token]
    stakingRewardAddress: string
  }[]
} = {
  [ChainId.DHOBYGHAUT]: [
    {
      tokens: [WETH9[ChainId.DHOBYGHAUT], DAI[ChainId.DHOBYGHAUT]],
      stakingRewardAddress: `0x011018803c5F3c8F4D7cCF0160667BD0Dcab78f1`,
    },
    {
      tokens: [WETH9[ChainId.DHOBYGHAUT], USDT[ChainId.DHOBYGHAUT]],
      stakingRewardAddress: `0xd107cBa4501e8D9165947Bb3F7CA109Cc4F9396A`,
    },
  ],
  [ChainId.FXCORE]: [
    {
      tokens: [WETH9[ChainId.FXCORE], PUNDIX[ChainId.FXCORE]],
      stakingRewardAddress: `0x7eD74ebDA2f2AD577d9ef2aA6b6573b15FC14E39`,
    },
    {
      tokens: [WETH9[ChainId.FXCORE], USDT[ChainId.FXCORE]],
      stakingRewardAddress: `0xb08fD050f877Eb0677bF34537C386A720beCbC7B`,
    },
  ],
}

export interface StakingInfo {
  // the address of the LP Token contract
  stakingRewardAddress: string
  // the tokens involved in this pair
  tokens: [Token, Token]
  // the amount of token currently staked, or undefined if no account
  stakedAmount: CurrencyAmount<Token>
  // the amount of reward token earned, or undefined if no account
  earnedAmount: CurrencyAmount<Token>
  // the total amount of token staked in the contract
  totalStakedAmount: CurrencyAmount<Token>
  // the amount of token distributed per block to all LPs, constant
  totalRewardRate: CurrencyAmount<Token>
  // the current amount of token distributed to account per block.
  // equivalent to percent of total supply * reward rate
  rewardRate: CurrencyAmount<Token>
  allocPoint: JSBI
  // calculates a hypothetical amount of token distributed to account per block.
  getHypotheticalRewardRate: (
    stakedAmount: CurrencyAmount<Token>,
    totalStakedAmount: CurrencyAmount<Token>,
    totalRewardRate: CurrencyAmount<Token>
  ) => CurrencyAmount<Token>
}

// gets the staking info from the network for the active chain id
export function useStakingInfo(pairToFilterBy?: Pair | null): StakingInfo[] {
  const { chainId, account } = useActiveWeb3React()
  const minichefContract = useStakingContract(MINICHEF_ADDRESS[chainId || ChainId.FXCORE])
  const poolMap = useMinichefPools()

  const info = useMemo(
    () =>
      chainId
        ? STAKING_REWARDS_INFO[chainId]?.filter((stakingRewardInfo) =>
            pairToFilterBy === undefined
              ? true
              : pairToFilterBy === null
              ? false
              : pairToFilterBy.involvesToken(stakingRewardInfo.tokens[0]) &&
                pairToFilterBy.involvesToken(stakingRewardInfo.tokens[1])
          ) ?? []
        : [],
    [chainId, pairToFilterBy]
  )

  const pairAddresses = useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info])

  const poolIdArray = useMemo(() => {
    if (!pairAddresses || !poolMap) return []
    const results = pairAddresses.map((address) => poolMap[address ?? ''] ?? undefined)
    if (results.some((result) => result === undefined)) return []
    return results
  }, [poolMap, pairAddresses])

  const poolsIdInput = useMemo(() => {
    if (!poolIdArray) return []
    return poolIdArray.map((pid) => [pid])
  }, [poolIdArray])

  const userInfoInput = useMemo(() => {
    if (!poolIdArray || !account) return []
    return poolIdArray.map((pid) => [pid, account])
  }, [poolIdArray, account])

  const poolInfos = useSingleContractMultipleData(minichefContract, 'poolInfo', poolsIdInput ?? [])
  const userInfos = useSingleContractMultipleData(minichefContract, 'userInfo', userInfoInput ?? [])
  const pendingRewards = useSingleContractMultipleData(minichefContract, 'pendingReward', userInfoInput ?? [])

  const wfx = chainId ? WFX[chainId] : undefined

  const totalSupplies = useMultipleContractSingleData(pairAddresses, ERC20_INTERFACE, 'totalSupply')
  const balances = useMultipleContractSingleData(pairAddresses, ERC20_INTERFACE, 'balanceOf', [
    MINICHEF_ADDRESS[chainId || ChainId.FXCORE],
  ])

  // get all the info from the minichef contract
  const totalAllocPoint = useSingleCallResult(minichefContract, 'totalAllocPoint', []).result
  const rewardPerBlock = useSingleCallResult(minichefContract, 'rewardPerBlock', []).result
  const multiplier = useSingleCallResult(minichefContract, 'BONUS_MULTIPLIER', []).result

  return useMemo(() => {
    if (!chainId || !wfx) return []

    return pairAddresses.reduce<StakingInfo[]>((memo, pairAddress, index) => {
      // these two are dependent on account
      const pendingRewardState = pendingRewards[index]
      const userInfoState = userInfos[index]

      // these get fetched regardless of account
      const balanceState = balances[index]
      const totalSupplyState = totalSupplies[index]
      const poolInfoState = poolInfos[index]

      if (
        // these may be undefined if not logged in
        !pendingRewardState?.loading &&
        // always need these
        totalSupplyState &&
        !totalSupplyState.loading &&
        balanceState &&
        !balanceState?.loading &&
        poolInfoState &&
        !poolInfoState?.loading
      ) {
        if (
          pendingRewardState?.error ||
          userInfoState?.error ||
          balanceState?.error ||
          totalSupplyState.error ||
          poolInfoState.error
        ) {
          console.error('Failed to load staking rewards info')
          return memo
        }

        // get the LP token
        const tokens = info[index].tokens
        const dummyPair = new Pair(
          CurrencyAmount.fromRawAmount(tokens[0], '0'),
          CurrencyAmount.fromRawAmount(tokens[1], '0')
        )

        // check for account, if no account set to 0
        const stakedAmount = CurrencyAmount.fromRawAmount(
          dummyPair.liquidityToken,
          JSBI.BigInt(userInfoState?.result?.['amount'] ?? 0)
        )
        const totalStakedAmount = CurrencyAmount.fromRawAmount(
          dummyPair.liquidityToken,
          JSBI.BigInt(balanceState.result?.[0])
        )
        const allocPoint = JSBI.BigInt(poolInfoState?.result?.['allocPoint'] ?? 0)

        const earnedAmount = CurrencyAmount.fromRawAmount(wfx, JSBI.BigInt(pendingRewardState?.result ?? 0))

        const rewardAmount = JSBI.greaterThan(JSBI.BigInt(totalAllocPoint?.[0] ?? 0), JSBI.BigInt(0))
          ? JSBI.divide(
              JSBI.multiply(
                JSBI.multiply(JSBI.BigInt(multiplier?.[0] ?? 0), JSBI.BigInt(rewardPerBlock?.[0] ?? 0)),
                allocPoint
              ),
              JSBI.BigInt(totalAllocPoint?.[0] ?? 0)
            )
          : JSBI.BigInt(0)

        const totalRewardRate = CurrencyAmount.fromRawAmount(wfx, JSBI.BigInt(rewardAmount ?? 0))

        const getHypotheticalRewardRate = (
          stakedAmount: CurrencyAmount<Token>,
          totalStakedAmount: CurrencyAmount<Token>,
          totalRewardRate: CurrencyAmount<Token>
        ): CurrencyAmount<Token> => {
          return CurrencyAmount.fromRawAmount(
            wfx,
            JSBI.greaterThan(totalStakedAmount.quotient, JSBI.BigInt(0))
              ? JSBI.divide(JSBI.multiply(totalRewardRate.quotient, stakedAmount.quotient), totalStakedAmount.quotient)
              : JSBI.BigInt(0)
          )
        }

        const individualRewardRate = getHypotheticalRewardRate(stakedAmount, totalStakedAmount, totalRewardRate)

        memo.push({
          stakingRewardAddress: pairAddress,
          tokens: info[index].tokens,
          stakedAmount: stakedAmount,
          earnedAmount: earnedAmount,
          totalStakedAmount: totalStakedAmount,
          rewardRate: individualRewardRate,
          totalRewardRate: totalRewardRate,
          allocPoint: allocPoint,
          getHypotheticalRewardRate,
        })
      }
      return memo
    }, [])
  }, [balances, chainId, info, pairAddresses, pendingRewards, balances, wfx])
}

export const useMinichefPools = (): { [key: string]: number } => {
  const { chainId } = useActiveWeb3React()
  const lpTokens = LPTOKEN_ADDRESS[chainId || ChainId.FXCORE]

  return useMemo(() => {
    const poolMap: { [key: string]: number } = {}
    if (lpTokens) {
      lpTokens.forEach((address: string, index: number) => {
        poolMap[address] = index
      })
    }
    return poolMap
  }, [lpTokens])
}

// based on typed value
export function useDerivedStakeInfo(
  typedValue: string,
  stakingToken: Token | undefined,
  userLiquidityUnstaked: CurrencyAmount<Token> | undefined
): {
  parsedAmount?: CurrencyAmount<Token>
  error?: string
} {
  const { account } = useActiveWeb3React()

  const parsedInput: CurrencyAmount<Token> | undefined = tryParseAmount(typedValue, stakingToken)

  const parsedAmount =
    parsedInput && userLiquidityUnstaked && JSBI.lessThanOrEqual(parsedInput.quotient, userLiquidityUnstaked.quotient)
      ? parsedInput
      : undefined

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }
  if (!parsedAmount) {
    error = error ?? 'Enter an amount'
  }

  return {
    parsedAmount,
    error,
  }
}

// based on typed value
export function useDerivedUnstakeInfo(
  typedValue: string,
  stakingAmount: CurrencyAmount<Token>
): {
  parsedAmount?: CurrencyAmount<Token>
  error?: string
} {
  const { account } = useActiveWeb3React()

  const parsedInput: CurrencyAmount<Token> | undefined = tryParseAmount(typedValue, stakingAmount.currency)

  const parsedAmount =
    parsedInput && JSBI.lessThanOrEqual(parsedInput.quotient, stakingAmount.quotient) ? parsedInput : undefined

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }
  if (!parsedAmount) {
    error = error ?? 'Enter an amount'
  }

  return {
    parsedAmount,
    error,
  }
}
