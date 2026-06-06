import dynamic from 'next/dynamic'
import HeroSection from '@/components/HeroSection'
import ShopByCollection from '@/components/ShopByCollection'
import Certifications from '@/components/Certifications'
import NewArrivals from '@/components/NewArrivals'
import React from 'react'
import { LOCALES } from '@/middleware'

// Below-fold components — lazy loaded to reduce initial bundle size
const Curated = dynamic(() => import('@/components/Curated'))
const BestSellers = dynamic(() => import('@/components/BestSellers'))
const OurStory = dynamic(() => import('@/components/OurStory'))
const InstagramFeed = dynamic(() => import('@/components/InstagramFeed'))
const Bespoke = dynamic(() => import('@/components/Bespoke'))
const DelhiFair = dynamic(() => import('@/components/DelhiFair'))
const ExhibitionMail = dynamic(() => import('@/components/ExhibitionMail'))
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'))
const Testimonials = dynamic(() => import('@/components/Testimonials'))
const ExploreMore = dynamic(() => import('@/components/ExploreMore'))
const Blog = dynamic(() => import('@/components/Blog'))

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleHomePage({ params }) {
  const { locale } = await params;

  return (
    <div>
      <HeroSection locale={locale} />
      <ShopByCollection />
      <Certifications />
      <NewArrivals />
      <Curated />
      <BestSellers />
      <OurStory />
      <InstagramFeed />
      <Bespoke />
      <DelhiFair />
      <ExhibitionMail />
      <VideoPlayer />
      <Testimonials />
      <ExploreMore />
      <Blog />
    </div>
  )
}
