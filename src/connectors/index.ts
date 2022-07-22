import { ChainId } from '@uniswap/sdk-core'
import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import getLibrary from '../utils/getLibrary'

import { FortmaticConnector } from './Fortmatic'
import { NetworkConnector } from './NetworkConnector'
import FX_LOGO_URL from '../assets/svg/logo.svg'

const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
const PORTIS_ID = process.env.REACT_APP_PORTIS_ID
const WALLETCONNECT_BRIDGE_URL = `https://bridge.walletconnect.org`

const NETWORK_URLS: {
  [chainId in ChainId]: string
} = {
  [ChainId.DHOBYGHAUT]: `https://testnet-fx-json-web3.functionx.io:8545`,
  [ChainId.FXCORE]: `https://fx-json-web3.functionx.io:8545`,
}

const SUPPORTED_CHAIN_IDS = [ChainId.FXCORE, ChainId.DHOBYGHAUT]

export const network = new NetworkConnector({
  urls: NETWORK_URLS,
  defaultChainId: ChainId.FXCORE,
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? getLibrary(network.provider))
}

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
})

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
  rpc: NETWORK_URLS,
  bridge: WALLETCONNECT_BRIDGE_URL,
  qrcode: true,
  pollingInterval: 15000,
})

// Mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: FORMATIC_KEY ?? '',
  chainId: 1,
})

// Mainnet only
export const portis = new PortisConnector({
  dAppId: PORTIS_ID ?? '',
  networks: [1],
})

// Mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URLS[ChainId.FXCORE],
  appName: 'Function X',
  appLogoUrl: FX_LOGO_URL,
})
