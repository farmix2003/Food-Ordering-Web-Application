import SearchSection from "../components/landing/SearchSection";
import Carousel from "../components/home/TopFoodsCarousel";
import TopRestaurantsGrid from "../components/home/TopRestaurantsCarousel";
import "./../App.css";
import { useEffect, useState } from "react";
import { getAllRestaurants } from "../server/server";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import type { I18n } from "./Index";
import Footer from "../components/Footer";

interface Image {
  id:number;
  url:string;
}
interface Order {
  id:number;
  shippingAddress:{
    apartment:string;
    cityName:string;
    streetName:string;
  },
  numberOfOrders:number;
}
interface RestaurantProps {
  id:number;
  contactInfo:{phone:string};
  name:string;
  open:boolean;
  cuisineType:string;
  images: Image[]
  orders: Order[]
}

const HomePage = ({t}:I18n) => {
  const [restaurants, setRestaurants] = useState<RestaurantProps[]>([])
  const navigate = useNavigate()
  const getRestaurants = async() =>{
    const data = await getAllRestaurants();
   console.log(data);
   setRestaurants(data)
   
  }
 useEffect(() =>{
  getRestaurants()
 },[])
  return (
    <div className="min-h-screen bg-black/80 bg-img z-100">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8 zz">
          <h1 className="text-4xl font-bold text-gray-200 mb-2">
            {t("welcome")}
          </h1>
          <p className="text-xl text-gray-300 font-semibold ">
            {t('homeDesc')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 zz">
          <SearchSection t={t} />
        </div>
        <div className="black-cover"></div>
        {/* Top Food Carousel */}
        <div className="mb-12 mt-[300px]">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t("popularDishes")}
          </h2>
          <Carousel t={t} />
        </div>

        {/* Top Restaurants Grid */}
        <div className="mb-12">

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t("topRestaurants")}
          </h2>
          <TopRestaurantsGrid restaurants={restaurants} t={t} />
          <Button variant={"link"}onClick={() => navigate("/restaurants")} className="mt-4 font-bold text-amber-700 text-2xl hover:text-amber-800" >Explore All</Button>
        </div>

        {/* Order Again Section */}
        <div className="mb-8">
          {/* <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("orderAgain")}</h2>
          <OrderAgain t={t} /> */}
        </div>
      </div>
          <Footer t={t} />
    </div>
  );
};

export default HomePage;
