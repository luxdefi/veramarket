import FormatEth from 'components/FormatEth'
import useSales from 'hooks/useSales'
import { optimizeImage } from 'lib/optmizeImage'
import { truncateFromMiddle } from 'lib/truncateText'
import { DateTime } from 'luxon'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { Collection, TokenSale } from 'types/reservoir'
import Image from 'next/image'
import { useMediaQuery } from '@react-hookz/web'

const SOURCE_ID = process.env.NEXT_PUBLIC_SOURCE_ID
const NAVBAR_LOGO = process.env.NEXT_PUBLIC_NAVBAR_LOGO

type Props = {
  collection: Collection
}

const CollectionActivityTable: FC<Props> = ({ collection }) => {
  const headings = ['Event', 'Item', 'Price', 'From', 'To', 'Time']
  const { sales, ref: swrInfiniteRef } = useSales(collection?.id)
  const [nowTimestamp, setNowTimestamp] = useState(0)
  const isMobile = useMediaQuery('only screen and (max-width : 730px)')

  const { data: salesData } = sales
  const flatSalesData = salesData?.flatMap((sale) => sale.sales) || []
  const noSales = flatSalesData.length == 0
  const collectionImage = collection?.metadata?.imageUrl as string

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTimestamp(Date.now())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <table>
      {!isMobile && !noSales && (
        <thead>
          <tr className="text-left">
            {headings.map((name, i) => (
              <th
                key={i}
                className="reservoir-subtitle pt-8 pb-7 font-medium text-neutral-600"
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
      )}

      <tbody>
        {flatSalesData.map((sale) => {
          if (!sale) {
            return null
          }

          return (
            <CollectionActivityTableRow
              key={sale?.id}
              sale={sale}
              collectionImage={collectionImage}
              nowTimestamp={nowTimestamp}
            />
          )
        })}
        {noSales && (
          <div className="mt-20 mb-20 flex w-full flex-col justify-center">
            <img
              src="/magnifying-glass.svg"
              className="h-[59px]"
              alt="Magnifying Glass"
            />
            <div className="reservoir-h6 mt-4 mb-2 text-center dark:text-white">
              No activity yet
            </div>
            <div className="text-center text-xs font-light dark:text-white">
              There hasn&apos;t been any activity for this <br /> collection
              yet.
            </div>
          </div>
        )}
        <tr ref={swrInfiniteRef}></tr>
      </tbody>
    </table>
  )
}

type CollectionActivityTableRowProps = {
  sale: TokenSale
  collectionImage?: string
  nowTimestamp: number
}

const CollectionActivityTableRow: FC<CollectionActivityTableRowProps> = ({
  sale,
  collectionImage,
  nowTimestamp,
}) => {
  const isMobile = useMediaQuery('only screen and (max-width : 730px)')
  const [toShortAddress, setToShortAddress] = useState(sale.to || '')
  const [fromShortAddress, setFromShortAddress] = useState(sale.from || '')
  const [imageSrc, setImageSrc] = useState(
    sale.token?.image || collectionImage || ''
  )
  const [timeAgo, setTimeAgo] = useState(sale.timestamp || '')

  useEffect(() => {
    setToShortAddress(truncateFromMiddle(sale?.from || '', 13))
    setFromShortAddress(truncateFromMiddle(sale?.to || '', 13))
  }, [sale])

  useEffect(() => {
    setTimeAgo(
      sale?.timestamp
        ? DateTime.fromSeconds(sale.timestamp).toRelative() || ''
        : ''
    )
  }, [sale, nowTimestamp])

  useEffect(() => {
    if (sale?.token?.image) {
      setImageSrc(optimizeImage(sale.token.image, 48))
    } else if (collectionImage) {
      setImageSrc(optimizeImage(collectionImage, 48))
    }
  }, [sale, collectionImage])

  if (!sale) {
    return null
  }

  const saleSourceImgSrc =
    SOURCE_ID && sale.orderSource && SOURCE_ID === sale.orderSource
      ? NAVBAR_LOGO
      : `https://api.reservoir.tools/redirect/logo/v1?source=${sale.orderSource}`

  let saleDescription = 'Sale'

  switch (sale?.orderSide) {
    case 'ask': {
      saleDescription = 'Listing Sale'
      break
    }
    case 'bid': {
      saleDescription = 'Offer Sale'
    }
  }

  if (isMobile) {
    return (
      <tr key={sale.id} className="h-24 border-b border-gray-300">
        <td className="flex flex-col gap-2">
          <div className="mt-6">
            <img
              className="mr-2 inline h-6 w-6"
              src={saleSourceImgSrc}
              alt={`${sale.orderSource} Source`}
            />
            <span className="text-sm text-neutral-600">{saleDescription}</span>
          </div>
          <Link
            href={`/${sale.token?.contract}/${sale.token?.tokenId}`}
            passHref
          >
            <a className="flex items-center">
              <Image
                className="rounded object-cover"
                loader={({ src }) => src}
                src={imageSrc}
                alt={`${sale.token?.name} Token Image`}
                width={48}
                height={48}
              />
              <span className="reservoir-h6 ml-2 truncate">
                {sale.token?.name}
              </span>
            </a>
          </Link>
          <div>
            <span className="mr-1 font-light text-neutral-600">From</span>
            <Link href={`/address/${sale.from}`}>
              <a className="font-light text-primary-700">{fromShortAddress}</a>
            </Link>
            <span className="mx-1 font-light text-neutral-600">to</span>
            <Link href={`/address/${sale.to}`}>
              <a className="font-light text-primary-700">{toShortAddress}</a>
            </Link>
            <div className="mb-4 font-light text-neutral-600">{timeAgo}</div>
          </div>
        </td>
        <td>
          <FormatEth amount={sale.price} />
        </td>
      </tr>
    )
  }

  return (
    <tr key={sale.id} className="h-24 border-b border-gray-300">
      <td>
        <div className="mr-2.5 flex items-center">
          <img
            className="mr-2 h-6 w-6"
            src={saleSourceImgSrc}
            alt={`${sale.orderSource} Source`}
          />
          <span className="text-sm text-neutral-600">{saleDescription}</span>
        </div>
      </td>
      <td>
        <Link href={`/${sale.token?.contract}/${sale.token?.tokenId}`} passHref>
          <a className="mr-2.5 flex items-center">
            <Image
              className="rounded object-cover"
              loader={({ src }) => src}
              src={imageSrc}
              alt={`${sale.token?.name} Token Image`}
              width={48}
              height={48}
            />
            <span className="reservoir-h6 ml-2 truncate">
              {sale.token?.name}
            </span>
          </a>
        </Link>
      </td>
      <td>
        <FormatEth amount={sale.price} />
      </td>
      <td>
        <Link href={`/address/${sale.from}`}>
          <a className="mr-2.5 font-light text-primary-700">
            {fromShortAddress}
          </a>
        </Link>
      </td>
      <td>
        <Link href={`/address/${sale.to}`}>
          <a className="mr-2.5 font-light text-primary-700">{toShortAddress}</a>
        </Link>
      </td>
      <td className="w-[1%] whitespace-nowrap font-light text-neutral-600">
        {timeAgo}
      </td>
    </tr>
  )
}

export default CollectionActivityTable
