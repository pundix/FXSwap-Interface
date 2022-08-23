import { ChainId } from '@fx-swap/sdk-core'
import { constructSameAddressMap } from '../utils/constructSameAddressMap'

export const MULTICALL_ADDRESSES = constructSameAddressMap('0xC43a7181654639556e4caca1bf9219C14a106401')
export const ROUTER_ADDRESS = constructSameAddressMap('0x4de97358343E530F2f49B76DdD7b151b21e16c57')

export const ARGENT_WALLET_DETECTOR_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.DHOBYGHAUT]: '',
}
export const ENS_REGISTRAR_ADDRESSES = {
  [ChainId.DHOBYGHAUT]: '',
}
