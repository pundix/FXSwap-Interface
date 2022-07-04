import { ChainId, Token } from '@uniswap/sdk-core'

export const WFX = new Token(ChainId.DHOBYGHAUT, '0x3452e23F9c4cC62c70B7ADAd699B264AF3549C19', 18, 'WFX', 'Wrapped FX')

export const DAI = new Token(
  ChainId.DHOBYGHAUT,
  '0x50dE24B3f0B3136C50FA8A3B8ebc8BD80a269ce5',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const USDC = new Token(ChainId.DHOBYGHAUT, '0xF5b24c0093b65408ACE53df7ce86a02448d53b25', 6, 'USDC', 'USD//C')
export const USDT = new Token(ChainId.DHOBYGHAUT, '0x15C3Eb3B621d1Bff62CbA1c9536B7c1AE9149b57', 6, 'USDT', 'Tether USD')
export const USDF = new Token(ChainId.DHOBYGHAUT, '0x205CF44075E77A3543abC690437F3b2819bc450a', 6, 'USDF', 'FolgoryUSD')
