import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import CarouselItems from "./CarouselItems";
import { TopMeals } from "../../constants/TopMeals";

// interface CarouselProps {
//   t: (value: string) => string;
// }
type CarouselItemProps = {
  id: number;
  image: string;
  name: string;
  price?: string;
  restaurant?: string;
};

const Carousel = () => {
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

  return (
    <section className="w-[100%] p-0 lg:py-10 lg:px-20 bg-white rounded-lg shadow-md">
      <Slider {...settings}>
        {TopMeals.map((item: CarouselItemProps) => (
          <CarouselItems
            key={item.id}
            name={item.name}
            image={item.image}
            price={item.price}
            restaurant={item.restaurant}
          />
        ))}
      </Slider>
    </section>
  );
};

export default Carousel;
