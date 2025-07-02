import SearchSection from "../components/landing/SearchSection";
import OrderAgain from "../components/home/OrderAgain";
import Carousel from "../components/home/TopFoodsCarousel";
import TopRestaurantsGrid from "../components/home/TopRestaurantsCarousel";
import "./../App.css";
const HomePage = () => {
  return (
    <div className="min-h-screen bg-black/80 bg-img z-100">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8 zz">
          <h1 className="text-4xl font-bold text-gray-200 mb-2">
            Welcome to Eat Ease
          </h1>
          <p className="text-xl text-gray-300 font-semibold ">
            Discover delicious meals from your favorite restaurants
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 zz">
          <SearchSection />
        </div>
        <div className="black-cover"></div>
        {/* Top Food Carousel */}
        <div className="mb-12 mt-[240px]">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Popular Dishes
          </h2>
          <Carousel />
        </div>

        {/* Top Restaurants Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Top Restaurants
          </h2>
          <TopRestaurantsGrid />
        </div>

        {/* Order Again Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Again</h2>
          <OrderAgain />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
