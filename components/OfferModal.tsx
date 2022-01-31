import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { HiX } from 'react-icons/hi'
import ExpirationSelector from './ExpirationSelector'
import { DateTime } from 'luxon'
import { BigNumber, constants, ethers } from 'ethers'
import { paths } from 'interfaces/apiTypes'
import { optimizeImage } from 'lib/optmizeImage'
import { getWeth, makeOffer } from 'lib/makeOffer'
import { useBalance, useNetwork, useProvider, useSigner } from 'wagmi'
import calculateOffer from 'lib/calculateOffer'
import { Weth } from '@reservoir0x/sdk/dist/common/helpers'
import { MutatorCallback } from 'swr'
import FormatEth from './FormatEth'

type Props = {
  trigger?: ReactNode
  env: {
    apiBase: string
    chainId: number
    openSeaApiKey: string | undefined
  }
  data:
    | {
        // SINGLE TOKEN OFFER
        token: {
          image: string | undefined
          name: string | undefined
          id: string | undefined
          contract: string | undefined
          topBuyValue: number | undefined
          floorSellValue: number | undefined
        }
        collection: {
          image: undefined
          name: string | undefined
          id: undefined
          tokenCount: undefined
        }
      }
    | {
        // COLLECTION WIDE OFFER
        token: {
          image: undefined
          name: undefined
          id: undefined
          contract: undefined
          topBuyValue: undefined
          floorSellValue: undefined
        }
        collection: {
          image: string | undefined
          name: string | undefined
          id: string | undefined
          tokenCount: number
        }
      }
  royalties: {
    bps: number | undefined
    recipient: string | undefined
  }
  signer: ethers.Signer | undefined
  mutate: MutatorCallback
}
const OfferModal: FC<Props> = ({ trigger, env, royalties, mutate, data }) => {
  const [expiration, setExpiration] = useState<string>('oneDay')
  const [postOnOpenSea, setPostOnOpenSea] = useState<boolean>(false)
  const [waitingTx, setWaitingTx] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [{ data: network }] = useNetwork()
  const [calculations, setCalculations] = useState<
    ReturnType<typeof calculateOffer>
  >({
    fee: constants.Zero,
    total: constants.Zero,
    missingEth: constants.Zero,
    missingWeth: constants.Zero,
    error: null,
    warning: null,
  })
  const [offerPrice, setOfferPrice] = useState<string>('')
  const [weth, setWeth] = useState<{
    weth: Weth
    balance: BigNumber
  } | null>(null)
  const [{ data: signer }] = useSigner()
  const [{ data: ethBalance }, getBalance] = useBalance()
  const provider = useProvider()
  const bps = royalties?.bps ?? 0
  const royaltyPercentage = `${bps / 100}%`
  const closeButton = useRef<HTMLButtonElement>(null)
  const isInTheWrongNetwork = network.chain?.id !== env.chainId
  const isCollectionWide = !!data.collection.id

  useEffect(() => {
    async function loadWeth() {
      if (signer) {
        await getBalance({ addressOrName: await signer?.getAddress() })
        const weth = await getWeth(env.chainId as 1 | 4, provider, signer)
        if (weth) {
          setWeth(weth)
        }
      }
    }
    loadWeth()
  }, [signer])

  useEffect(() => {
    const userInput = ethers.utils.parseEther(
      offerPrice === '' ? '0' : offerPrice
    )
    if (weth?.balance && ethBalance?.value) {
      const calculations = calculateOffer(
        userInput,
        ethBalance.value,
        weth.balance,
        bps
      )
      setCalculations(calculations)
    }
  }, [offerPrice])

  return (
    <Dialog.Root onOpenChange={() => setSuccess(false)}>
      <Dialog.Trigger asChild>
        {trigger ?? (
          <button
            disabled={!signer || isInTheWrongNetwork}
            className="btn-neutral-outline w-full border-neutral-900"
          >
            Make Offer
          </button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="absolute inset-0 h-screen backdrop-blur-sm">
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[360px] -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-white p-6 shadow-md">
            <div className="mb-5 flex items-center justify-between">
              <Dialog.Title className="text-lg font-medium uppercase opacity-75">
                {isCollectionWide
                  ? 'Make a collection offer'
                  : 'Make a token offer'}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button ref={closeButton} className="btn-neutral-ghost p-1.5">
                  <HiX className="h-5 w-5 " />
                </button>
              </Dialog.Close>
            </div>
            <div className="mb-3 flex items-center gap-4">
              <img
                src={optimizeImage(
                  data.token.image ?? data.collection.image,
                  50
                )}
                alt=""
                className="w-[50px]"
              />
              <div className="overflow-auto">
                <div className="text-sm">
                  {isCollectionWide ? 'Collection' : data.collection.name}
                </div>
                <div className="my-1.5 text-lg font-medium">
                  {data.token.name ?? data.collection.name}
                </div>
                <div className="mb-1.5 text-sm">
                  {isCollectionWide
                    ? `${data.collection.tokenCount} Eligible Tokens`
                    : '1 Eligible Token'}
                </div>
              </div>
            </div>
            {!isCollectionWide && (
              <div className="mb-5 flex flex-wrap items-stretch gap-1.5 text-sm">
                {data.token.topBuyValue && (
                  <div className="flex items-center gap-2 rounded-md bg-blue-100 px-2 py-0.5 text-blue-900">
                    <span className="whitespace-nowrap">Current Top Offer</span>
                    <div className="font-semibold">
                      <FormatEth
                        amount={data.token.topBuyValue}
                        maximumFractionDigits={4}
                        logoWidth={7}
                      />
                    </div>
                  </div>
                )}
                {data.token.floorSellValue && (
                  <div className="flex items-center gap-2 rounded-md bg-blue-100 px-2 py-0.5 text-blue-900">
                    <span className="whitespace-nowrap">List Price</span>
                    <div className="font-semibold">
                      <FormatEth
                        amount={data.token.floorSellValue}
                        maximumFractionDigits={4}
                        logoWidth={7}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="mb-8 space-y-5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="price"
                  className="font-medium uppercase opacity-75"
                >
                  Price (wETH)
                </label>
                <input
                  placeholder="Insert price"
                  id="price"
                  type="number"
                  min={0}
                  step={0.01}
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="input-blue-outline w-[120px]"
                />
              </div>
              {!isCollectionWide && (
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="postOpenSea"
                    className="font-medium uppercase opacity-75"
                  >
                    Also post to Open Sea
                  </label>
                  <input
                    type="checkbox"
                    name="postOpenSea"
                    id="postOpenSea"
                    className="scale-125 transform"
                    checked={postOnOpenSea}
                    onChange={(e) => setPostOnOpenSea(e.target.checked)}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <ExpirationSelector
                  presets={expirationPresets}
                  setExpiration={setExpiration}
                  expiration={expiration}
                />
              </div>
              <div className="flex justify-between">
                <div className="font-medium uppercase opacity-75">Fees</div>
                <div className="text-right">
                  <div>Royalty {royaltyPercentage}</div>
                  <div>Marketplace 0%</div>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="font-medium uppercase opacity-75">
                  Total Cost
                </div>
                <div className="text-2xl font-bold">
                  <FormatEth
                    amount={calculations.total}
                    maximumFractionDigits={4}
                    logoWidth={10}
                  />
                </div>
              </div>
              {calculations.error && (
                <div className="rounded-md bg-red-100 px-2 py-1 text-red-900">
                  {calculations.error}
                </div>
              )}
              {calculations.warning && (
                <div className="rounded-md bg-yellow-100 px-2 py-1 text-yellow-900">
                  {calculations.warning}
                </div>
              )}
            </div>
            {success ? (
              <Dialog.Close asChild>
                <button className="btn-green-fill w-full">
                  Success, Close this menu
                </button>
              </Dialog.Close>
            ) : (
              <div className="flex items-center gap-4">
                <Dialog.Close asChild>
                  <button className="btn-neutral-fill w-full">Cancel</button>
                </Dialog.Close>
                <button
                  disabled={
                    +offerPrice <= 0 ||
                    !calculations.missingEth.isZero() ||
                    waitingTx
                  }
                  onClick={async () => {
                    const expirationValue = expirationPresets
                      .find(({ preset }) => preset === expiration)
                      ?.value()

                    const fee = royalties?.bps?.toString()

                    if (!signer || !expirationValue || !fee || !ethBalance) {
                      console.debug({
                        signer,
                        expirationValue,
                        fee,
                        ethBalance,
                        env,
                      })
                      return
                    }

                    // Wait for transactions to complete
                    try {
                      const maker = await signer.getAddress()

                      const feeRecipient = royalties?.recipient || maker

                      let query: Parameters<typeof makeOffer>[6] = {
                        maker,
                        side: 'buy',
                        price: calculations.total.toString(),
                        fee,
                        feeRecipient,
                        expirationTime: expirationValue,
                      }

                      if (isCollectionWide) {
                        query.collection = data.collection.id
                      } else {
                        query.contract = data.token.contract
                        query.tokenId = data.token.id
                      }

                      // Set loading state for UI
                      setWaitingTx(true)

                      await makeOffer(
                        env.chainId as 1 | 4,
                        provider,
                        calculations.total,
                        env.apiBase,
                        env.openSeaApiKey,
                        signer,
                        query,
                        postOnOpenSea,
                        calculations.missingWeth
                      )
                      // Close modal
                      // closeButton.current?.click()
                      await mutate()
                      setSuccess(true)
                      setWaitingTx(false)
                    } catch (error) {
                      setWaitingTx(false)
                    }
                  }}
                  className="btn-blue-fill w-full"
                >
                  {waitingTx ? 'Waiting...' : 'Make Offer'}
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default OfferModal

const expirationPresets = [
  {
    preset: 'oneHour',
    value: () =>
      DateTime.now().plus({ hours: 1 }).toMillis().toString().slice(0, -3),
    display: '1 Hour',
  },
  {
    preset: 'oneDay',
    value: () =>
      DateTime.now().plus({ days: 1 }).toMillis().toString().slice(0, -3),
    display: '1 Day',
  },
  {
    preset: 'oneWeek',
    value: () =>
      DateTime.now().plus({ weeks: 1 }).toMillis().toString().slice(0, -3),
    display: '1 Week',
  },
  {
    preset: 'none',
    value: () => '0',
    display: 'None',
  },
]
