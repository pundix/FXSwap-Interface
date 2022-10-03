import React, { useState, useCallback } from 'react'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components/macro'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonError } from '../Button'
import { StakingInfo, useMinichefPools, useDerivedStakeInfo } from '../../state/stake/hooks'
import { useStakingContract } from '../../hooks/useContract'
import { SubmittedView, LoadingView } from '../ModalViews'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import FormattedCurrencyAmount from '../FormattedCurrencyAmount'
import { useActiveWeb3React } from '../../hooks/web3'
import { MINICHEF_ADDRESS } from 'constants/addresses'
import CurrencyInputPanel from '../CurrencyInputPanel'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { Pair } from '@fx-swap/v2-sdk'
import { Token, CurrencyAmount } from '@fx-swap/sdk-core'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: StakingInfo
  userLiquidityUnstaked: CurrencyAmount<Token> | undefined
}

export default function UnstakingModal({ isOpen, onDismiss, stakingInfo }: StakingModalProps) {
  const { chainId } = useActiveWeb3React()

  // track and parse user input
  const [typedValue, setTypedValue] = useState('')
  const { parsedAmount, error } = useDerivedStakeInfo(
    typedValue,
    stakingInfo.stakedAmount.currency,
    stakingInfo.stakedAmount
  )

  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState(false)

  // pair contract for this token to be staked
  const dummyPair = new Pair(
    CurrencyAmount.fromRawAmount(stakingInfo.tokens[0], '0'),
    CurrencyAmount.fromRawAmount(stakingInfo.tokens[1], '0')
  )
  function wrappedOndismiss() {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }

  const stakingContract = useStakingContract(chainId && MINICHEF_ADDRESS[chainId])
  const poolMap = useMinichefPools()

  async function onWithdraw() {
    if (stakingContract && parsedAmount) {
      setAttempting(true)
      await stakingContract
        .withdraw(poolMap[stakingInfo.stakingRewardAddress], `0x${parsedAmount.quotient.toString(16)}`, {
          gasLimit: 300000,
        })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Withdraw deposited liquidity`,
          })
          setHash(response.hash)
        })
        .catch((error: any) => {
          setAttempting(false)
          console.log(error)
        })
    }
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback((typedValue: string) => {
    setTypedValue(typedValue)
  }, [])

  // used for max input button
  const maxAmountInput = maxAmountSpend(stakingInfo.stakedAmount)
  const atMaxAmount = Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput))
  const handleMax = useCallback(() => {
    maxAmountInput && onUserInput(maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOndismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader>Withdraw</TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOndismiss} />
          </RowBetween>
          <CurrencyInputPanel
            value={typedValue}
            onUserInput={onUserInput}
            onMax={handleMax}
            showMaxButton={!atMaxAmount}
            currency={stakingInfo.stakedAmount.currency}
            pair={dummyPair}
            label={''}
            customBalanceText={'Available to withdraw: '}
            id="stake-liquidity-token"
            amount={stakingInfo.stakedAmount}
          />
          {stakingInfo?.earnedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {<FormattedCurrencyAmount currencyAmount={stakingInfo?.earnedAmount} />}
              </TYPE.body>
              <TYPE.body>Unclaimed WFX</TYPE.body>
            </AutoColumn>
          )}
          <TYPE.subHeader style={{ textAlign: 'center' }}>
            When you withdraw, your WFX is claimed and your liquidity is removed from the mining pool.
          </TYPE.subHeader>
          <ButtonError disabled={!!error} error={!!error && !!stakingInfo?.stakedAmount} onClick={onWithdraw}>
            {error ?? 'Withdraw & Claim'}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOndismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.body fontSize={20}>Withdrawing {parsedAmount?.toSignificant(4)} FX-V2</TYPE.body>
            <TYPE.body fontSize={20}>Claiming {stakingInfo?.earnedAmount?.toSignificant(4)} WFX</TYPE.body>
          </AutoColumn>
        </LoadingView>
      )}
      {hash && (
        <SubmittedView onDismiss={wrappedOndismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>Transaction Submitted</TYPE.largeHeader>
            <TYPE.body fontSize={20}>Withdrew FX-V2!</TYPE.body>
            <TYPE.body fontSize={20}>Claimed WFX!</TYPE.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}
