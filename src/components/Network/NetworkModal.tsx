import React from 'react'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components/macro'
import { DataCard, CardSection } from '../earn/styled'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonLight } from '../Button'
import { useActiveWeb3React } from '../../hooks/web3'
import { CardNoise, CardBGImage } from '../earn/styled'
import { injected } from '../../connectors'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #ff007a 0%, #021d43 100%);
`

export default function NetworkModal({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) {
  const { chainId, account } = useActiveWeb3React()

  function switchNetwork() {
    injected.getProvider().then((provider) => {
      provider
        ?.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chainId === 530 ? '0x15f91' : '0x212',
              rpcUrls: [
                chainId === 530
                  ? 'https://test-fx-json-web3.functionx.io:8545'
                  : 'https://fx-json-web3.functionx.io:8545',
              ],
              chainName: chainId === 530 ? 'FX Testnet' : 'FX Mainnet',
              nativeCurrency: {
                symbol: 'FX',
                decimals: 18,
              },
              blockExplorerUrls: [
                chainId === 530 ? 'https://testnet-explorer.functionx.io/evm' : 'https://explorer.functionx.io/evm',
              ],
            },
          ],
        })
        .catch((error: any) => {
          console.log(error)
        })
    })
    onDismiss()
  }

  function wrappedOnDismiss() {
    onDismiss()
  }

  const toNetwork = chainId !== 530 ? ['Mainnet'] : ['Testnet']

  return (
    <div>
      {account && (
        <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
          <ContentWrapper>
            <ModalUpper>
              <CardBGImage />
              <CardNoise />
              <CardSection>
                <RowBetween>
                  <TYPE.white fontWeight={600}>Select Network</TYPE.white>
                  <CloseIcon onClick={wrappedOnDismiss} style={{ zIndex: 99 }} stroke="white" />
                </RowBetween>
              </CardSection>
            </ModalUpper>
            <AutoColumn style={{ padding: '1rem', paddingTop: '0' }} justify="center">
              <ButtonLight padding="12px 12px" width="90%" borderradius="12px" mt="1rem" onClick={switchNetwork}>
                Switch to {toNetwork}
              </ButtonLight>
            </AutoColumn>
          </ContentWrapper>
        </Modal>
      )}
    </div>
  )
}
