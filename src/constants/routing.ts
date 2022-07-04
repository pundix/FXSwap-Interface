// a list of tokens by chain
import { ChainId, Token, WETH9 } from '@uniswap/sdk-core'
import { DAI, USDT, USDF, WFX } from './tokens'

type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

const WETH_ONLY: ChainTokenList = {
  [ChainId.DHOBYGHAUT]: [WETH9[ChainId.DHOBYGHAUT]],
}
// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.DHOBYGHAUT]: [...WETH_ONLY[ChainId.DHOBYGHAUT], DAI, USDT, USDF],
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.DHOBYGHAUT]: {},
}
// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: Partial<ChainTokenList> = {
  [ChainId.DHOBYGHAUT]: [DAI, USDT, USDF, WFX],
}
// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.DHOBYGHAUT]: [...WETH_ONLY[ChainId.DHOBYGHAUT], DAI, USDT, USDF],
}
export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.DHOBYGHAUT]: [],
}
