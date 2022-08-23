import { Percent } from '@fx-swap/sdk-core'
import { useMemo } from 'react'
import { useUserSlippageToleranceWithDefault } from '../state/user/hooks'

const SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000) // .50%

export default function useSwapSlippageTolerance(): Percent {
  const defaultSlippageTolerance = useMemo(() => {
    return SWAP_DEFAULT_SLIPPAGE
  }, [])
  return useUserSlippageToleranceWithDefault(defaultSlippageTolerance)
}
