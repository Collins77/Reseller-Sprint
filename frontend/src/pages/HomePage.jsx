import React from 'react'
import Header from "../components/Layout/Header";
import Hero from "../components/Route/Hero/Hero";
import Categories from "../components/Route/Categories/Categories";
// import BestDeals from "../components/Route/BestDeals/BestDeals";
// import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Events from "../components/Events/Events";
// import Sponsored from "../components/Route/Sponsored";
import Footer from "../components/Layout/Footer";
import AppPromo from '../components/AppPromo/appPromo';
import HowItWorks from '../components/Route/HowItWorks/HowItWorks';
// import PreviewAllProducts from '../components/Shop/PreviewAllProducts';

const HomePage = () => {
  return (
    <div>
        <Header activeHeading={1} />
        <Hero />
        <HowItWorks />
        <Categories />
        {/* <BestDeals /> */}
        <Events />

        {/* <Sponsored /> */}
        <AppPromo />
        <Footer />
    </div>
  )
}

export default HomePage