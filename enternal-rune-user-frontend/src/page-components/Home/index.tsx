import React from 'react'
import Image from 'next/image'
import ProductList from '@/components/Home/ProductList'
import FeedBack from '@/components/Home/FeedBack'
import FAQ from '@/components/Home/FAQ'
import styles from './Home.module.scss'
import HeroBanner from '@/components/Home/HeroBanner'
import CategoriesSection from '@/components/Home/CategoriesSection'

const companiesLogo = [
  { name: "Framer", logo: "https://saasly.prebuiltui.com/assets/companies-logo/framer.svg", },
  { name: "Huawei", logo: "https://saasly.prebuiltui.com/assets/companies-logo/huawei.svg", },
  { name: "Instagram", logo: "https://saasly.prebuiltui.com/assets/companies-logo/instagram.svg", },
  { name: "Microsoft", logo: "https://saasly.prebuiltui.com/assets/companies-logo/microsoft.svg", },
  { name: "Walmart", logo: "https://saasly.prebuiltui.com/assets/companies-logo/walmart.svg", }
];

const Home = () => {

  return (
    <>
      <HeroBanner />
      <CategoriesSection />
      <div className='bg-gray-50'>
        <div className='container px-10 md:px-20 mx-auto pb-6'>
          <div className='py-20 px-4'>
            <h3 className="text-2xl lg:text-3xl text-center text-gray-800 pb-16 font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Đối tác</span> thương hiệu uy tín
            </h3>
            <div className="overflow-hidden w-full relative max-w-6xl mx-auto select-none">
              <div className="absolute left-0 top-0 h-full w-32 z-10 pointer-events-none bg-gradient-to-r from-gray-50 to-transparent" />

              <div className={`flex ${styles.marqueeInner} will-change-transform max-w-5xl mx-auto`} style={{ whiteSpace: 'nowrap' }}>
                {[...companiesLogo, ...companiesLogo].map((company, index) => (
                  <Image key={index} className="mx-11" src={company.logo} alt={company.name} width={100} height={50} />
                ))}
              </div>

              <div className="absolute right-0 top-0 h-full w-32 z-10 pointer-events-none bg-gradient-to-l from-gray-50 to-transparent" />
            </div>
          </div>
          <ProductList />
          <FAQ />
          <FeedBack />
        </div>
      </div>
    </>
  )
}

export default Home