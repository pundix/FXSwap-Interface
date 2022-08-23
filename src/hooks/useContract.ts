import { Contract } from '@ethersproject/contracts'
import { ChainId, WETH9 } from '@fx-swap/sdk-core'
import { abi as IFXSwapV2PairABI } from '@fxswap/FXSwap-Core/IFXSwapV2Pair.json'
import { abi as IFXSwapV2Router02ABI } from '@fxswap/FXSwap-Periphery/IFXSwapV2Router02.json'

import ARGENT_WALLET_DETECTOR_ABI from 'abis/argent-wallet-detector.json'
import ENS_PUBLIC_RESOLVER_ABI from 'abis/ens-public-resolver.json'
import ENS_ABI from 'abis/ens-registrar.json'
import ERC20_ABI from 'abis/erc20.json'
import ERC20_BYTES32_ABI from 'abis/erc20_bytes32.json'
import MULTICALL_ABI from 'abis/multicall.json'
import WFX_ABI from 'abis/wfx.json'
import EIP_2612 from 'abis/eip_2612.json'

import {
  ARGENT_WALLET_DETECTOR_ADDRESS,
  MULTICALL_ADDRESSES,
  ROUTER_ADDRESS,
  ENS_REGISTRAR_ADDRESSES,
} from 'constants/addresses'
import { useMemo } from 'react'
import { getContract } from 'utils'
import { ArgentWalletDetector, EnsPublicResolver, EnsRegistrar, Erc20, Multicall, Wfx } from '../abis/types'
import { useActiveWeb3React } from './web3'

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId in ChainId]?: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { library, account, chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !chainId) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, library, chainId, withSignerIfPossible, account]) as T
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean) {
  const { chainId } = useActiveWeb3React()
  return useContract<Wfx>(chainId ? WETH9[chainId]?.address : undefined, WFX_ABI, withSignerIfPossible)
}

export function useArgentWalletDetectorContract() {
  return useContract<ArgentWalletDetector>(ARGENT_WALLET_DETECTOR_ADDRESS, ARGENT_WALLET_DETECTOR_ABI, false)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean) {
  return useContract<EnsRegistrar>(ENS_REGISTRAR_ADDRESSES, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean) {
  return useContract<EnsPublicResolver>(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useEIP2612Contract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, EIP_2612, false)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IFXSwapV2PairABI, withSignerIfPossible)
}

export function useV2RouterContract(): Contract | null {
  return useContract(ROUTER_ADDRESS, IFXSwapV2Router02ABI, true)
}

export function useMulticallContract() {
  return useContract<Multicall>(MULTICALL_ADDRESSES, MULTICALL_ABI, false) as Multicall
}
