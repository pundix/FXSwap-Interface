import { ChainId } from '@uniswap/sdk-core'

const FXSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  530: '',
  90001: 'testnet-',
}

export enum ExplorerDataType {
  TRANSACTION = 'transaction',
  TOKEN = 'token',
  ADDRESS = 'address',
  BLOCK = 'block',
}

/**
 * Return the explorer link for the given data and data type
 * @param chainId the ID of the chain for which to return the data
 * @param data the data to return a link for
 * @param type the type of the data
 */
export function getExplorerLink(chainId: ChainId, data: string, type: ExplorerDataType): string {
  const prefix = `https://${FXSCAN_PREFIXES[chainId] || FXSCAN_PREFIXES[530]}explorer.functionx.io/evm`

  switch (type) {
    case ExplorerDataType.TRANSACTION: {
      return `${prefix}/tx/${data}`
    }
    case ExplorerDataType.TOKEN: {
      return `${prefix}/token/${data}`
    }
    case ExplorerDataType.BLOCK: {
      return `${prefix}/block/${data}`
    }
    case ExplorerDataType.ADDRESS:
    default: {
      return `${prefix}/address/${data}`
    }
  }
}
