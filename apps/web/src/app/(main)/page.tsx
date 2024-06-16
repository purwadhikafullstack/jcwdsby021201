import BannerSection from '@/views/home/Banner';
import CategorySection from '@/views/home/Categories';
import FeatureSection from '@/views/home/Feature';
import HeroSection from '@/views/home/Hero';
import ProductSection from '@/views/home/Products';
import * as React from 'react';

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <ProductSection />
      <BannerSection />
      <FeatureSection />
    </>
  );
};

export default Home;
