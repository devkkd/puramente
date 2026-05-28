import Bespoke from '@/components/Bespoke'
import BestSellers from '@/components/BestSellers'
import Blog from '@/components/Blog'
import Category from '@/components/Category'
import Certifications from '@/components/Certifications'
import Curated from '@/components/Curated'
import DelhiFair from '@/components/DelhiFair'
import ExhibitionMail from '@/components/ExhibitionMail'
import ExploreMore from '@/components/ExploreMore'
import HeroSection from '@/components/HeroSection'
import InstagramFeed from '@/components/InstagramFeed'
import NewArrivals from '@/components/NewArrivals'
import OurStory from '@/components/OurStory'
import QuestionsBanner from '@/components/QuestionsBanner'
import ShopByCollection from '@/components/ShopByCollection'
import Testimonials from '@/components/Testimonials'
import VideoPlayer from '@/components/VideoPlayer'
import React from 'react'

export default function page() {
  return (
    <div>
      <HeroSection />
      <ShopByCollection />
      <Certifications />
      {/* <Category /> */}
      <NewArrivals />
      <Curated />
      <BestSellers />
      <OurStory />
      <InstagramFeed/>
      <Bespoke />
      <DelhiFair />
      <ExhibitionMail />
      <VideoPlayer/>
      <Testimonials/>
      <ExploreMore/>
      <Blog/>
    </div>
  )
}
