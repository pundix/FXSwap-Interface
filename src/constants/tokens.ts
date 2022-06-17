import { ChainId, Token } from '@uniswap/sdk-core'

export const WFX = new Token(ChainId.DHOBYGHAUT, '0x73D78c97E865447B7d0dC8acFAeD053087a37cf1', 18, 'WFX', 'Wrapped FX')

export const DAI = new Token(
  ChainId.DHOBYGHAUT,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const USDC = new Token(ChainId.DHOBYGHAUT, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C')
export const USDT = new Token(ChainId.DHOBYGHAUT, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const WBTC = new Token(
  ChainId.DHOBYGHAUT,
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  8,
  'WBTC',
  'Wrapped BTC'
)

// Mirror Protocol compat.
export const UST = new Token(ChainId.DHOBYGHAUT, '0xa47c8bf37f92abed4a126bda807a7b7498661acd', 18, 'UST', 'Wrapped UST')
export const MIR = new Token(ChainId.DHOBYGHAUT, '0x09a3ecafa817268f77be1283176b946c4ff2e608', 18, 'MIR', 'Wrapped MIR')
