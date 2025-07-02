import { useEffect, useState } from "react";
import { toast } from "../../hooks/use-toast";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import MenuItemCard from "./MenuItem";
import MenuItemModal from "./MenuItemModal";
import { Edit, Plus, Save, X } from "lucide-react";
import { getRestaurantByUserId, createRestaurant } from "../../server/server";

interface Image{
  id: string;
  url: string;
  fileName: string;
}


interface Restaurant {
  name: string;
  images: Image[];
  cuisineType: string;
  description: string;
  address: {
    streetName: string;
    cityName: string;
  };
  contactInfo: {
  email: string;
  phone: string;
  whatsApp: string;
  instagram: string;
  };
  openingHours: string;
  closingHours: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  extras: { name: string; price: number }[];
}

const RestaurantManagement = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newTag, setNewTag] = useState("");
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    description: "",
    cuisine: "",
    address:{
      streetName: "",
    cityName: "",
    },
    contactInfo:{
      email: "",
    phoneNumber: "",
    whatsAppNumber: "",
    instagram: "",
    },
    openingHours: "",
    closingHours: "",
    image: null as File | null,
  });

  useEffect(() => {
    const fetchRestaurant = async() => {
      try {
        const data = await getRestaurantByUserId();
        if (Object.keys(data).length === 0) {
          setRestaurant(null);
        } else {
            setRestaurant(data)
console.log(data);

        }
       
      console.log(restaurant);
      
      
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch restaurant data",
          variant: "destructive",
        });
      }
    };
    fetchRestaurant();
  }, []);

  const handleSaveRestaurant = () => {
    if (restaurant) {
      toast({
        title: "Restaurant Updated",
        description: "Your restaurant information has been saved successfully.",
      });
      console.log("Restaurant saved:", restaurant);
    }
  };

  const handleCreateRestaurant = async () => {
    console.log("Creating restaurant with data:", newRestaurant);
  try {
    if (!newRestaurant.image) {
      toast({
        title: "Error",
        description: "Please select an image.",
        variant: "destructive",
      });
      return;
    }

    const createdRestaurant = await createRestaurant(
      newRestaurant.name,
      newRestaurant.description,
      {
        streetName: newRestaurant.address.streetName,
        cityName: newRestaurant.address.cityName,
      },
      newRestaurant.openingHours,
      newRestaurant.closingHours,
      newRestaurant.cuisine,
      newRestaurant.image,
      {
        email: newRestaurant.contactInfo.email,
        phone: newRestaurant.contactInfo.phoneNumber,
        whatsAppNumber: newRestaurant.contactInfo.whatsAppNumber,
        instagram: newRestaurant.contactInfo.instagram,
      }
    );
    setRestaurant(createdRestaurant);
    setIsAddRestaurantModalOpen(false);
    setNewRestaurant({
      name: "",
      description: "",
      cuisine: "",
     address:{
       streetName: "",
      cityName: "",
     },
      contactInfo:{
        email: "",
        phoneNumber: "",
        whatsAppNumber: "",
        instagram: "",
      },
      openingHours: "",
      closingHours: "",
      image: null,
    });
    toast({
      title: "Restaurant Created",
      description: "Your restaurant has been created successfully.",
    });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    toast({
      title: "Error",
      description: "Failed to create restaurant",
      variant: "destructive",
    });
  }
};

 

  const handleAddMenuItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Menu Item Deleted",
      description: "The menu item has been removed successfully.",
    });
  };

  const handleSaveMenuItem = (item: Omit<MenuItem, "id">) => {
    if (editingItem) {
      setMenuItems((prev) =>
        prev.map((menuItem) =>
          menuItem.id === editingItem.id
            ? { ...item, id: editingItem.id }
            : menuItem
        )
      );
      toast({
        title: "Menu Item Updated",
        description: "The menu item has been updated successfully.",
      });
    } else {
      const newItem = {
        ...item,
        id: Date.now().toString(),
      };
      setMenuItems((prev) => [...prev, newItem]);
      toast({
        title: "Menu Item Added",
        description: "New menu item has been added successfully.",
      });
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Restaurant Management
            </h1>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              No restaurant found. Create your restaurant to get started!
            </p>
            <Button
              onClick={() => setIsAddRestaurantModalOpen(true)}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Restaurant
            </Button>
          </div>

          <Dialog
            open={isAddRestaurantModalOpen}
            onOpenChange={setIsAddRestaurantModalOpen}
          >
            <DialogContent className="sm:max-w-[600px] bg-white">
              <DialogHeader>
                <DialogTitle>Add New Restaurant</DialogTitle>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto pr-4">
                <div className="grid gap-4 py-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[250px]">
                      <Label htmlFor="name">Restaurant Name</Label>
                      <Input
                        id="name"
                        value={newRestaurant.name}
                        className="outline-none"
                        onChange={(e) =>
                          setNewRestaurant((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-[250px]">
                      <Label htmlFor="cuisine">Cuisine Type</Label>
                      <Input
                        id="cuisine"
                        value={newRestaurant.cuisine}
                        onChange={(e) =>
                          setNewRestaurant((prev) => ({
                            ...prev,
                            cuisine: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[250px]">
                      <Label htmlFor="streetName">Street Name</Label>
                      <Input
                        id="streetName"
                        value={newRestaurant.address.streetName}
                        onChange={(e) =>
                          setNewRestaurant((prev) => ({
                            ...prev,
                            streetName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-[250px]">
                      <Label htmlFor="cityName">City Name</Label>
                      <Input
                        id="cityName"
                        value={newRestaurant.address.cityName}
                        onChange={(e) =>
                          setNewRestaurant((prev) => ({
                            ...prev,
                            cityName: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[250px]">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newRestaurant.contactInfo.email}
                        onChange={(e) =>
                          setNewRestaurant((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-[250px]">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        value={newRestaurant.contactInfo.phoneNumber}
                        onChange={(e) =>
                          setNewRestaurant((prev) => ({
                            ...prev,
                            phoneNumber: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[250px]">
                      <Label htmlFor="whatsAppNumber">WhatsApp Number</Label>
                      <Input
                        id="whatsAppNumber"
                        value={newRestaurant.contactInfo.whatsAppNumber}
                        onChange={(e) =>
                          setNewRestaurant((prev) => ({
                            ...prev,
                            whatsAppNumber: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-[250px]">
                      <Label htmlFor="instagram">Instagram Handle</Label>
                      <Input
                        id="instagram"
                        value={newRestaurant.contactInfo.instagram}
                        onChange={(e) =>
                          setNewRestaurant((prev) => ({
                            ...prev,
                            instagram: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[250px]">
                      <Label htmlFor="openingHours">Opening Hours</Label>
                      <Input
                        id="openingHours"
                        value={newRestaurant.openingHours}
                        onChange={(e) =>
                          setNewRestaurant((prev) => ({
                            ...prev,
                            openingHours: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-[250px]">
                      <Label htmlFor="closingHours">Closing Hours</Label>
                      <Input
                        id="closingHours"
                        value={newRestaurant.closingHours}
                        onChange={(e) =>
                          setNewRestaurant((prev) => ({
                            ...prev,
                            closingHours: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <Label htmlFor="image">Image</Label>
                    <Input
                      id="image"
                      type={"file"}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNewRestaurant((prev) => ({
                            ...prev,
                            image: file,
                          }));
                        }
                      } }
                    />
                  </div>
                  <div className="w-full">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newRestaurant.description}
                      onChange={(e) =>
                        setNewRestaurant((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={4}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddRestaurantModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateRestaurant}>Create Restaurant</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Restaurant Management
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Restaurant Info Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Edit className="h-5 w-5 mr-2" />
                Restaurant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name">Restaurant Name</Label>
                <Input
                  id="name"
                  value={restaurant.name}
                  onChange={(e) =>
                    setRestaurant((prev) => ({ ...prev!, name: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  // value={restaurant.imageUrls ? restaurant.imageUrls[0] : ""}
                  onChange={(e) =>
                    setRestaurant((prev) => ({
                      ...prev!,
                      image: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
                {restaurant.images && (
  <div className="mt-3">
    {restaurant.images.map((img, index) => (
      <div key={index} className="mb-2">
        <img
          src={img?.url}
          alt={`Restaurant preview ${index + 1}`}
          className="w-full h-32 object-cover rounded-lg border"
        />
        <p className="text-sm text-gray-600 mt-1">📄 {img.fileName}</p>
      </div>
    ))}
  </div>
)}

              </div>

              <div>
                <Label htmlFor="cuisine">Cuisine Type</Label>
                <Input
                  id="cuisine"
                  value={restaurant.cuisineType}
                  onChange={(e) =>
                    setRestaurant((prev) => ({
                      ...prev!,
                      cuisine: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="streetName">Street Name</Label>
                <Input
                  id="streetName"
                  value={restaurant.address.streetName}
                  onChange={(e) =>
                    setRestaurant((prev) => ({
                      ...prev!,
                      streetName: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cityName">City Name</Label>
                <Input
                  id="cityName"
                  value={restaurant.address.cityName}
                  onChange={(e) =>
                    setRestaurant((prev) => ({
                      ...prev!,
                      cityName: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={restaurant.contactInfo.email}
                  onChange={(e) =>
                    setRestaurant((prev) => ({
                      ...prev!,
                      email: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={restaurant.contactInfo.phone}
                  onChange={(e) =>
                    setRestaurant((prev) => ({
                      ...prev!,
                      phoneNumber: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="whatsAppNumber">WhatsApp Number</Label>
                <Input
                  id="whatsAppNumber"
                  value={restaurant.contactInfo.whatsApp}
                  onChange={(e) =>
                    setRestaurant((prev) => ({
                      ...prev!,
                      whatsAppNumber: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="instagram">Instagram Handle</Label>
                <Input
                  id="instagram"
                  value={restaurant.contactInfo.instagram}
                  onChange={(e) =>
                    setRestaurant((prev) => ({
                      ...prev!,
                      instagram: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="openingHours">Opening Hours</Label>
                <Input
                  id="openingHours"
                  value={restaurant.openingHours}
                  onChange={(e) =>
                    setRestaurant((prev) => ({
                      ...prev!,
                      openingHours: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="closingHours">Closing Hours</Label>
                <Input
                  id="closingHours"
                  value={restaurant.closingHours}
                  onChange={(e) =>
                    setRestaurant((prev) => ({
                      ...prev!,
                      closingHours: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>


              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={restaurant.description}
                  onChange={(e) =>
                    setRestaurant((prev) => ({
                      ...prev!,
                      description: e.target.value,
                    }))
                  }
                  className="mt-1"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleSaveRestaurant}
                className="w-full text-white bg-orange-600 hover:bg-orange-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Restaurant Info
              </Button>
            </CardContent>
          </Card>

          {/* Menu Management Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  Menu Items ({menuItems.length})
                </CardTitle>
                <Button
                  onClick={handleAddMenuItem}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {menuItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleEditMenuItem}
                    onDelete={handleDeleteMenuItem}
                  />
                ))}
                {menuItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No menu items yet. Add your first item to get started!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Menu Item Modal */}
        <MenuItemModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveMenuItem}
          editingItem={editingItem}
        />
      </div>
    </div>
  );
};

export default RestaurantManagement;