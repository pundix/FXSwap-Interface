import { ChainId } from '@uniswap/sdk-core'

export function constructSameAddressMap<T extends string>(address: T): { [chainId in ChainId]: T } {
  return {
    [ChainId.DHOBYGHAUT]: address,
    [ChainId.FXCORE]: address,
  }
}
