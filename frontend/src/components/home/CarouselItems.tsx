import { ShoppingCart } from "@mui/icons-material";
import { Button, Card } from "@mui/material";
import { addItemToCart, getRestaurantById, getUserByJwt } from "../../server/server";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


interface User {
  id:number
}

type CarouselItemProps = {
  id:number
  available:boolean;
  foodName:string;
  image:string;
  restaurantId:number;
  price:number
  t:(value:string) =>string
};



const CarouselItems = ({
  id,
  t,
  image,
  foodName,
  price,
  restaurantId,
}: CarouselItemProps) => {

  const [restaurant, setRestaurant] = useState<string>()
  const [user, setUser] = useState<User>()
  const navigate = useNavigate()
  const getRestaurant = async() =>{
    const response = await getRestaurantById(restaurantId)
    setRestaurant(response.name)
  }

  const getUser = async() =>{
    const data = await getUserByJwt()
    setUser(data)
  }

  useEffect(()=>{
    getUser()
    getRestaurant()
  },[])


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
        {foodName}
      </span>
      <span className="text-gray-700 p-1 font-bold">{restaurant}</span>
      {/* <Card className="flex items-center justify-between w-full px-2 py-1 bg-gray-100 rounded-md"> */}
      <div className="w-full p-1 flex items-center justify-between">
        <span className="text-xl font-bold text-orange-600">{price}</span>
        <Button
          onClick={async() => {
            try {
                        await addItemToCart({
                          foodId: id,
                          quantity: 1,
                          extrasIds: []
                        })
                        if(user) {
                          navigate(`/user/cart/${user.id}`);
                        }
          }catch(e){
            console.error("Error while adding item to cart. ",e)
          }
        }
        }
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
          {t("addToCart")}
        </Button>
      </div>
      {/* </Card> */}
    </Card>
  );
};

export default CarouselItems;
