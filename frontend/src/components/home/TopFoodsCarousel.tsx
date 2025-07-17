import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import CarouselItems from "./CarouselItems";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { getPoplularFoods } from "../../server/server";
import type { I18n } from "../../pages/Index";

// interface CarouselProps {
//   t: (value: string) => string;
// }
// type CarouselItemProps = {
//   id: number;
//   image: string;
//   name: string;
//   price?: string;
//   restaurant?: string;
// };

interface Image {
  id:number;
  url:string;
}

interface MenuItem{
  id:number;
  available:boolean;
  foodName:string;
  images:Image[];
  restaurantId:number;
  categoryName:string;
  price:number
}


const Carousel = ({t}:I18n) => {

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,

    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 740,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 427,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    // const navigate = useNavigate()
  
    const getPopularMenuItems = async() =>{
       const data = await getPoplularFoods()
       console.log(data.data)
       setMenuItems(data.data)
    }
  
    useEffect(()=>{
      getPopularMenuItems()
    },[])


  return (
    <section className="w-[100%] p-0 lg:py-10 lg:px-20 bg-white rounded-lg shadow-md">
      <Slider {...settings}>
        {menuItems.map((item: MenuItem) => (
          <CarouselItems
            id={item.id}
            t={t}
            key={item.id}
            foodName={item.foodName}
            image={item.images[0].url}
            price={item.price}
            restaurantId={item.restaurantId}
            available={item.available}
          />
        ))}
      </Slider>
    </section>
  );
};

export default Carousel;
