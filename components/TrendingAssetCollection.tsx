import { FC } from 'react'
import Link from 'next/link'
import { optimizeImage } from 'lib/optmizeImage'
import FormatEth from 'components/FormatEth'
import usePaginatedCollections from 'hooks/usePaginatedCollections'
import { paths } from '@reservoir0x/reservoir-kit-client'
import { formatNumber } from 'lib/numbers'
import { useRouter } from 'next/router'
import { PercentageChange } from './hero/HeroStats'
import { useMediaQuery } from '@react-hookz/web'

type Props = {
    fallback: {
        collections: paths['/collections/v5']['get']['responses']['200']['schema']
    }
}

type Volumes = '1DayVolume' | '7DayVolume' | '30DayVolume'
const API_BASE =
    process.env.NEXT_PUBLIC_RESERVOIR_API_BASE || 'https://api.reservoir.tools'

const TrendingAssetCollection = () => {
    const isSmallDevice = useMediaQuery('only screen and (max-width : 600px)')
    const router = useRouter()
   
    const sort = router?.query['sort']?.toString()

    // Reference: https://swr.vercel.app/examples/infinite-loading
   
    const columns = isSmallDevice
        ? ['Collection', 'Floor Price']
        : ['Collection', 'Volume', 'Floor Price', 'Supply']
    
    // const logoUrl = `${API_BASE}/redirect/currency/${address}/icon/v1`


    return (
        <div className="mb-11 overflow-x-auto">
            <table className="min-w-full table-auto">
                <thead>
                    <tr>
                        {columns.map((item) => (
                            <th
                                key={item}
                                scope="col"
                                className="reservoir-subtitle px-6 py-3 text-left dark:text-white"
                            >
                                {item}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                   
                    <tr className="group h-[88px] border-b border-neutral-300 font-sans text-left dark:border-neutral-600 dark:text-white">
                                {/* COLLECTION */}
                                <td className="reservoir-body flex items-center gap-4 whitespace-nowrap px-6 py-4 dark:text-white">
                                    <div className="reservoir-h6 mr-6  dark:text-white">
                                   1
                                    </div>
                                    {/* <Link href={tokenHref}> */}
                                        <a className="flex items-center gap-2">
                                <video
                                    src="./luxfinal1.mp4"
                                                // src={optimizeImage(image, 140)}
                                                className="h-[56px] w-[56px] rounded-full object-cover"
                                            />
                                            <div
                                                className={`reservoir-h6 overflow-hidden truncate whitespace-nowrap  dark:text-white ${isSmallDevice ? 'max-w-[140px]' : ''
                                                    }`}
                                            >
                            Lux
                                            </div>
                                        </a>
                                    {/* </Link> */}
                                </td>

                                {/* VOLUME */}
                                {!isSmallDevice && (
                            <td className="reservoir-body ml-14 font-semibold whitespace-nowrap px-6 py-4 dark:text-white">
                                       
                           
                                <span className="m-0 flex">
                                    <img
                                    src="https://api-goerli.reservoir.tools/redirect/currency/0x0000000000000000000000000000000000000000/icon/v1" alt="Currency Logo" style={{ width: "16px" }}


                                /> 879</span>
                                <span className=" block m-0 text-[#06C270]">+89.02%</span>
                                       
                                    </td>
                                )}

                                {/* FLOOR PRICE */}
                        <td className="reservoir-body font-semibold whitespace-nowrap px-6 py-4 dark:text-white">
                               
                            
                                  
                            
                            <span className=" flex"><img
                                src="https://api-goerli.reservoir.tools/redirect/currency/0x0000000000000000000000000000000000000000/icon/v1" alt="Currency Logo" style={{ width: "16px" }}


                            />8.8</span>
                                <span className=" block m-0 text-[#06C270]">+9.75%</span>
                                       
                                    
                                </td>

                                {/* SUPPLY */}
                                {!isSmallDevice && (
                            <td className="reservoir-body  whitespace-nowrap px-6 py-4 dark:text-white">
                                      19,424 
                                    </td>
                                )}
                            </tr>
              
                </tbody>
            </table>
        </div>
    )
}

export default TrendingAssetCollection

