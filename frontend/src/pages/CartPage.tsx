import { useEffect, useState } from "react";
import { Minus, Plus, Trash2, MapPin, Store, Edit } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/seperator";
import AddressModal from "../components/AddressModal";
import {
  addUserAddress,
  clearCart,
  createOrder,
  deleteCartItem,
  editUserAddress,
  getCartByUserId,
  getUserByJwt,
  removeAddress,
  updateCartItem,
} from "../server/server";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { CurrencyLira } from "@mui/icons-material";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface Image {
  id: number;
  fileName: string;
  url: string;
}

interface Extra {
  id: number;
  name: string;
  price: string;
}

interface CartItem {
  id: number;
  foodName: string;
  pricePerUnit: number;
  quantity: number;
  image?: Image;
  totalPrice: number;
  extras: Extra[];
  restaurantId:number
}

interface CartProps {
  id: number;
  items: CartItem[];
  total: number;
}

interface Address {
  id: number;
  streetName: string;
  apartment: string;
  cityName: string;
}

interface User {
  id: number;
  addressList: Address[];
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartProps>();
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState<User>();
  const { id } = useParams();
  const navigate = useNavigate();
 const {t} = useTranslation()
  const getUserAddress = async () => {
    const data = await getUserByJwt();
    setAddress(data);
    if (data?.addressList?.length > 0) {
      const defaultAddress = data.addressList[0];
      setDeliveryAddress(
        `${defaultAddress.apartment}, ${defaultAddress.streetName}, ${defaultAddress.cityName}`
      );
    }
  };

  useEffect(() => {
    const getUserCart = async () => {
      if (id) {
        const data = await getCartByUserId(Number.parseInt(id));
        setCartItems(data);
      }
    };
    getUserCart();
    getUserAddress();
  }, [id]);

  const updateCartItemQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    await updateCartItem(itemId, quantity);
    if (id) {
      const data = await getCartByUserId(Number.parseInt(id));
      setCartItems(data);
    }
  };

  const handleDeleteCartItem = async (itemId: number) => {
    await deleteCartItem(itemId);
    toast.success("Item deleted successfully");
    if (id) {
      const data = await getCartByUserId(Number.parseInt(id));
      setCartItems(data);
    }
  };

  const handleClearCart = async () => {
    if (!cartItems || cartItems.items.length === 0) return;
    try {
      if (id) {
        await clearCart(Number.parseInt(id));
      }
      toast.success("Cart cleared successfully");
      if (id) {
        const data = await getCartByUserId(Number.parseInt(id));
        setCartItems(data);
      }
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  const handleCreateOrder = async () => {
    if (!address) {
      toast.error("User data not loaded yet");
      return;
    }
  
    const selectedAddress = address.addressList.find(addr =>
      `${addr.apartment}, ${addr.streetName}, ${addr.cityName}` === deliveryAddress
    );
  
    if (!selectedAddress) {
      toast.error("Please select a valid address");
      return;
    }
  
    try {
      const data = await createOrder(selectedAddress.id);
      toast.success("Order created successfully");
      console.log("Order response:", data);
      handleClearCart()
      navigate(`/user/orders/${address.id}`)
    } catch (error) {
      toast.error("Failed to create order");
      console.error(error);
    }
  };
  

  if (!cartItems || cartItems.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 overflow-scroll">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <Store className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {t("cartEmpty")}
            </h2>
            <p className="text-gray-600 mb-8">
              {t("addFoodToCart")}
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
              onClick={() => navigate("/restaurants")}
            >
              {t('browseMenu')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('yourCart')}</h1>
          <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-sm">{deliveryAddress}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddressModal(true)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4 mr-1" />
              {t('change')}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between">
                <CardTitle className="text-xl font-semibold">{t('orderItems')}</CardTitle>
                <Button
                  variant={"destructive"}
                  size="sm"
                  className="bg-red-500 text-white hover:bg-red-600 text-2xl"
                  onClick={handleClearCart}
                >
                  {t('clearCart')}
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                {cartItems.items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center space-x-4 py-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                        <Box
                          component="img"
                          src={item.image?.url}
                          alt={item.foodName}
                          width="100%"
                          height="100%"
                          sx={{ objectFit: "cover", borderRadius: "4px" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.foodName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          <CurrencyLira /> {item.totalPrice.toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          <CurrencyLira /> {(item.pricePerUnit * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCartItem(item.id)}
                        className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {index < cartItems.items.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{t('orderSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {t("subtotal",{subtotal: cartItems.items.length})}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>{t('total')}</span>
                  <span>
                    <CurrencyLira /> {cartItems.total.toFixed(2)}
                  </span>
                </div>
                <Button
                onClick={handleCreateOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium rounded-lg mt-6">
                  {t("placeOrder")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <AddressModal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          currentAddress={deliveryAddress}
          addressList={address?.addressList ?? []}
          onAddAddress={(input) =>
            addUserAddress(input.streetName, input.apartment, input.cityName).then(() => getUserAddress())
          }
          onEditAddress={(id, input) =>
            editUserAddress(id, input.streetName, input.apartment, input.cityName).then(() => getUserAddress())
          }
          onDeleteAddress={(id) => removeAddress(id).then(() => getUserAddress())}
          onSelectAddress={(addr) => {
            setDeliveryAddress(`${addr.apartment}, ${addr.streetName}, ${addr.cityName}`);
            setShowAddressModal(false);
          }}
        />
      </div>
    </div>
  );
};

export default Cart;
