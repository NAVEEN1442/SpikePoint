import React from 'react'
import HeroSection from '../components/HeroSection'
import Work from '../components/Work'
import Footer from '../components/Footer'
import  Navbar  from '../components/Navbar'
import { useDispatch } from 'react-redux'



function Home() {

  const dispatch = useDispatch();




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