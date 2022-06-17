import { Currency } from '@uniswap/sdk-core'

export function currencyId(currency: Currency): string {
  if (currency.isEther) return 'FX'
  if (currency.isToken) return currency.address
  console.log(currency)
  throw new Error('invalid currency')
}
