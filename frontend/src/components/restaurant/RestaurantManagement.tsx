import { useEffect, useState } from "react";
import { toast } from "../../hooks/use-toast";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import MenuItemCard from "./MenuItem";
import MenuItemModal from "./MenuItemModal";
import { Plus } from "lucide-react";
import { getRestaurantByUserId, createRestaurant, deleteRestaurant, addImageToRestaurant, updateRestaurant, deleteImageFromRestaurant, updateRestaurantStatus, getExtrasByRestaurantId, getCategoriesByRestaurantId, addExtrasToMenuItem, addCategoryToRestaurant, addMenuItem, getMenuItemsByRestaurantId } from "../../server/server"; 
import AddNewRestaurantModal from "./AddNewRestaurantModal";
import RestaurantForm from "./RestaurantForm";
interface Image{
  id: number;
  url: string;
  fileName: string;
}

interface Restaurant {
  id: number;
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
  open: boolean;
}

interface MenuItem {
  id: string;
  foodName: string;
  price: number;
  images: Image[];
  description: string;
  extrasList: { name: string; price: number }[];
  available:boolean;
  categoryName:string;
  restaurantId:number;

}
interface NewMenuItem {
  id: string;
  name: string;
  price: number;
  image: File | Blob | null;
  description: string;
  categoryId: number | null;
  extrasIds: number[];
}
const RestaurantManagement = () => {
  const [restaurant, setRestaurant] = useState<Restaurant & {newImages?:File[]} | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [extras, setExtras] = useState<{ id: number; name: string }[]>([]);
const [categories, setCategories] = useState<{ id: number; categoryName: string }[]>([]);

  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    description: "",
    cuisineType: "",
    address:{
      streetName: "",
    cityName: "",
    },
    contactInfo:{
      email: "",
    phoneNumber: "",
    whatsApp: "",
    instagram: "",
    },
    openingHours: "",
    closingHours: "",
    image: null as File | null,
  });

   const fetchRestaurant = async() => {
      try {
        const data = await getRestaurantByUserId();
        if (Object.keys(data).length === 0) {
          setRestaurant(null);
        } else {
            setRestaurant(data)
console.log("Data: ",data);

        }
       
      // console.log(restaurant);
      
      
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch restaurant data",
          variant: "destructive",
        });
      }
    };

  useEffect(() => {
    fetchRestaurant();
  }, []);
  
  const handleDeleteRestaurant = async () => {
    if (!restaurant) return;
  
    try {
      await deleteRestaurant(restaurant.id);
      setRestaurant(null);
      toast({
        title: "Restaurant Deleted",
        description: "The restaurant has been deleted successfully.",
      });
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the restaurant.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteImage = async (imageId: number) => {
  try {
    await deleteImageFromRestaurant(restaurant?.id || 0, imageId);
    setRestaurant((prev) =>
      prev
        ? { ...prev, images: prev.images.filter((img) => img.id !== imageId) }
        : prev
    );
    toast({ title: "Image Deleted", description: "Image removed successfully." });
  } catch (error) {
    toast({ title: "Error", description: "Failed to delete image.", variant: "destructive" });
  }
};

const handleSaveRestaurant = async () => {
  if (!restaurant) return;

  try {
    await updateRestaurant(
      restaurant.id,
      restaurant.name,
      restaurant.description,
      restaurant.address,
      restaurant.openingHours,
      restaurant.closingHours,
      restaurant.cuisineType,
      restaurant.contactInfo
    );

    if (restaurant.newImages?.length) {
      for (const image of restaurant.newImages) {
        await addImageToRestaurant(restaurant.id, image);
      }
    }

    toast({ title: "Restaurant Updated", description: "All changes have been saved." });
    
    setRestaurant((prev) =>
      prev ? { ...prev, newImages: [] } : prev
    );
    fetchRestaurant();
  } catch (error) {
    toast({ title: "Error", description: "Failed to update restaurant", variant: "destructive" });
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
      newRestaurant.cuisineType,
      newRestaurant.image,
      {
        email: newRestaurant.contactInfo.email,
        phone: newRestaurant.contactInfo.phoneNumber,
        whatsApp: newRestaurant.contactInfo.whatsApp,
        instagram: newRestaurant.contactInfo.instagram,
      }
    );
    setRestaurant(createdRestaurant);
    setIsAddRestaurantModalOpen(false);
    setNewRestaurant({
      name: "",
      description: "",
      cuisineType: "",
     address:{
       streetName: "",
      cityName: "",
     },
      contactInfo:{
        email: "",
        phoneNumber: "",
        whatsApp: "",
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

const handleAddMenuItem = (item: Omit<NewMenuItem, "id">) => {
    setEditingItem(null);
    setIsModalOpen(true);
    console.log(restaurant?.id || 0,
      item.name,
      item.price,
      item.image,
      item.description,
      item.extrasIds,
      item.categoryId)
    if (!item.image) {
      toast({
        title: "Error",
        description: "Please select an image for the menu item.",
        variant: "destructive",
      });
      return;
    }
    try{
      const data = addMenuItem(
        restaurant?.id || 0,
        item.name,
        item.price,
        item.image,
        item.description,
        item.extrasIds,
        item.categoryId
      );
      console.log("Adding new menu item");
      data.then(data => console.log(data))
      getExtras()
      getAllMenuItems()
      setIsModalOpen(false)
    }catch(e){
      console.log("Error: ",e)
    }
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

  const handleUpdateRestaurantStatus = async () => {
    if (!restaurant) return;

    try {
      const updatedRestaurant = await updateRestaurantStatus(restaurant.id);
      setRestaurant(updatedRestaurant);
      toast({
        title: "Restaurant Status Updated",
        description: "The restaurant status has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update restaurant status",
        variant: "destructive",
      });
    }
  }


  const getExtras = async() =>{
    const data = await getExtrasByRestaurantId(restaurant?.id || 0);
    console.log("Extras data fetched:", data);
   setExtras(data)
  }
  const getAllMenuItems = async() =>{
    const data = await getMenuItemsByRestaurantId(restaurant?.id||0)
    setMenuItems(data)
    console.log(data)
  }

 const getCategories = async () => {
  const data = await getCategoriesByRestaurantId(restaurant?.id || 0);
  // console.log("Categories data fetched:", data);
  setCategories(data)
 }
  useEffect(() => {
    if (restaurant) {
      getExtras();
      getCategories();
      getAllMenuItems()
    }
  }, [restaurant]);

  const handleAddExtrasToMenuItem = async (name: string, price: number): Promise<number> => {
    try {
      const extraId = await addExtrasToMenuItem(restaurant?.id || 0, name, price);
      console.log("Extras added to menu item:", extraId);
      return extraId;
    } catch (error) {
      console.error("Failed to add extra to menu item:", error);
      throw error;
    }
  }

  const handleAddCategoriesToMenuItem = async (name: string): Promise<number> => {
    try {
      const categoryId = await addCategoryToRestaurant(restaurant?.id || 0, name);
      console.log("Category added to restaurant:", categoryId);
      return categoryId;
    } catch (error) {
      console.error("Failed to add category to restaurant:", error);
      throw error;
    }
  }


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
        <AddNewRestaurantModal
  isOpen={isAddRestaurantModalOpen}
  onClose={() => setIsAddRestaurantModalOpen(false)}
  onSave={handleCreateRestaurant}
  newRestaurant={newRestaurant}
  setNewRestaurant={setNewRestaurant}
/>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
    <span
      className={`px-3 py-1 text-sm rounded-full font-semibold ${
        restaurant?.open ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
      }`}
    >
      {restaurant?.open ? "Open" : "Closed"}
    </span>
    <Button
      size="sm"
      variant="outline"
      className="px-1 text-white bg-orange-600 hover:bg-orange-700"
      onClick={handleUpdateRestaurantStatus}
    >
      {restaurant?.open ? "Close" : "Open"}
    </Button>
  </div>
        </div>

         <div className="grid lg:grid-cols-2 gap-8">
          {/* Restaurant Info Section */}
          <RestaurantForm 
        onSave={handleSaveRestaurant}
        onDelete={handleDeleteRestaurant}
        handleDeleteImage={handleDeleteImage}
        isOpen={isDeleteConfirmOpen}
        setIsOpen={setIsDeleteConfirmOpen}
        restaurant={restaurant}
        setRestaurant={setRestaurant}
        />
       

          {/* Menu Management Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  Menu Items ({menuItems.length})
                </CardTitle>
                <Button
                  onClick={() => {
                    setEditingItem(null);
                    setIsModalOpen(true);
                  }}
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
  onSave={handleAddMenuItem}
  editingItem={
    editingItem
      ? {
          id: editingItem.id,
          name: editingItem.foodName,
          price: editingItem.price,
          image: null,
          description: editingItem.description,
          extras: editingItem.extrasList,
        }
        : null
      }
    existingImages={menuItems.flatMap(menu => menu.images)}
  extras={extras}
  categories={categories}
  onAddExtra={handleAddExtrasToMenuItem}
  onAddCategory={handleAddCategoriesToMenuItem}
/>

      </div>
    </div>
  );
};

export default RestaurantManagement;