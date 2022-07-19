import React, { FC, ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { HiX } from 'react-icons/hi'
import Steps from 'components/Steps'
import { Execute } from '@reservoir0x/reservoir-kit-core'
import FormatEth from 'components/FormatEth'
import Link from 'next/link'

const SOURCE_ID = process.env.NEXT_PUBLIC_SOURCE_ID
const DARK_MODE = process.env.NEXT_PUBLIC_DARK_MODE
const DISABLE_POWERED_BY_RESERVOIR =
  process.env.NEXT_PUBLIC_DISABLE_POWERED_BY_RESERVOIR

type Props = {
  loading: boolean
  onCloseCallback?: () => any
  orderbook?: ('opensea' | 'reservoir')[]
  actionButton?: ReactNode
  onContinue?: () => any
  steps: Execute['steps']
  title: string
}

const orderbooks = {
  opensea: 'OpenSea',
  reservoir: SOURCE_ID || 'Reservoir',
}

const ModalCard: FC<Props> = ({
  actionButton,
  children,
  loading,
  orderbook,
  onCloseCallback,
  onContinue,
  steps,
  title,
}) => {
  // If all executed succesfully, then success is true
  const success =
    !loading && steps && !steps.find(({ status }) => status === 'incomplete')

  const orderbookTitle =
    orderbook && `Submitting to ${orderbooks[orderbook[0]]}`
  const modalTitle = steps && orderbook ? orderbookTitle : title

  return (
    <Dialog.Content className="fixed inset-0 z-[1000] bg-[#000000b6]">
      <div className="fixed top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 transform">
        <div className="px-5">
          <div
            className={`mx-auto overflow-hidden border border-neutral-300 bg-white p-11 shadow-xl dark:border-neutral-600 dark:bg-black md:w-[510px] ${
              DISABLE_POWERED_BY_RESERVOIR ? ' rounded-2xl' : ' rounded-t-2xl'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="reservoir-h4 font-headings dark:text-white">
                {modalTitle}
              </Dialog.Title>
              <Dialog.Close
                onClick={onCloseCallback}
                className="btn-primary-outline p-1.5 dark:border-neutral-600 dark:text-white dark:ring-primary-900 dark:focus:ring-4"
              >
                <HiX className="h-5 w-5" />
              </Dialog.Close>
            </div>
            {steps ? <Steps steps={steps} /> : children}
            {success ? (
              orderbook && orderbook?.length > 1 ? (
                <button
                  onClick={onContinue}
                  className="btn-primary-fill w-full"
                >
                  Continue
                </button>
              ) : (
                <Dialog.Close
                  onClick={onCloseCallback}
                  className="btn-primary-outline w-full dark:border-neutral-600  dark:text-white dark:ring-primary-900 dark:focus:ring-4"
                >
                  Success, Close this menu
                </Dialog.Close>
              )
            ) : (
              <div className="flex gap-4">
                <Dialog.Close
                  onClick={onCloseCallback}
                  className="btn-primary-outline w-full dark:border-neutral-600  dark:text-white dark:ring-primary-900 dark:focus:ring-4"
                >
                  Cancel
                </Dialog.Close>
                {actionButton}
              </div>
            )}
          </div>
          {!DISABLE_POWERED_BY_RESERVOIR && (
            <div className="mx-auto flex items-center justify-center rounded-b-2xl bg-neutral-100 py-4 dark:bg-neutral-800 md:w-[510px]">
              <Link href="https://reservoirprotocol.github.io/">
                <a
                  className="reservoir-tiny flex gap-2 dark:text-white"
                  target="_blank"
                >
                  Powered by{' '}
                  <img
                    src={
                      !!DARK_MODE
                        ? `/reservoir_watermark_dark.svg`
                        : `/reservoir_watermark_light.svg`
                    }
                  />
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Dialog.Content>
  )
}

export default ModalCard

export const ListPrice = ({
  floorSellValue,
}: {
  floorSellValue: number | undefined
}) => {
  if (floorSellValue) {
    return (
      <div className="reservoir-label-m flex items-center gap-2 rounded-[8px] bg-[#E2CCFF] px-2 py-0.5 text-[#111827]">
        <span className="whitespace-nowrap">List Price</span>
        <div>
          <FormatEth amount={floorSellValue} logoWidth={7} />
        </div>
      </div>
    )
  }

  return null
}

export const TopOffer = ({
  topBuyValue,
}: {
  topBuyValue: number | undefined
}) => {
  if (topBuyValue) {
    return (
      <div className="reservoir-label-m flex items-center gap-2 rounded-[8px] bg-[#E2CCFF] px-2 py-0.5">
        <span className="whitespace-nowrap">Current Top Offer</span>
        <div>
          <FormatEth amount={topBuyValue} logoWidth={7} />
        </div>
      </div>
    )
  }

  return null
}
