import { ChainId, Token } from '@uniswap/sdk-core'

export const WFX = new Token(ChainId.FXCORE, '0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd', 18, 'WFX', 'Wrapped FX')
export const PUNDIX = new Token(
  ChainId.FXCORE,
  '0xd567B3d7B8FE3C79a1AD8dA978812cfC4Fa05e75',
  18,
  'PUNDIX',
  'PUNDI X Token'
)
export const PURSE = new Token(ChainId.FXCORE, '0x5FD55A1B9FC24967C4dB09C513C3BA0DFa7FF687', 18, 'PURSE', 'PURSE Token')
export const USDC = new Token(ChainId.FXCORE, '0x0000000000000000000000000000000000000000', 6, 'USDC', 'USD//C')

export const _WFX = new Token(ChainId.DHOBYGHAUT, '0x3452e23F9c4cC62c70B7ADAd699B264AF3549C19', 18, 'WFX', 'Wrapped FX')
export const _PUNDIX = new Token(
  ChainId.DHOBYGHAUT,
  '0x5db67696C3c088DfBf588d3dd849f44266ff0ffa',
  18,
  'PUNDIX',
  'PUNDI X Token'
)
export const _PURSE = new Token(
  ChainId.DHOBYGHAUT,
  '0xc8B4d3e67238e38B20d38908646fF6F4F48De5EC',
  18,
  'PURSE',
  'PURSE Token'
)

export const _DAI = new Token(
  ChainId.DHOBYGHAUT,
  '0x50dE24B3f0B3136C50FA8A3B8ebc8BD80a269ce5',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const _USDC = new Token(ChainId.DHOBYGHAUT, '0xF5b24c0093b65408ACE53df7ce86a02448d53b25', 6, 'USDC', 'USD//C')
export const _USDT = new Token(
  ChainId.DHOBYGHAUT,
  '0x15C3Eb3B621d1Bff62CbA1c9536B7c1AE9149b57',
  6,
  'USDT',
  'Tether USD'
)
