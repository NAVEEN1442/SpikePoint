import React from 'react'

import HeroSection from '../components/HeroSection'
import Work from '../components/Work'
import Footer from '../components/Footer'
import  Navbar  from '../components/Navbar'

function Home() {
  return (
    <div className=' flex flex-col gap-7 items-center overflow-auto  hide-scrollbar w-full min-h-screen'>


        <Navbar/>

        <HeroSection/>

        <Work/>

        <Footer/>

    </div>
  )
}

export default Home