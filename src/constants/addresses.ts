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

export const MINICHEF_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.DHOBYGHAUT]: '0x430C503bDe5930E98443ECc1CF2B0df0440402Be',
  [ChainId.FXCORE]: '0xc0e2608Ff585DbCA726ae5beA91c24e62F99B243',
}

export const LPTOKEN_ADDRESS: { [chainId in ChainId]: any } = {
  [ChainId.DHOBYGHAUT]: ['0xd107cBa4501e8D9165947Bb3F7CA109Cc4F9396A', '0x011018803c5F3c8F4D7cCF0160667BD0Dcab78f1'],
  [ChainId.FXCORE]: ['0x7eD74ebDA2f2AD577d9ef2aA6b6573b15FC14E39', '0xb08fD050f877Eb0677bF34537C386A720beCbC7B'],
}
