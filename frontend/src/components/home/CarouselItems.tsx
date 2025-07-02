import { ShoppingCart } from "@mui/icons-material";
import { Button, Card } from "@mui/material";

type CarouselItemProps = {
  image: string;
  name: string;
  price?: string;
  restaurant?: string;
};

const CarouselItems = ({
  image,
  name,
  price,
  restaurant,
}: CarouselItemProps) => {
  return (
    <Card
      component={"div"}
      className="flex flex-col gap-1 m-2 items-start justify-center shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
    >
      <img
        src={image}
        alt="slider-image"
        className="w-[100%] lg:w-[14rem] lg:h-[14rem] rounded-md"
        style={{ objectFit: "cover", height: "14rem", width: "100%" }}
      />
      <span className="py-2 px-1 font-semibold text-xl text-gray-400">
        {name}
      </span>
      <span className="text-gray-700 p-1 font-bold">{restaurant}</span>
      {/* <Card className="flex items-center justify-between w-full px-2 py-1 bg-gray-100 rounded-md"> */}
      <div className="w-full p-1 flex items-center justify-between">
        <span className="text-xl font-bold text-orange-600">{price}</span>
        <Button
          // onClick={() => handleAddToCart(item)}
          size="medium"
          variant="contained"
          sx={{
            backgroundColor: "#fa7516",
            color: "white",
            ":hover": { backgroundColor: "#ea580c" },
          }}
          className="bg-orange-500 hover:bg-orange-600"
          startIcon={<ShoppingCart className="w-4 h-4" />}
        >
          Add
        </Button>
      </div>
      {/* </Card> */}
    </Card>
  );
};

export default CarouselItems;
