
import React from 'react'
import Header from "../components/Header"

export default function contact() {
  return (
    <div className="col-span-full px-6 md:px-16 justify-center">
      <Header />
      <section className="bg-white dark:bg-gray-900 items-start">
        <div className="py-8 lg:py-16 px-8 mx-auto mt-10 shrink-0 max-w-screen-md flex flex-col ">
          <h2 className="reservoir-h1 mb-4 text-4xl tracking-tight font-extrabold text-left  dark:text-white">Contact</h2>
          <p className="mb-8 lg:mb-16 font-light text-left  h-auto text-gray-500 leading-tight dark:text-gray-400 sm:text-xl">Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let us know.</p>
          
          <form action="#" className="space-y-3 rounded-[10px] p-3 text-base">
          <div>
          
              <input type="name" id="name" className="g-3 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="Name" required/>
          </div>
          <div>
             
              <input type="email" id="email" className="block g-3 p-3 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="Email" required/>
          </div>
          <div className="sm:col-span-2">
              <textarea id="message" rows="6" className="block g-3 p-3 w-full text-base text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Message"></textarea>
          </div>
            <button type="submit" className="p-3 w-full text-base font-medium text-center text-white rounded-lg bg-black focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Send message</button>
        </form>
      </div>
    </section></div>
  )
}
