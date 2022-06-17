import { Percent } from '@uniswap/sdk-core'
import { useMemo } from 'react'
import { useUserSlippageToleranceWithDefault } from '../state/user/hooks'

const V2_SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000) // .50%

export default function useSwapSlippageTolerance(): Percent {
  const defaultSlippageTolerance = useMemo(() => {
    return V2_SWAP_DEFAULT_SLIPPAGE
  }, [])
  return useUserSlippageToleranceWithDefault(defaultSlippageTolerance)
}
