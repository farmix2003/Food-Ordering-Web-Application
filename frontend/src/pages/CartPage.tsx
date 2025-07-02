import { useState } from "react";
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

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Address {
  id: string;
  title: string;
  fullAddress: string;
  isDefault?: boolean;
}

const mockCartItems: CartItem[] = [
  {
    id: "1",
    name: "Margherita Pizza",
    price: 14.99,
    quantity: 2,
  },
  {
    id: "2",
    name: "Caesar Salad",
    price: 8.99,
    quantity: 1,
  },
  {
    id: "3",
    name: "Chicken Alfredo",
    price: 16.99,
    quantity: 1,
  },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [deliveryAddress, setDeliveryAddress] = useState(
    "123 Main Street, Apt 4B, New York, NY 10001"
  );
  const [showAddressModal, setShowAddressModal] = useState(false);
  const restaurantName = "Mario's Italian Kitchen";

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const handleAddressChange = (address: Address) => {
    setDeliveryAddress(address.fullAddress);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = cartItems.length > 0 ? 2.99 : 0;
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 overflow-scroll">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <Store className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add some delicious items to get started!
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg">
              Browse Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart</h1>
          <div className="flex items-center text-gray-600 mb-2">
            <Store className="w-5 h-5 mr-2" />
            <span className="font-medium">{restaurantName}</span>
          </div>
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
              Change
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center space-x-4 py-4">
                      {/* Item Image Placeholder */}
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {index < cartItems.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({cartItems.length} items)
                  </span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium rounded-lg mt-6"
                  size="lg"
                >
                  Place Order
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our Terms of Service and
                  Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Address Modal */}
        <AddressModal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          onSelectAddress={handleAddressChange}
          currentAddress={deliveryAddress}
        />
      </div>
    </div>
  );
};

export default Cart;
