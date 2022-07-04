import { ChainId } from '@uniswap/sdk-core'
import { constructSameAddressMap } from '../utils/constructSameAddressMap'

export const MULTICALL_ADDRESSES = constructSameAddressMap('0xce81b32e327a50779351CC1729e7C3d76B394359')
export const ROUTER_ADDRESS = constructSameAddressMap('0xdb601752f4dC3568eFEFDFb588f86a8C75525f55')

export const ARGENT_WALLET_DETECTOR_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.DHOBYGHAUT]: '',
}
export const ENS_REGISTRAR_ADDRESSES = {
  [ChainId.DHOBYGHAUT]: '',
}
