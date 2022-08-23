import { Currency, TradeType } from '@fx-swap/sdk-core'
import { Trade as V2Trade } from '@fx-swap/v2-sdk'

export function getTradeVersion(trade?: V2Trade<Currency, Currency, TradeType>): 'V2' | undefined {
  if (!trade) return undefined
  return 'V2'
}
