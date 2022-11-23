import React from 'react'
import Header from "../components/Header"




 const about  = () => {
  return (
    <div className=" px-6 md:px-16 justify-center  ">
     
<Header/>
      <div className="py-8 lg:py-16 px-8 mx-auto  mt-2 max-w-screen-md  flex flex-col justify-start items-start">
        <header className=" flex shrink-0 px-10 ml-10  text-black mb-4 text-4xl tracking-tight sm:text-center md:text-center font-extrabold lg:text-left xl:text-left dark:text-white">About</header>

      <div className=" flex flex-col items-center justify-center  ">

          <div className="h-[300px]  pt-3 mt-10 mb-10 flex-col w-3/4 flex-col abt-grad "></div>
          <div className="h-auto w-3/4 leading-tight flex mt-10 text-left shrink-0">
            Lux partners is a decentralized collective disrupting traditional finance with blockchain technology.Lux has interests in multiple tier-one mining operations for the purpose of asset tokenization. Just one operation has capacity to produce 20,000,000+ pounds of uranium U3O8, backed by audited 3rd party mineral reports and a seasoned mining company.
        </div>
      </div>
      </div>
       
       </div>
  )
}
export default about