import { ChainId } from '@uniswap/sdk-core'
import { constructSameAddressMap } from '../utils/constructSameAddressMap'

export const MULTICALL_ADDRESSES = constructSameAddressMap('0xEd6782b6a1e9711aF893DE8BeFF0dC2EC3003e74')
export const V2_ROUTER_ADDRESS = constructSameAddressMap('0x9464BF7e863853c74f595ED103D878954D19E579')

export const ARGENT_WALLET_DETECTOR_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.DHOBYGHAUT]: '',
}
export const ENS_REGISTRAR_ADDRESSES = {
  [ChainId.DHOBYGHAUT]: '',
}
